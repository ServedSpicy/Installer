
import { Ctrl_C } from './Keys.js'
import { exit } from './Deno.js'


export async function userInput(validKeys = []){

    const buffer = new Uint8Array(16);

    while(true){

        const count = await Deno.stdin.read(buffer);

        if(count === null)
            exit();

        const [ key ] = buffer;

        if(key === Ctrl_C)
            exit();

        if(key === 110 || key === 121)
            if(!validKeys.includes([ key ]))
                Deno.exit();

        const sequence = buffer.slice(0,count);

        for(const key of validKeys)
            if(isKey(sequence,key))
                return key;
    }
}

function isKey(buffer,key){

    const { length } = buffer;

    if(length !== key.length)
        return false;

    for(let i = 0;i < length;i++)
        if(buffer.at(i) !== key[i])
            return false;

    return true;
}
