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

var path =              require( "path" );

/// Exports --------------------------------------------------------------------

module.exports = {
    makeName:           makeName,
    relativeToAbsolute: relativeToAbsolute,
    hasParts:           hasParts,
    hasPart:            hasPart,
    getParts:           getParts,
    getPartContent:     getPartContent,
    fromParts:          fromParts,
};

/// Functions ------------------------------------------------------------------

function makeName( fileName ){

    return fileName.slice( 0, 0 - path.extname( fileName ).length );
}///

function relativeToAbsolute( baseName, relName ){

    if( relName[0] === "." ){
        return path.resolve( path.dirname( baseName ), relName );
    } else {
        return relName;
    }
}///


function fromParts( parts ){

    return objValues( parts.reduce( buildMap, {} ));
}///


function getParts( component, partName ){

    if ( Array.isArray( partName )){

        return component.parts.filter( isMatching );
    } else {
        return component.parts.filter( isSame );
    }

    function isMatching( part ){

        return partName.indexOf( part.partName ) !== -1;
    }///

    function isSame( part ){

        return partName === part.partName;
    }///
}///


function hasParts( component, partNames ){

    return component.parts.some( partMatches );

    function partMatches( p ){
        
        return partNames.indexOf( p.partName ) !== -1;
    }///
}///

function hasPart( component, partName ){

    return hasParts( component, [ partName ]);
}///

function getPartContent( component, partName ){

    var parts =         getParts( component, partName );
    return getParts( component, partName ).map( getContent ).join( "\n" );

    function getContent( part ){
        return part && part.content || "";
    }///
}///

/// Private functions ----------------------------------------------------------

function buildMap( map, part ){

    var name =          makeName( part.fileName );

    if ( map[name] ){
        map[name].parts.push( part );
    } else {
        map[name] = {
            name:       name,
            parts:      [ part ],
        };
    }

    return map;
}///


function objValues( obj ){

    return Object.getOwnPropertyNames( obj ).map( getValue );

    function getValue( k ){
        return obj[k];
    }///
}///
