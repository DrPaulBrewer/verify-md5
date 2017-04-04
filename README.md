# verify-md5

A standalone program to compare a file of md5 hash signatures in `/path/to/md5.json` to the md5 hashes of the contents of the listed files in that same directory

## Installation

To install globally:

    npm i verify-md5 -g

## Prerequisites

1. `nodejs` is installed and accesible by invoking `node`
1. An `md5.json` file consisting of an object with filenames as keys and base64 md5 as value for each key.

Example md5.json file:

<pre>
{
  "data.csv": "fi5F17hHxxqZ9E6gpUlvfA==",
  "profit.csv": "NbLa4M1gKG5Mi1gREVtwWg==",
  "trade.csv": "PTIe1aHM/ww85vzA6UbMAg==",
  "volume.csv": "z8pesXd3MJ7PjmQq+MhNrw==",
  "secretcode.js": "ho5ejYGt7uYwtEZSg8M7QQ==",
  "someotherfile.json": "7Vl0EF+dhruo4YhBFlaW8g=="
}
</pre>


## Usage

If the path begins with `gs://` it refers to a Google Cloud Storage[tm] bucket, e.g. `gs://bucketName/path/to/md5.json`

    verify-md5 --key /path/to/secret/myserviceaccountkey.json gs://bucketName/path/to/md5.json
    
If the path is a filesystem path, the local filesystem is used:

    verify-md5 /path/to/md5.json

`--json` enables json output:

`json` output is a 4 element array:

`[true|false, goodFiles, badFiles, failErrors, dirname]`

Otherwise, "human-readable" output is used.

### Examples

Success example, using storage bucket.

<pre>
verify-md5 --key secret.json gs://somebucket/path/to/md5.json
bucket is somebucket
path is path/to/md5.json
OK gs://somebucket/path/to/md5.json
ok:    effalloc.csv
ok:    ohlc.csv
ok:    profit.csv
ok:    sim.json
ok:    trade.csv
ok:    volume.csv
</pre>

Failure example, with local file system.

<pre>
verify-md5 /tmp/test/md5.json 
FAIL /tmp/test/md5.json
ok:    effalloc.csv
ok:    ohlc.csv
ok:    sim.json
ok:    profit.csv
ok:    trade.csv
fail:  volume.csv md5 File Verification Error on file: /tmp/test/volume.csv : expected: z8pesXd3MJ7PjmQq+MhNrw== actual: 8VMdzVVyB0zpNxwmtJRwUw==
</pre>

<pre>
verify-md5 --json /tmp/test/md5.json 
[
  false,
  [
    "effalloc.csv",
    "ohlc.csv",
    "sim.json",
    "profit.csv",
    "trade.csv"
  ],
  [
    "volume.csv"
  ],
  {
    "volume.csv": {
      "name": "MD5FileVerificationError",
      "message": "md5 File Verification Error on file: /tmp/test/volume.csv : expected: z8pesXd3MJ7PjmQq+MhNrw== actual: 8VMdzVVyB0zpNxwmtJRwUw==",
      "stack": "Error\n    at new MD5FileVerificationError (/usr/local/lib/node_modules/verify-md5/node_modules/verify-fsdir-md5/index.js:17:19)\n    at hasha.fromFile.then (/usr/local/lib/node_modules/verify-md5/node_modules/verify-fsdir-md5/index.js:50:19)\n    at process._tickCallback (internal/process/next_tick.js:103:7)",
      "actual": "8VMdzVVyB0zpNxwmtJRwUw==",
      "expected": "z8pesXd3MJ7PjmQq+MhNrw==",
      "file": "/tmp/test/volume.csv"
    }
  },
  "/tmp/test/"
]
</pre>

## Authentication / Authorization

`verify-md5` on a filesystem path runs with the permissions of the current user.

`verify-md5` on a `gs://` path will attempt to authenticate with the Google Storage API.

Unless you run in the Google Cloud, you will need to include a `--key keyfilename` to access your buckets.

If you need to generate a key for your project, look in the IAM section of the Google Cloud Platform Console and generate  either: 

* a service account key for role: Storage Object Viewer
* or, for granularity, a new service account with no permissions, added as a reader to an individual bucket acl.

Important: It is solely your responsibility to keep API keys secret and manage related security and financial risks.

## Storage API usage

Only the bucket's `md5.json` file is downloaded with a `storage.bucket.file.download` call.  

Then `storage.bucket.file.get` calls are used to access md5 metadata for each file, not `.download()` calls.  

Creating the necessary md5 metadata in the bucket is normally automatic when objects are stored.

Creating the `md5.json` file in the bucket to enable these comparisons is your responsibility.

## Help

    verify-md5 --help

prints this reminder message

<pre>

  Usage: verify-md5 [options] <pathTomd5json>

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    --key [keyfile]  keyfile to access Google Cloud Storage API
    --json           output test results in json

</pre>


## Copyright

Copyright 2017 Paul Brewer, Economic and Financial Technology Consulting LLC <drpaulbrewer@eaftc.com>

## License

The MIT License

### Trademarks

Google Cloud Storage[tm] is a trademark of Google, Inc.

This software is not a product of Google, Inc.
