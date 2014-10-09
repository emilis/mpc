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

var Components =            require( "./components" );

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


function getRequirements( component ){

    if ( !component.requirements ){
        var names =                 parsePart( Components.getPartContent( component, "requirements" ));
        component.requirements =    {};
        for ( var k in names ){
            component.requirements[k] = Components.relativeToAbsolute( component.name, names[k] );
        }
    }
    return component.requirements;
}///


function sortComponents( cList ){

    cList.forEach( getRequirements );

    return topoSortCmap( cList.reduce( makeComponentMap, {} ));

    function makeComponentMap( map, c ){

        map[c.name] =   c;
        return map;
    }///

    function topoSortCmap( cMap ){

        var visited =       {};
        var sorted =        [];

        for ( var name in cMap ){
            visited[name] || visit( name );
        }

        return sorted;

        function visit( name ){

            if ( visited[name] ){
                return;
            } else {
                visited[name] = true;
            }

            for ( var k in cMap[name].requirements ){
                var reqName =   cMap[name].requirements[k];
                visited[reqName] || visit( reqName );
            }

            sorted.push( cMap[name] );
        }///
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
