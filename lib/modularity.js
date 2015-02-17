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

var path =                  require( "path" );

var Components =            require( "./components" );
var Finder =                require( "./finder" );

/// Exports --------------------------------------------------------------------

module.exports = {
    getExports:             getExports,
    getRequirements:        getRequirements,
    sortComponents:         sortComponents,
};

/// Functions ------------------------------------------------------------------

function getExports( component ){

    if ( !component.exports ){
        component.exports =         parsePart( Components.getPartContent( component, "exports" ));
    }
    return component.exports;
}///


function getRequirements( component, options ){

    if ( !component.requirements ){
        var names =                 parsePart( Components.getPartContent( component, "requirements" ));
        component.requirements =    {};
        for ( var k in names ){
            component.requirements[k] = Finder.resolveRequirement( component.name, names[k], options );
        }
    }
    return component.requirements;
}///

function withOptionsGetRequirements( options ){
    return function( component ){

        return getRequirements( component, options );
    };//
}///


function sortComponents( cList, options ){

    cList.forEach( withOptionsGetRequirements( options ));

    return topoSort( cList.reduce( makeComponentMap, {} ));

    function topoSort( cMap ){

        var visited =       {};
        var sorted =        [];

        /// Sort by component name, then go through dependencies:
        Object.getOwnPropertyNames( cMap ).sort( byDepth ).forEach( visit );

        return sorted;

        function visit( name ){

            if ( visited[name] ){
                return;
            } else {
                visited[name] = true;
            }

            if ( cMap[name] ){
                if ( cMap[name].requirements ){
                    getProperties( cMap[name].requirements ).forEach( visit );
                }
                sorted.push( cMap[name] );
            }
        }///
    }///

    function byDepth( a, b ){

        return a.split( path.sep ).length - b.split( path.sep ).length;
    }///
}///

/// Parsing --------------------------------------------------------------------

function parsePart( str ){

    if ( str ){
        return getFullLines( str ).reduce( getDict, {} );
    } else {
        return {};
    }

    function getDict( r, line ){

        if ( line.indexOf( ":" ) === -1 ){
            r[line] =           line;
        } else {
            line =              line.split( ":" );
            r[line.shift().trim()] =   line.join( ":" ).trim();
        }

        return r;
    }///
}///


function getFullLines( str ){

    return str.split( "\n" ).map( trim ).filter( fnId );
}///

function fnId( x ){
    return x;
}///

function trim( str ){

    return str && str.trim && str.trim() || "";
}///

function getProperties( obj ){

    var props = [];
    for ( var k in obj ){
        props.push( obj[k] );
    }
    return props;
}///


function makeComponentMap( map, component ){

    map[component.name] =   component;
    return map;
}///

