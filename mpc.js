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

var components =        require( "./components" );
var fsUtils =           require( "./fs-utils" );
var modularity =        require( "./modularity" );
var parser =            require( "./parser" );

/// Exports --------------------------------------------------------------------

mpc.parseAll =          parseAll;
mpc.parseFile =         parseFile;
mpc.parseDir =          parseDir;
mpc.getParts =          components.getParts;
mpc.getPartContent =    components.getPartContent;
mpc.getExports =        modularity.getExports;
mpc.getRequirements =   modularity.getRequirements;

module.exports =        mpc;

/// Functions ------------------------------------------------------------------

function mpc( options ){

    return parseAll(
            Array.prototype.slice.call( arguments, 1 ),
            options );
}///


function parseAll( list, options ){

    return flattenArray( list.map( parsePath ));

    function parsePath( path ){

        if ( fsUtils.isDirectory( path )){
            return parseDir( path, options );
        } else {
            return parseFile( path, options );
        }
    }///
}///


function parseFile( fileName, options ){
    fileName =          fsUtils.normalize( fileName );

    var component =     components.fromParts( parser.parseFile( fileName ))[0];
    var clist =         [];

    if ( options && options.recursive ){
        clist =         modularity.sortComponents( getValues( fillRequirements( {}, component )));
    } else {
        clist =         [ component ];
    }

    if ( options && options.parts ){
        return clist.filter( byParts( options.parts ));
    } else {
        return clist;
    }
}///


function parseDir( dirName, options ){
    dirName =           fsUtils.normalize( dirName );

    var listsOfParts =  fsUtils.findAllFiles( dirName ).map( parser.parseFile );
    var parts =         flattenArray( listsOfParts );
    var clist =         modularity.sortComponents( components.fromParts( parts ));

    if ( options && options.parts ){
        return clist.filter( byParts( options.parts ));
    } else {
        return clist;
    }
}///


/// Private functions ----------------------------------------------------------

function flattenArray( arr ){

    return Array.prototype.concat.apply( [], arr );
}///

function getValues( obj ){

    return Object.getOwnPropertyNames( obj ).map( getValue );

    function getValue( k ){
        return obj[k];
    }///
}///

function fillRequirements( cmap, component ){

    if ( !cmap[component.name] ){
        cmap[component.name] =  component;
    }

    if ( !component.requiredComponents ){
        component.requiredComponents =  {};
        var reqs =                      modularity.getRequirements( component );
        for ( var k in reqs ){
            var reqName =               components.relativeToAbsolute( component.name, reqs[k] );
            if ( !cmap[reqName] ){
                fillRequirements( cmap, readComponent( reqName ));
            }
            component.requiredComponents[k] =   cmap[reqName];
        }
    }

    return cmap;
}///

function readComponent( cName ){

    return components.fromParts( flattenArray( fsUtils.findByPattern( cName ).map( parser.parseFile )))[0];
}///

function byParts( parts ){
    return function( component ){

        return components.hasParts( component, parts );
    };//
}///
