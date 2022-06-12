
import { basename } from 'Path'
import { parse } from 'Args'


const { args  , chown , run } = Deno;
const { home } = parse(args);
const user = basename(home)


const command_install = {
    cmd : [ 'apt' , 'install' , 'libserial1' ],
    stdout : 'null' ,
    stderr : 'null'
}

const command_packages = {
    cmd : [ 'dpkg-query' , '--show' , '--showformat=${Package}|${Version}' , 'libserial1' ],
    stdout : 'piped' ,
    stderr : 'null'
}

const command_groups = {
    cmd : [ 'groups' , user ] ,
    stdout : 'piped' ,
    stderr : 'null'
}

const command_join = {
    cmd : [ 'usermod' , '--append' ,'--groups' , 'dialout' , user ] ,
    stdout : 'null' ,
    stderr : 'null'
}


export async function install(){

    const process = run(command_install);
    const status = await process.status();
}


export async function isInstalled(){

    const process = run(command_packages);
    const status = await process.status();

    const out = await process.output();

    let packages = new TextDecoder().decode(out);

    if(packages.startsWith('dpkg-query: no packages found matching'))
        return false;

    packages = packages
        .split('\n')
        .filter(a => a)
        .map((info) => info.split('|'));

    packages = new Map(packages);

    return packages.has('libserial1');
}


export async function hasPermissions(){

    const process = run(command_groups);
    const status = await process.status();

    const out = await process.output();

    let info = new TextDecoder().decode(out);

    if(!info.startsWith(user))
        return false;

    const groups = info
        .split(':')[1]
        .split(' ');

    return groups.includes('dialout');
}


export async function givePermissions(){
    const process = run(command_join);
    const status = await process.status();
}
