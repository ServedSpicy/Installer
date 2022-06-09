
import * as Serial from '../Actions/Serial.js'
import { Enter } from '../Keys.js'
import { center , lines , width , fill } from '../Format.js'
import { desktop_entry , folder } from '../Paths.js'
import { blue , red , bold , dark } from 'Color';
import * as Temp from '../Actions/Temp.js'
import * as DesktopEntry from '../Actions/DesktopEntry.js'
import { userInput } from '../Input.js'
import * as Folder from '../Actions/Folder.js'
import { join } from 'Path';
import { walk } from 'File';


const release = 'https://github.com/ServedSpicy/Bundle/releases/download/Alpha-0.1.0/ServedSpicy.zip';


const { writeTextFile , args , stdout , consoleSize } = Deno;
const { log , clear } = console;

import { parse } from 'Args';
const Parameter = parse(args);


let { columns , rows } = consoleSize(stdout.rid);

rows -= 3;


let content = [];
let actions = '';



function exit(){
    clear();
    Deno.exit();
}

function sleep(millis){
    return new Promise((resolve) => {
        setTimeout(resolve,millis);
    });
}



async function curlRelease(){

    const dir = await Folder.makeTemporary();


    {
        const process = Deno.run({
            cmd : [ 'curl' , '--output' , join(dir,'Release.zip') , '-LJO' , release ],
            stdout : 'null' ,
            stderr : 'null'
        });

        const status = await process.status();
    }

    {
        const process = Deno.run({
            cmd : [ 'unzip' , '-d' , folder , join(dir,'Release.zip') ],
            stdout : 'null' ,
            stderr : 'null'
        });

        const status = await process.status();
    }

    await Deno.remove(dir,{ recursive : true });

    for await (const file of walk(folder))
        await Deno.chown(file.path,Parameter.user,Parameter.group);
}


function draw(){

    clear();

    log(fill([
        '' ,
        `  Ｉｎｓｔａｌｌｉｎｇ　${ bold(red('ＳｅｒｖｅｄＳｐｉｃｙ')) }`,
        '' ,
        ... content ,
        ... lines(rows - (content.length + 3 + 4)) ,
        '' ,
        center(actions) ,
        '' ,
        ''
    ].join('\n'),dark));


}




export default async function(){

    actions = '';

    content = [
        `   ⏳ Installing ${ red('Serial Library') } via ${ red('DPKG') }.` ,
        `      ⤷ ${ blue('libserial1') }`
    ];

    draw();

    let before = Date.now();

    let result = [
        `   ✅ Installed ${ red('Serial Library') } via ${ red('DPKG') }.` ,
        `      ⤷ ${ blue('libserial1') }`
    ];

    let installed = false;

    installed = await Serial.isInstalled();

    if(installed){

        result = [
            `   💬 The ${ red('Serial Library') } was already installed.` ,
            `      ⤷ ${ blue('libserial1') }`
        ]

    } else {
        await Serial.install();
    }


    let delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);

    draw();




    await sleep(400);

    content.push(
        '',
        `   ⏳ Creating the ${ red('ServedSpicy Folder') }.` ,
        `      ⤷ ${ blue(folder) }`
    );


    draw();

    result = [
        `   ✅ Created the ${ red('ServedSpicy Folder') }` ,
        `      ⤷ ${ blue(folder) }`
    ];

    before = Date.now();

    try {
        await Folder.create();
    } catch (error) {

        throw error;
    }


    delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);

    draw();



    await sleep(400);

    content.push(
        '',
        `   ⏳ Downloading the ${ red('Latest Release') }.` ,
        `      ⤷ ${ blue(folder) }`
    );


    draw();

    result = [
        `   ✅ Downloaded the ${ red('Latest Release') }` ,
        `      ⤷ ${ blue(folder) }`
    ];

    before = Date.now();

    try {
        await curlRelease();
    } catch (error) {

        throw error;
    }


    delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);


    draw();



    await sleep(400);

    content.push(
        '',
        `   ⏳ Adding the ${ red('Desktop Entry') }.` ,
        `      ⤷ ${ blue(desktop_entry) }`
    );

    result = [
        `   ✅ Added the ${ red('Desktop Entry') }` ,
        `      ⤷ ${ blue(desktop_entry) }`
    ];

    before = Date.now();

    try {
        await DesktopEntry.add();
    } catch (error) {

        throw error;
    }

    delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);



    actions = `Press [${ blue('Enter') }] to finish.`;

    draw();


    while(true){
        const key = await userInput([ Enter ]);

        if(key)
            exit();
    }
}
