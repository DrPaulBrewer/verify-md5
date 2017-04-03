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

If the path is a filesystem path, the local filesystem is used, e.g:  `/path/to/md5.json`

If the path begins with `gs://` it refers to a Google Cloud Storage[tm] bucket, e.g. `gs://bucketName/path/to/md5.json`

Unless you run in the Google Cloud, you probably need a key to access buckets.

If you need to generate one for your project, look in the IAM section of the Google Cloud Platform Console and generate a service account key for role: Storage Object Viewer
or, for granularity, you can generate a new service account with no permissions, and add it as a reader to an individual bucket acl.

## Help

    verify-md5 --help

prints this reminder message

<pre>

  Usage: bin [options] <pathTomd5json>

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
