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

    findComponent:      findComponent,
};

/// Functions ------------------------------------------------------------------

function findComponent( pattern, options ){

    var dirName =       path.dirname( pattern );
    var baseName =      path.basename( pattern );
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
