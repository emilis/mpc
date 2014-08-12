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

var fsUtils =       require( "./fs-utils" );
var mpc =           require( "./mpc" );
var yargs =         require( "yargs" );

/// Exports --------------------------------------------------------------------

module.exports = {
    main:           main,
};

/// Functions ------------------------------------------------------------------

function main(){

    var argv =      yargs
                    .boolean( "a" )
                    .boolean( "r" )
                    .boolean( "c" )
                    .boolean( "h" )
                    .boolean( "v" )
                    .argv;

    var options =   {
        all:        argv.a || argv.all || false,
        recursive:  argv.r || argv.recursive || false,
    };

    if ( argv.v || argv.version ){
        return printAndExitOk( getVersion() );
    }

    if ( argv.h || argv.help ){
        return printAndExitOk( getHelp() );
    }
        
    if ( !argv._ || !argv._.length ){
        return printAndExitError( getHelp() );
    }

    if ( argv.p || argv.parts ){
        options.parts = ( argv.p || argv.parts ).split( "," );
    }

    var cat =       argv.c || argv.cat;
    var fmt =       argv.f || argv.format;

    if ( cat && !options.parts ){
        return printAndExitError( "Please specify which parts should be concatenated with the -p option." );
    }

    if ( cat && fmt ){
        return printAndExitError( "Please choose either concatenating parts (-c) or outputing components (-f)." );
    }

    var components =    mpc.apply( this, [ options ].concat( argv._ ));

    if ( cat ){
        return catParts( components, options.parts );
    }

    switch( fmt ){
        
        case "json":
            console.log( JSON.stringify( components ));
            break;

        case "csv":
        default:
            return printCsv( components );
    }
}///


function printAndExitOk( text ){

    console.log( text );
    process.exit();
}///

function printAndExitError( text, status ){
    status =            status || 1;

    console.error( text );
    process.exit( status );
}///

function getHelp(){

    var str = [
        "Usage: mpc [OPTIONS] DIR/FILE [DIR/FILE...]",
        "Options:",
        "    -a / --all             Include all files (not only *.mpc).",
        "    -r / --recursive       Include all required components recursively.",
        "    -p / --parts p1,p2,..  Output only specified parts / components having the parts.",
        "    -f / --format fmt      Output component information in specified format. One of: csv/json.",
        "    -c / --cat             Output concatenated part contents (requires -p).",
        "    -h / --help            Print this help message.",
        "    -v / --version         Print version information.",
        ];

    return str.join( "\n" );
}///


function getVersion(){

    var package =   fsUtils.readJson( __dirname + "/package.json" );

    var str = [
        package.description + " " + package.version,
        "Copyright (C) 2014 Emilis Dambauskas.",
        "",
        "This program is free software; you can redistribute it and/or modify",
        "it under the terms of the GNU General Public License as published by",
        "the Free Software Foundation; either version 3 of the License, or",
        "(at your option) any later version.",
        "",
        "This program is distributed in the hope that it will be useful,",
        "but WITHOUT ANY WARRANTY; without even the implied warranty of",
        "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the",
        "GNU General Public License for more details.",
        "",
        "You should have received a copy of the GNU General Public License",
        "along with this program. If not, see http://www.gnu.org/licenses/.",
        ];

    return str.join( "\n" );
}///


function printCsv( clist ){

    clist.forEach( printComponent );

    function printComponent( c ){

        c.parts.forEach( printPart );

        function printPart( p ){
            console.log([ c.name, p.partName, p.fileName, p.offset, p.length ].join( "," ));
        }///
    }///
}///


function catParts( clist, parts ){

    var partFilter =    getPartFilter( parts );

    clist.forEach( printComponent );

    function printComponent( c ){
        c.parts.filter( partFilter ).forEach( printContent );
    }///

    function printContent( p ){
        console.log( p.content );
    }///
}///


function getPartFilter( parts ){

    if ( parts && parts.length ){
        return function( part ){
            return parts.indexOf( part.partName ) !== -1;
        };//
    } else {
        return function(){ return true; };
    }
}///

