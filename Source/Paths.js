

import { join } from 'https://deno.land/std/path/mod.ts';


const { env } = Deno;


import { parse } from 'Args';
const Parameter = parse(Deno.args);
const home = Parameter.home;


export const desktop_entry =
    join(home,'.local','share','applications','ServedSpicy.desktop');

export const config =
    join(home,'.cache','ServedSpicy');

export const folder =
    join(home,'.ServedSpicy');

export const app_folder =
    join(folder,'App');

export const app_icon =
    join(folder,'App','Icons','App.png');

export const app_launcher =
    join(folder,'App','Client.sh');
