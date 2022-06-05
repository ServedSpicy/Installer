
import { app_icon , app_launcher , app_folder } from './Paths.js'
import { version } from './Version.js'



const variables = {
    Version : '1.4' ,
    Name : 'ServedSpicy' ,
    Comment : 'The recipe manager for ServedSpicy machines.' ,
    Exec : `nohup ${ app_launcher } 2424 2425 > Log.txt 2>&1 &` ,
    Icon : app_icon ,
    Path : app_folder ,
    Terminal : 'false' ,
    Type : 'Application' ,
    MimeType : 'text/yaml' ,
    Categories : 'Utility;Electronics' ,
    'X-SingleMainWindow' : 'true' ,
    Keywords : 'Configurator;Recipe;Spice' ,
    GenericName : 'Configurator'
};

const lines = Object
    .entries(variables)
    .map(toPair);

lines.unshift('[Desktop Entry]');


export const entry = lines.join('\n');



function toPair([ key , value ]){
    return `${ key }=${ value }`;
}
