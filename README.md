#   Multi-Part Components Parser

**Status:** This is a work in progress. May not fit _all_ potential use-cases. The implementation is straightforward and unoptimized for very large files, very large number of files, etc.

For full documentation see the **[MPC Wiki][wiki]**.

### Installation

You will need Node.js and npm to install MPC Parser. You can [get Node.js and npm here][nodejs-install]. Then run this from your command line:

```bash
$ npm install -g mpc
```

### Quick start

1. Check out this package from GitHub:

``` bash
$ git clone https://github.com/emilis/mpc
```

2. Open examples directory:

```bash
$ cd mpc/examples/
```

3. Check if command line utility is working by listing all `*.mpc` file parts in current examples directory:

```bash
$ mpc .
```

You should get a list of parts inside `*.mpc` files in CSV format similar to this:

```csv
/path/to/mpc/examples/alpha,requirements,/path/to/mpc/examples/alpha.mpc,22,22
/path/to/mpc/examples/alpha,partX,/path/to/mpc/examples/alpha.mpc,61,11
/path/to/mpc/examples/alpha,partY,/path/to/mpc/examples/alpha.mpc,156,12
/path/to/mpc/examples/beta,requirements,/path/to/mpc/examples/beta.mpc,82,8
/path/to/mpc/examples/beta,partX,/path/to/mpc/examples/beta.mpc,174,10
/path/to/mpc/examples/beta,partZ,/path/to/mpc/examples/beta.mpc,268,11
...
```

For further info on using mpc from the command line see **[MPC CLI utility][wiki-cli]** wiki page.

4. Check if the Node.js package is usable by running this from the examples directory:

```javascript
$ node
>  require("mpc").parseDir( process.cwd() );
```

You should see and Array of component objects similar to this:

```javascript
[ { name: '/home/emilis/work/mpc/examples/dir/zeta',
    parts: [ [Object] ] },
  { name: '/home/emilis/work/mpc/examples/delta',
    parts: [ [Object] ] },
...
```

For further introduction to using mpc in Node.js see **[Node.js Modules][wiki-nodejs]** wiki page.

To see more examples see **[Examples][wiki-examples]** wiki page.

##  Contributing

*   Please use Github Issues for bug reporting and feature requests.
*   Please keep your pull requests small and make sure they merge easily with the master branch before submitting.
*   Please send any other feedback to my email: <emilis.d@gmail.com>. It is most welcome.

##  Copyright and License

Copyright 2014 Emilis Dambauskas <emilis.d@gmail.com>.

This is free software, and you are welcome to redistribute it under certain conditions; see LICENSE.txt for details.

MPC Parser is licensed under GPL v3. Please email me if you need other licensing options.


[wiki]:             https://github.com/emilis/mpc/wiki
[wiki-cli]:         https://github.com/emilis/mpc/wiki/CLI-Utility
[wiki-nodejs]:      https://github.com/emilis/mpc/wiki/Node.js-Modules
[wiki-examples]:    https://github.com/emilis/mpc/wiki/Examples
[nodejs-install]:   http://nodejs.org/download/
