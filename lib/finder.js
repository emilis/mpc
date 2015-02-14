/** Copyright ------------------------------------------------------------------

    Copyright 2015 Emilis Dambauskas <emilis.d@gmail.com>.

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

var fsUtils =           require( "./fs-utils" );

/// Exports --------------------------------------------------------------------

module.exports = {

    resolveRequirement: resolveRequirement,
    findComponent:      findComponent,
};

/// Functions ------------------------------------------------------------------

/**
 *  Returns a resolved component name for a requirement url.
 *
 *  cName:      component name
 *  url:        url of requirement in the component
 *  options:    MPC options object
 */
function resolveRequirement( cName, url, options ){

    var files;

    if( url[0] === "/" ){

        return url;

    } else if( url[0] === "." ){
        
        return path.resolve( path.dirname( cName ), url );

    } else if( url.match( /^[-_a-z0-9]+:/i )){

        files = findWithFinder( url, options );

    } else {

        files = findInPath( url, options );
    }

    if( !files || !files.length ){

        return url;
    } else {
        
        return (
            path.dirname( files[0] )
            + path.sep
            + path.basename( files[0], path.extname( files[0] ))
        );
    }
}///


/**
 *  Finds files for a given component url.
 *
 *  url:        String. In the simplest case it is a file name for a component.
 *  options:    MPC options object.
 */
function findComponent( url, options ){

    if( url[0] === "." || url[0] === "/" ){
        
        return findRelative( url );

    } else if( url.match( /^[-_a-z0-9]+:/i )){

        return findWithFinder( url, options );

    } else {

        return findInPath( url, options );
    }
}///


/// Private functions ----------------------------------------------------------

function findRelative( url ){

    var dirName =       path.dirname( url );
    var baseName =      path.basename( url );
    var entries;

    if ( !fs.existsSync( dirName )){
        entries =       [];
    } else {
        entries =       fs.readdirSync( dirName ).filter( matches );
    }

    return entries.map( fsUtils.getFullPath( dirName ));

    /// Return true if entry === baseName.extension
    function matches( entry ){

        var len =       baseName.length;
        return entry[len] === "." && !entry.indexOf( baseName ) && entry.slice( len + 1 ).indexOf( "." ) === -1;
    }///
}///


function findInPath( url, options ){

    var includePath =   options && options.includePath || [ process.cwd() ];
    var entries;

    for( var i=0; i < includePath.length; i++ ){
        entries =       findRelative( path.resolve( includePath[i], url ));
        if( entries.length ){
            return entries;
        }
    }

    return [];
}///


function findWithFinder( url, options ){

    throw Error( "Cannot find component '" + url + "'. Using external finders is not implemented yet." );
}///
