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

var reHeader =          /^--- (\S.*) ---+$/;
var reEmptyLine =       /^\s*$/;

/// Exports --------------------------------------------------------------------

module.exports = {
    parseFile:          parseFile,
    parse:              getParts,
    getParts:           getParts,
};

/// Functions ------------------------------------------------------------------

function parseFile( fileName ){

    var extension =     fsUtils.getExtension( fileName );
    var content =       fsUtils.readFileString( fileName );

    if ( extension && extension === "mpc" ){

        return getParts( content ).map( addFileName );

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

function getParts( str ){

    var parts =         [];
    var lines =         [];
    var curPart =       [];
    var curPartName;
    var curOffset =     0;

    if ( str ){
        lines =         str.split( "\n" );
        
        for ( var i=0,len=lines.length; i<len; i++ ){

            if ( isPartHeader( lines, i )){
                if ( curPart.length ){

                    parts.push({
                        partName:   curPartName,
                        offset:     linesLength( lines, curOffset ),
                        length:     linesLength( curPart ),
                        content:    curPart.join( "\n" ),
                    });
                }
                i && i++;       /// Skip empty line before header.
                curPartName =   getPartName( lines[i] );
                curPart =       [];
                i++;            /// Skip empty line after header.
                curOffset =     i;

            } else {

                curPart.push( lines[i] );
            }
        }

        content =       curPart.join( "\n" );
        parts.push({
            partName:   curPartName,
            offset:     linesLength( lines, curOffset ),
            length:     linesLength( curPart ),
            content:    curPart.join( "\n" ),
        });
    }

    return parts;
}///

/// Private functions ----------------------------------------------------------

function isPartHeader( lines, i ){

    if ( i ){
        return isEmptyLine( lines[i] ) && isEmptyLine( lines[i+2] ) && isHeaderLine( lines[i+1] );
    } else {
        return isEmptyLine( lines[1] ) && isHeaderLine( lines[0] );
    }
}///

function isEmptyLine( line ){

    return !line || line.match( reEmptyLine );
}///


function isHeaderLine( line ){

    return line && line.match( reHeader );
}///

function getPartName( line ){

    return line.match( reHeader )[1];
}///

function joinLines( lines ){

    return lines.join( "\n" );
}///

function linesLength( lines, sliceTo ){

    if ( sliceTo ){
        return sliceTo + lines.slice( 0, sliceTo ).reduce( sumLength, 0 );
    } else {
        return lines.length - 1 + lines.reduce( sumLength, 0 );
    }
}///

function sumLength( sum, line ){

    return sum + line.length;
}///
