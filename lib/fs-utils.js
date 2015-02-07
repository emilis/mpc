/** Copyright ------------------------------------------------------------------

    Copyright 2014 Emilis Dambauskas <emilis.d@gmail.com>.

    This file is part of MPC parser.

    MPC parser is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MPC parser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MPC parser.  If not, see <http://www.gnu.org/licenses/>.
**/
/// Requirements ---------------------------------------------------------------

var fs =                require( "fs" );
var path =              require( "path" );

/// Exports --------------------------------------------------------------------

module.exports = {
    normalize:          normalize,
    basename:           path.basename,
    getExtension:       getExtension,
    getComponentName:   getComponentName,
    readFileString:     readFileString,
    readJson:           readJson,
    isFile:             isFile,
    isDirectory:        isDirectory,
    findAllFiles:       findAllFiles,
    getFullPath:        getFullPath,
};

/// Functions ------------------------------------------------------------------

function normalize( name ){

    return path.resolve( name );
}///

function getExtension( fileName ){

    return path.extname( fileName ).substr( 1 );
}///

function getComponentName( fileName ){

    return fileName.slice( 0, 0 - path.extname( fileName ).length );
}///

function readFileString( fileName ){

    return fs.readFileSync( fileName, "utf8" );
}///

function readJson( fileName ){

    return JSON.parse( readFileString( fileName ));
}///

function isFile( path ){

    return fs.statSync( path ).isFile();
}///

function isDirectory( path ){

    return fs.statSync( path ).isDirectory();
}///

function findAllFiles( dirName ){

    dirName =           path.resolve( dirName );
    var entries =       fs.readdirSync( dirName ).sort().map( getFullPath( dirName ));

    return Array.prototype.concat.apply(
            entries.filter( isFile ),
            entries.filter( isDirectory ).map( findAllFiles ));
}///

function getFullPath( dirName ){
    return function( name ){

        return dirName + path.sep + name;
    };//
}///
