

import { emptyDir } from 'File'
import { folder } from '../Paths.js'


const { makeTempDir } = Deno;


export async function create(){
    await emptyDir(folder);
}

export async function makeTemporary(){
    return await makeTempDir({ prefix : 'ServedSpicy_' });
}
