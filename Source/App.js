
import { blue , red , bold , dark } from 'Color';
import { join } from 'Path';
import { emptyDir } from 'File';
import { walk } from 'File';


const { log , clear } = console;

let { columns, rows } = Deno.consoleSize(Deno.stdout.rid);


import { parse } from 'Args';
const Parameter = parse(Deno.args);

const Ctrl_C = 0x03;
const Arrow_Up = [ 27 , 91 , 65 ];
const Arrow_Left = [ 27 , 91 , 68 ];
const Arrow_Down = [ 27 , 91 , 66 ];
const Arrow_Right = [ 27 , 91 , 67 ];
const Enter = [ 13 ];
const Escape = [ 27 ];

const folder = join(Parameter.home,'.ServedSpicy');



const { min , max } = Math;



import { desktop_entry } from './Paths.js'
import { entry } from './Entry.js'

const { writeTextFile } = Deno;

async function addDesktopEntry(){
    await writeTextFile(desktop_entry,entry);
}



rows -= 3;

// log(blue(('🯰'.repeat(columns)).repeat(rows)))

let option = 1;
let content = [];
let actions = '';


Deno.setRaw(0,true);

// log(blue('🮕🮕🮕\n🮕🮕',true))

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

function drawUninstallMenu(){

    clear();

    log(fill([
        '' ,
        `  Ｕｎｉｎｓｔａｌｌｉｎｇ　${ bold(red('ＳｅｒｖｅｄＳｐｉｃｙ')) }`,
        '' ,
        ... content ,
        ... lines(rows - (content.length + 3 + 4)) ,
        '' ,
        center(actions),
        '' ,
        ''
    ].join('\n'),dark));

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

async function installSerialLibrary(){

    const process = Deno.run({
        cmd : [ 'apt' , 'install' , 'libserial1' ],
        stdout : 'null' ,
        stderr : 'null'
    });

    const status = await process.status();

    // log(status);

    // Deno.exit();
}

async function createFolder(){
    await emptyDir(folder);
}

async function makeTemporaryFolder(){
    return await Deno.makeTempDir({ prefix : 'ServedSpicy_' });
}

async function curlRelease(){

    const dir = await makeTemporaryFolder();

    const release = 'https://github.com/ServedSpicy/Bundle/releases/download/Dummy/Dummy.zip';

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

    // installed = await isSerialInstalled();

    if(installed){

        result = [
            `   💬 The ${ red('Serial Library') } was already installed.` ,
            `      ⤷ ${ blue('libserial1') }`
        ]

    } else {

        try {
            await installSerialLibrary();
        } catch (error) {

            throw error;
        }


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

async function removeDesktopEntry(){
    await Deno.remove(desktop_entry);
}


async function removeApplicationFolder(){
    await Deno.remove(folder,{ recursive : true });
}



async function * removeTemporaryFiles(){

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

    // return [ count , files ];
}

async function uninstall(){

    actions = '';

    content = [
        `   ⏳ Removing ${ red('Desktop Entry') }` ,
        `      ⤷ ${ blue(desktop_entry) }`
    ];

    drawUninstallMenu();

    let before = Date.now();

    let result = [
        `   ✅ Removed ${ red('Desktop Entry') }` ,
        `      ⤷ ${ blue(desktop_entry) }`
    ];

    try {
        await removeDesktopEntry();
    } catch (error) {

        switch(true){
        case error instanceof Deno.errors.NotFound:
            result = [
                `   💬 The ${ red('Desktop Entry') } wasn't present to begin with.` ,
                `      ⤷ ${ blue(desktop_entry) }`
            ]
            break;
        default:
            throw error;
        }
    }

    let delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);

    drawUninstallMenu();





    await sleep(400);

    content.push(
        '',
        `   ⏳ Removing ${ red('Application Folder') }` ,
        `      ⤷ ${ blue(folder) }`
    );


    drawUninstallMenu();

    result = [
        `   ✅ Removed the ${ red('Application Folder') }` ,
        `      ⤷ ${ blue(folder) }`
    ];

    before = Date.now();

    try {
        await removeApplicationFolder();
    } catch (error) {

        switch(true){
        case error instanceof Deno.errors.NotFound:
            result = [
                `   💬 The ${ red('Application Folder') } wasn't present to begin with.` ,
                `      ⤷ ${ blue(folder) }`
            ]
            break;
        default:
            throw error;
        }
    }


    delta = Date.now() - before;

    await sleep(800 - delta);

    content.pop();
    content.pop();
    content.push(...result);

    drawUninstallMenu();


    await sleep(400);

    content.push(
        '',
        `   ⏳ Removing leftover ${ red('Temporary Files') }.` ,
    );


    drawUninstallMenu();



    // before = Date.now();


    let c = 0;

    try {

        result = [
            `   💬 There weren't any leftover ${ red('Temporary Files') } to begin with.` ,
            `      ⤷ ${ blue('/tmp/ServedSpicy_*') }`
        ]

        for await (const [ count , files ] of removeTemporaryFiles()){

            c = count;

            result = [
                `   ✅ Removed ${ red(count) } leftover ${ red('Temporary Files') }.` ,
                ...files
                .map((file) => {
                    return `      ⤷ ${ blue(file) }`
                })
            ];

            for(let i = 0;i < c;i++)
                content.pop();

            content.push(...result);

            drawUninstallMenu();

            if(count < 100)
                await sleep(100 / count);
        }

        if(c < 1){

            content.pop();
            content.push(...result);
        }

        drawUninstallMenu();

    } catch (error) {

        throw error;
    }

    //
    // delta = Date.now() - before;
    //
    // await sleep(800 - delta);



    actions = `Press [${ blue('Enter') }] to finish.`;

    drawUninstallMenu();



    while(true){
        const key = await userInput([ Enter ]);

        if(key)
            exit();
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


function limit(value,minimum,maximum){
    return min(max(value,minimum),maximum);
}


function center(text){

    const length = width(text);

    const padding = (columns - length) * .5;

    return (
        ' '.repeat(padding) +
        text +
        ' '.repeat(columns - length - padding)
    );
}

function * lines(amount){
    while(amount-- >= 0)
        yield '';
}

function width(text){

    const chars = text
        .replace(/\u001b[^m]*?m/g,'')
        .split('');

    let w = 0;

    for(const char of chars){

        const code = char.charCodeAt(0);

        if(code >= 65281 && code <= 65376 || code === 12288 || char === '⏳' || char === '✅'){
            w += 2;
            continue;
        }

        w++;
    }

    return w;
}

function fill(text,color){

    text = text
        .split('\n')
        .map((line) => line + ' '.repeat(columns - width(line)));

    for(let i = text.length;i <= rows;i++)
        text.push(' '.repeat(columns));

    text = text.join('\n');

    return color(text,true);
}

async function userInput(validKeys = []){

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

        // log(sequence);

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


function exit(){
    clear();
    // Deno.setRaw(0,false);
    Deno.exit();
}
