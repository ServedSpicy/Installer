
import { Arrow_Up , Arrow_Down , Enter , Escape } from '../Keys.js'
import { center , lines , width , fill } from '../Format.js'
import { blue , red , bold , dark } from 'Color'

import { userInput } from '../Input.js'


const { log , clear } = console;


let content = [];
let actions = '';


function draw(){

    clear();

    content = [
        '' ,
        `  Ｕｐｄａｔｉｎｇ　${ bold(red('ＳｅｒｖｅｄＳｐｉｃｙ')) }`,
        ''
    ];

    log(fill(content.join('\n'),dark));

}


export default async function update(){

    draw();

    while(true)
        await userInput();
}
