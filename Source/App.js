
import { Ctrl_C , Arrow_Up , Arrow_Down , Arrow_Left , Arrow_Right , Enter , Escape } from './Keys.js'
import { blue , red , bold , dark } from 'Color';
import { desktop_entry , folder } from './Paths.js'
import { join } from 'Path';

import { limit } from './Math.js'
import { center , lines , width , fill } from './Format.js'
import { emptyDir , walk } from 'File';
import uninstall from './Menu/Uninstall.js'
import install from './Menu/Install.js'
import { userInput } from './Input.js'


import * as Folder from './Actions/Folder.js'



const { writeTextFile , consoleSize , stdout , args , chown } = Deno;
const { log , clear } = console;


let { columns, rows } = consoleSize(stdout.rid);


import { parse } from 'Args';
const Parameter = parse(args);








rows -= 3;


let option = 1;
let content = [];
let actions = '';


Deno.setRaw(0,true);


function drawMainMenu(){

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




function drawUpdateMenu(){

    clear();

    content = [
        '' ,
        `  Ｕｐｄａｔｉｎｇ　${ bold(red('ＳｅｒｖｅｄＳｐｉｃｙ')) }`,
        ''
    ];

    log(fill(content.join('\n'),dark));

}



function select(title,isSelected = false){
    return isSelected
        ? `> ${ title } <`
        : title;
}




await mainMenu();

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










async function update(){

    drawUpdateMenu();

    while(true){
        await userInput();
    }
}



function sleep(millis){
    return new Promise((resolve) => {
        setTimeout(resolve,millis);
    });
}



async function mainMenu(){

    drawMainMenu();

    while(true){

        drawMainMenu();

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









function exit(){
    clear();
    Deno.exit();
}
