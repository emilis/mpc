/** Copyright ------------------------------------------------------------------

    Copyright 2014,2015 Emilis Dambauskas <emilis.d@gmail.com>.

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

var components =        require( "./lib/components" );
var finder =            require( "./lib/finder" );
var fsUtils =           require( "./lib/fs-utils" );
var modularity =        require( "./lib/modularity" );
var parser =            require( "./lib/parser" );

/// Exports --------------------------------------------------------------------

mpc.parseAll =          parseAll;
mpc.parseFile =         parseFile;
mpc.parseComponent =    parseComponent;
mpc.parseDir =          parseDir;
mpc.getParts =          components.getParts;
mpc.getPartContent =    components.getPartContent;
mpc.findPartContent =   components.findPartContent;
mpc.hasPart =           components.hasPart;
mpc.hasParts =          components.hasParts;
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
    options =           options || {};

    var clist =         components.fromParts( parser.parseFile( fileName ));

    return applyListOptions( clist, options );
}///

function parseComponent( url, options ){
    options =           options || {};

    var component =     readComponent( url, options );

    if ( component ){
        return applyListOptions([ component ], options );
    } else {
        return [];
    }
}///


function parseDir( dirName, options ){
    dirName =           fsUtils.normalize( dirName );
    options =           options || {};

    var fileNames =     fsUtils.findAllFiles( dirName ).filter( getFileNameFilter( options ));
    var listsOfParts =  fileNames.map( parser.parseFile );
    var parts =         flattenArray( listsOfParts );
    var clist =         components.fromParts( parts );

    return applyListOptions( clist, options );
}///


/// Private functions ----------------------------------------------------------

function applyListOptions( clist, options ){

    var cmap =          {};

    if ( options.recursive || options.fillRequirements ){
        cmap =          clist.reduce( fillRequirements, {} );
    }
    if ( options.recursive ){
        clist =         getValues( cmap );
    }

    if ( options.sort ){
        clist =         modularity.sortComponents( clist );
    }

    if ( options && options.parts ){
        return clist.filter( byParts( options.parts ));
    } else {
        return clist;
    }


    function fillRequirements( cmap, component ){

        if ( !component || !component.name ){
            return cmap;
        }

        if ( !cmap[component.name] ){
            cmap[component.name] =  component;
        }

        if ( !component.requiredComponents ){
            component.requiredComponents =  {};
            var reqs =                      modularity.getRequirements( component );
            for ( var k in reqs ){
                var reqUrl =                reqs[k];
                if ( !cmap[reqUrl] ){
                    fillRequirements( cmap, readComponent( reqUrl, options ));
                }
                component.requiredComponents[k] =   cmap[reqUrl];
            }
        }

        return cmap;
    }///
}///


function flattenArray( arr ){

    return Array.prototype.concat.apply( [], arr );
}///

function getValues( obj ){

    return Object.getOwnPropertyNames( obj ).map( getValue );

    function getValue( k ){
        return obj[k];
    }///
}///

function readComponent( cName, options ){

    return components.fromParts( flattenArray( finder.findComponent( cName, options ).map( parser.parseFile )))[0];
}///

function byParts( parts ){
    return function( component ){

        return components.hasParts( component, parts );
    };//
}///


function getFileNameFilter( options ){
    if ( options.all ){
        return isNotHidden;
    } else {
        return isMpcFileName;
    }
}///

function isMpcFileName( fileName ){

    return isNotHidden( fileName ) && fsUtils.getExtension( fileName ) === "mpc";
}///

function isNotHidden( fileName ){
    
    return fsUtils.basename( fileName )[0] !== ".";
}///

