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

var fsUtils =           require( "./fs-utils" );

/// Constants ------------------------------------------------------------------

/// Chars:
var LF =                "\n";
var CR =                "\r";
var SPACE =             " ";
var TAB =               "\t";
var MINUS =             "-";
var NUMBERS =           "0123456789";
var LETTERS =           "abcdefghijklmnopqrstuvwxyz";
var PARTNAME =          "-_" + NUMBERS + LETTERS + LETTERS.toUpperCase();
var PARTNAMEMAP =       makeCharMap( PARTNAME );

var i =                 1;
/// Parser modes:
var MCONTENT =          i++;
var MNEWLINE =          i++;
/// Header sections:
var MHEAD = {
    OPEN:               i++,
    TEXT:               i++,
    CLOSE:              i++,
    CLOSEEXT:           i++,
    NEWLINE:            i++,
};

/// Exports --------------------------------------------------------------------

module.exports = {
    parseFile:          parseFile,
    parseString:        parseString,
};

/// Functions ------------------------------------------------------------------

function parseFile( fileName ){

    var extension =     fsUtils.getExtension( fileName );
    var content =       fsUtils.readFileString( fileName );

    if ( extension && extension === "mpc" ){

        return parseString( content ).map( addFileName );

    } else {
        return [{
            fileName:   fileName,
            partName:   extension,
            offset:     0,
            length:     content.length,
            content:    content,
        }];
    }

    function addFileName( part ){

        part.fileName = fileName;
        return part;
    }///
}///


function parseString( str ){

    var parts =         [];

    var c;
    var p =             0;
    var linen =         1;
    var linec =         1;
    var strLen =        str.length;

    var firstHeader =   true;
    var mode =          MHEAD.START;

    var contentPos =    -1;
    var headerName;

    var markPos =       0;
    var markNameBegin = -1;
    var markNameEnd =   -1;

    for ( p=0; p<strLen; p++ ){

        c =             str[p];

        if ( c === CR ){
            continue;
        }

        switch ( mode ){

            case MCONTENT:

                if ( isNewline( c )){
                    mode =          MNEWLINE;
                    markPos =       p;
                }
                break;

            case MNEWLINE:

                if ( isNewline( c )){
                    mode =          MHEAD.OPEN;
                } else if ( !isSpace( c )){
                    mode =          MCONTENT;
                }
                break;

            case MHEAD.START:

                str[p] === MINUS || error( 'Expected "-" but found "', str[p], '"' );
                p++;
                linec++;
                str[p] === MINUS || error( 'Expected "-" but found "', str[p], '"' );
                p++;
                linec++;
                str[p] === MINUS || error( 'Expected "-" but found "', str[p], '"' );
                p++;
                linec++;
                str[p] === SPACE || error( 'Expected "-" but found "', str[p], '"' );

                mode =              MHEAD.TEXT;
                markNameBegin =     p + 1;

                break;

            case MHEAD.OPEN:

                if ( str.substr( p, 4 ) === "--- " ){
                    p +=            3;
                    linec +=        3;
                    mode =          MHEAD.TEXT;
                    markNameBegin = p + 1;
                } else {
                    mode =          MCONTENT;
                }
                break;

            case MHEAD.TEXT:

                if ( c === SPACE ){
                    mode =          MHEAD.CLOSE;
                    markNameEnd =   p;
                } else if ( !PARTNAMEMAP[c] ){
                    hwarning( "Illegal character in part header title" );
                }
                break;

            case MHEAD.CLOSE:

                mode =              MHEAD.CLOSEEXT;
                str[p] === MINUS || hwarning( 'Expected "-" but found "', str[p], '"' );
                p++;
                linec++;
                str[p] === MINUS || hwarning( 'Expected "-" but found "', str[p], '"' );
                p++;
                linec++;
                str[p] === MINUS || hwarning( 'Expected "-" but found "', str[p], '"' );

                break;

            case MHEAD.CLOSEEXT:

                if ( c === LF ){
                    mode =          MHEAD.NEWLINE;
                } else if ( c !== MINUS && c !== SPACE ){
                    hwarning( "Illegal character in part header" );
                }
                break;

            case MHEAD.NEWLINE:

                if ( c === LF ){
                    mode =          MCONTENT;
                    if ( firstHeader ){
                        firstHeader =   false;
                        contentPos =    p + 1;
                        headerName =    str.slice( markNameBegin, markNameEnd );
                    } else {
                        savePreviousPart( markPos, p + 1 );
                    }
                } else if ( !isSpace( c )){
                    hwarning( "Missing empty line below part header" );
                }
                break;

            default:
                error( "Internal parser error: unknown mode" );

        }// end mode switch

        /// Update line,char counters:
        if ( c === LF ){
            linen +=    1;
            linec =     1;
        } else {
            linec +=    1;
        }

    }// end for

    savePreviousPart( strLen );

    return parts;

    /// String parser functions ------------------------------------------------

    function formatMsg(){

        return Array.prototype.slice.call( arguments ) .concat([ " (at ", linen, ":", linec, ")." ]) .join( "" );
    }///

    function error(){
        
        throw Error( formatMsg.apply( this, arguments ));
    }///

    function warning(){
        
        console.error( formatMsg.apply( this, arguments ));
    }///

    function hwarning(){
        
        if ( firstHeader ){
            error.apply( this, arguments );
        } else {
            warning.apply( this, arguments );
            mode =      MCONTENT;
        }
    }///

    function savePreviousPart( contentEnd, curPos ){

        parts.push({
            partName:   headerName,
            offset:     contentPos,
            length:     contentEnd - contentPos,
            content:    str.slice( contentPos, contentEnd ),
        });

        headerName =    str.slice( markNameBegin, markNameEnd );
        contentPos =    curPos;
    }///
}///

/// Private functions ----------------------------------------------------------

function isNewline( c ){
    
    return c === LF;
}///

function isSpace( c ){

    return ( c === SPACE ) || ( c === TAB );
}///

function isHeaderTitle( c ){
    
    return /[-_0-9a-z]/i.exec( c );
}///

function makeCharMap( str ){

    return str.split( "" ).reduce(function( map, c ){ map[c]=true; return map; }, {} );
}///
