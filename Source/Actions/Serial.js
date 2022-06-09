

const { run } = Deno;


const command_install = {
    cmd : [ 'apt' , 'install' , 'libserial1' ],
    stdout : 'null' ,
    stderr : 'null'
}

const command_check = {
    cmd : [ 'dpkg-query' , '--show' , '--showformat=${Package}|${Version}' , 'libserial1' ],
    stdout : 'piped'
}


export async function install(){

    const process = run(command_install);
    const status = await process.status();
}


export async function isInstalled(){

    const process = run(command_check);
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
