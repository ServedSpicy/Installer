
import { app_icon , app_launcher , app_folder } from '../Paths.js'


const toPair = ([ key , value ]) =>
    `${ key }=${ value }`;


const variables = {
    Version : '1.4' ,
    Name : 'ServedSpicy' ,
    Comment : 'The recipe manager for ServedSpicy machines.' ,
    // Exec : `nohup ${ app_launcher } 2424 2425 > Log.txt 2>&1 &` ,
    Exec : 'ServedSpicy' ,
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


const entry = lines.join('\n');


const { writeTextFile , args , chown } = Deno;
import { desktop_entry } from '../Paths.js'
import { parse } from 'Args';
const Parameter = parse(args);

export async function add(){
    await writeTextFile(desktop_entry,entry);
    await chown(desktop_entry,Parameter.user,Parameter.group);
    await Deno.chmod(desktop_entry,0o755);
}

export async function remove(){
    await Deno.remove(desktop_entry);
}
