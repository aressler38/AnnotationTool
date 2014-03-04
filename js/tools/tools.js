/* Copyright 2007-2013 CK-12 Foundation
 *
 * All rights reserved
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under this License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied.  See the License for the specific language governing
 * permissions and limitations.
 *
 */

// originally by Alexander Ressler
// description: This module contains all the tools needed for the annotation tool. 
//              You access via Tools.<desired tool>.
//              It's cleaner to load one module with all the tools than one module per tool.

define(
    [   
        "Pencil"
    ],
    function(Pencil) {
        return ({
            Pencil:Pencil
        });    
    }
);
    
