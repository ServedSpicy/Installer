
import { app_icon , app_launcher } from './Paths.js'
import { version } from './Version.js'



const variables = {
    Version : version ,
    Name : 'ServedSpicy' ,
    Comment : 'The recipe manager for ServedSpicy machines.' ,
    Exec : app_launcher ,
    Icon : app_icon ,
    Terminal : false ,
    Type : 'Application' ,
    Categories : 'Utility;Electronics;HardwareSettings'
};


const lines = Object
    .entries(variables)
    .map(toPair);
    
lines.unshift('[Desktop Entry]');


export const entry = lines.join('\n');



function toPair([ key , value ]){
    return `${ key }=${ value }`;
}