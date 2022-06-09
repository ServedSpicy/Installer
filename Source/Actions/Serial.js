


export async function install(){

    const process = Deno.run({
        cmd : [ 'apt' , 'install' , 'libserial1' ],
        stdout : 'null' ,
        stderr : 'null'
    });

    const status = await process.status();
}
