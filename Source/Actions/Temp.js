

export async function * remove(){

    let count = 0;
    let files = [];

    for await (const entry of walk('/tmp/',{
        followSymlinks : false ,
        includeDirs : true ,
        includeFiles : true ,
        match : [ /^\/tmp\/ServedSpicy_/ ] ,
        maxDepth : 1
    })){
        console.log(entry.path);
        files.push(entry.path);
        count++;

        await Deno.remove(entry.path,{ recursive : true });

        yield [ count , files ];
    }
}
