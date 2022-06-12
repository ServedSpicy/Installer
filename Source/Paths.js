

import { parse } from 'Args';
import { join } from 'Path';


const { env , args } = Deno;

const { home } = parse(args);



export const desktop_entry =
    join(home,'.local','share','applications','ServedSpicy.desktop');

export const config =
    join(home,'.config','ServedSpicy');


export const folder =
    join(home,'.ServedSpicy');

export const app_folder =
    join(folder,'App');

export const app_icon =
    join(app_folder,'Icons','App.png');

export const app_launcher =
    join(app_folder,'Client.sh');
