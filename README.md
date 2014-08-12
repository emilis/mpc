#   Multi-Part Components Parser

A command-line program and a Node.js package for extracting information from multi-part components.

**Status:** This is a work in progress. May not fit _all_ potential use-cases. The implementation is straightforward and unoptimized for very large files, very large number of files, etc.

##  Installation

```bash
$ npm install -g mpc
```

##  Usage

### Usage in command line

```bash
$ mpc -h
Usage: mpc [OPTIONS] DIR/FILE [DIR/FILE...]
Options:
    -a / --all             Include all files (not only *.mpc).
    -r / --recursive       Include all required components recursively.
    -s / --sort            Sort components by dependency order.
    -p / --parts p1,p2,..  Output only specified parts / components having the parts.
    -f / --format fmt      Output component information in specified format. One of: csv/json.
    -c / --cat             Output concatenated part contents (requires -p).
    -h / --help            Print this help message.
    -v / --version         Print version information.
```

### Usage in Node.js

Get components in directory:

```js
var mpc =           require( "mpc" );
var components =    mpc.parseDir( yourDirectory );
```

Get components from file and all its dependencies:

```js
var mpc =           require( "mpc" );
var components =    mpc.parseFile( pathToYourFile, { recursive: true } );
```

##  Contributing

*   Please use Github Issues for bug reporting and feature requests.
*   Please keep your pull requests small and make sure they merge easily with the master branch before submitting.
*   Please send any other feedback to my email: <emilis.d@gmail.com>. It is most welcome.

##  Copyright and License

Copyright 2014 Emilis Dambauskas <emilis.d@gmail.com>.

This is free software, and you are welcome to redistribute it under certain conditions; see LICENSE.txt for details.
