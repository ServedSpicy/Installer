
import { Arrow_Up , Arrow_Down , Enter , Escape } from '../Keys.js'
import { center , lines , width , fill } from '../Format.js'
import { blue , red , bold , dark } from 'Color'
import { exit , sleep  } from '../Deno.js'
import { userInput } from '../Input.js'
import { limit } from '../Math.js'

import uninstall from './Uninstall.js'
import install from './Install.js'
import update from './Update.js'


const { stdout , consoleSize } = Deno;
const { log , clear } = console;

let { columns , rows } = consoleSize(stdout.rid);

rows -= 3;


let option = 1;
let content = [];
let actions = '';



function select(title,isSelected = false){
    return isSelected
        ? `> ${ title } <`
        : title;
}




function draw(){

    clear();


    const
        topPadding = parseInt((rows - 7) * .5),
        bottomPadding = rows - topPadding - 7;


    log(fill([
        ... lines(topPadding) ,
        center(select('Ｉｎｓｔａｌｌ',option === 1)) ,
        '' ,
        '' ,
        center(select('Ｕｐｄａｔｅ',option === 2)) ,
        '' ,
        '' ,
        center(select('Ｕｎｉｎｓｔａｌｌ',option === 3)) ,
        ... lines(bottomPadding)
    ].join('\n'),blue));

}


async function menu(){

    draw();

    while(true){

        draw();

        const key = await userInput([ Arrow_Up , Arrow_Down , Enter , Escape ]);


        switch(key){
        case Arrow_Up:
            option--;
            break;
        case Arrow_Down:
            option++;
            break;
        case Enter:
            return;
        case Escape:
            exit();
        }

        option = limit(option,1,3);
    }
}


export default async function(){

    await menu();

    switch(option){
    case 1:
        await install();
        break;
    case 2:
        await update();
        break;
    case 3:
        await uninstall();
        break;
    }

    exit();
}
