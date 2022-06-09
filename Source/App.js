
import { Ctrl_C , Arrow_Up , Arrow_Down , Arrow_Left , Arrow_Right , Enter , Escape } from './Keys.js'
import { blue , red , bold , dark } from 'Color';
import { desktop_entry , folder } from './Paths.js'
import { entry } from './Entry.js'
import { join } from 'Path';
import * as Serial from './Actions/Serial.js'

import { limit } from './Math.js'
import { center , lines , width , fill } from './Format.js'
import { emptyDir , walk } from 'File';
import uninstall from './Menu/Uninstall.js'
import { userInput } from './Input.js'


const { writeTextFile , consoleSize , stdout , args , chown } = Deno;
const { log , clear } = console;


let { columns, rows } = consoleSize(stdout.rid);


import { parse } from 'Args';
const Parameter = parse(args);



const release = 'https://github.com/ServedSpicy/Bundle/releases/download/Alpha-0.1.0/ServedSpicy.zip';



async function addDesktopEntry(){
    await writeTextFile(desktop_entry,entry);
    await chown(desktop_entry,Parameter.user,Parameter.group);
}


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

function drawInstallMenu(){

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


async function isSerialInstalled(){

    const process = Deno.run({
        cmd : [ 'dpkg-query' , '--show' , '--showformat=${Package}|${Version}' , 'libserial1' ],
        stdout : 'piped'
    });

    const status = await process.status();

    // log(process,status);

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


async function createFolder(){
    await emptyDir(folder);
}

async function makeTemporaryFolder(){
    return await Deno.makeTempDir({ prefix : 'ServedSpicy_' });
}

async function curlRelease(){

    const dir = await makeTemporaryFolder();


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


async function install(){

    actions = '';

    content = [
        `   ⏳ Installing ${ red('Serial Library') } via ${ red('DPKG') }.` ,
        `      ⤷ ${ blue('libserial1') }`
    ];

    drawInstallMenu();

    let before = Date.now();

    let result = [
        `   ✅ Installed ${ red('Serial Library') } via ${ red('DPKG') }.` ,
        `      ⤷ ${ blue('libserial1') }`
    ];

    let installed = false;

    installed = await isSerialInstalled();

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

    drawInstallMenu();




    await sleep(400);

    content.push(
        '',
        `   ⏳ Creating the ${ red('ServedSpicy Folder') }.` ,
        `      ⤷ ${ blue(folder) }`
    );


    drawInstallMenu();

    result = [
        `   ✅ Created the ${ red('ServedSpicy Folder') }` ,
        `      ⤷ ${ blue(folder) }`
    ];

    before = Date.now();

    try {
        await createFolder();
    } catch (error) {

        throw error;
    }


    delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);

    drawInstallMenu();



    await sleep(400);

    content.push(
        '',
        `   ⏳ Downloading the ${ red('Latest Release') }.` ,
        `      ⤷ ${ blue(folder) }`
    );


    drawInstallMenu();

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


    drawInstallMenu();



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
        await addDesktopEntry();
    } catch (error) {

        throw error;
    }

    delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);



    actions = `Press [${ blue('Enter') }] to finish.`;

    drawInstallMenu();


    while(true){
        const key = await userInput([ Enter ]);

        if(key)
            exit();
    }
}

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
