#!/usr/bin/env node

/* Copyright 2017 Paul Brewer, Economic and Financial Technology Consulting LLC */
/* This file is open source software.  The MIT License applies to this software. */

/* jshint node:true,esnext:true,eqeqeq:true,undef:true,lastsemic:true */

const verifyFSmd5 = require('verify-fsdir-md5');
const verifyGCSmd5Factory = require('verify-bucket-md5');
const fs = require('fs');
const program = require('commander');
let storage;
const storageFactory = require('@google-cloud/storage');
let credentials;
let useJSON = false;
let pathToMD5dotJSON;

function setAPIKey(keyFilename){
    projectId = JSON.parse(fs.readFileSync(keyFilename)).project_id;
    credentials = { projectId, keyFilename };
}

function setJSON(){
    useJSON = true;
}

function explain(status){
    console.log(((status[0])? "OK": "FAIL")+" "+pathToMD5dotJSON);
    status[1].forEach((f)=>(console.log("ok:    "+f)));
    status[2].forEach((f)=>(console.log("fail:  "+f+" "+status[3][f].message)));
}

function output(status){
    if (useJSON)
	console.log(JSON.stringify(status,null,2));
    else
	explain(status);
}

(program
 .version('0.1.0')
 .usage('[options] <pathTomd5json>')
 .option('--key [keyfile]', 'keyfile to access Google Cloud Storage API', setAPIKey)
 .option('--json','output test results in json', setJSON)
 .action(function(path){
     pathToMD5dotJSON = path;
     const rawBucketMatch = /^gs:\/\/[^\/]+\//.exec(pathToMD5dotJSON);
     if (rawBucketMatch){
	 const rawBucket = rawBucketMatch[0];
	 const storage = storageFactory(credentials);
	 const verify = verifyGCSmd5Factory(storage);
	 const bucket = rawBucket.replace('gs://','').replace(/\/$/,'');
	 const path = pathToMD5dotJSON.replace(rawBucket,'');
	 console.log("bucket is "+bucket);
	 console.log("path is "+path);
	 verify(bucket,path).then(function(status){ output(status);}, function(e){ console.log(e.name+':'+e.message); });
     } else {
	 verifyFSmd5(pathToMD5dotJSON).then(function(status){ output(status);}, function(e){ console.log(e.name+':'+e.message); });
     }
 })
 .parse(process.argv)
);



