
import { Enter } from '../Keys.js'
import { center , lines , width , fill } from '../Format.js'
import { desktop_entry , folder } from '../Paths.js'
import { blue , red , bold , dark } from 'Color';
import * as Temp from '../Actions/Temp.js'
import { userInput } from '../Input.js'
import * as DesktopEntry from '../Actions/DesktopEntry.js'
import { exit , sleep } from '../Deno.js'


const { consoleSize , stdout } = Deno;
const { log , clear } = console;


let { columns , rows } = consoleSize(stdout.rid);

rows -= 3;


let actions = '';
let content = [];



async function removeApplicationFolder(){
    await Deno.remove(folder,{ recursive : true });
}



function draw(){

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



export default async function(){

    actions = '';

    content = [
        `   ⏳ Removing ${ red('Desktop Entry') }` ,
        `      ⤷ ${ blue(desktop_entry) }`
    ];

    draw();

    let before = Date.now();

    let result = [
        `   ✅ Removed ${ red('Desktop Entry') }` ,
        `      ⤷ ${ blue(desktop_entry) }`
    ];

    try {
        await DesktopEntry.remove();
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

    draw();





    await sleep(400);

    content.push(
        '',
        `   ⏳ Removing ${ red('Application Folder') }` ,
        `      ⤷ ${ blue(folder) }`
    );


    draw();

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

    draw();



    {
        await sleep(400);

        content.push(
            '',
            `   ⏳ Removing ${ red('ServedSpicy') } command.` ,
            `      ⤷ ${ blue('/usr/bin/ServedSpicy') }`
        );


        draw();

        result = [
            `   ✅ Removed ${ red('ServedSpicy') } command.` ,
            `      ⤷ ${ blue('/usr/bin/ServedSpicy') }`
        ];

        before = Date.now();

        try {
            await Deno.remove('/usr/bin/ServedSpicy');
        } catch (error) {

            switch(true){
            case error instanceof Deno.errors.NotFound:
                result = [
                    `   💬 The ${ red('ServedSpicy') } command wasn't present to begin with.` ,
                    `      ⤷ ${ blue('/usr/bin/ServedSpicy') }`
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

        draw();
    }



    await sleep(400);

    content.push(
        '',
        `   ⏳ Removing leftover ${ red('Temporary Files') }.` ,
    );


    draw();



    // before = Date.now();


    let c = 0;

    try {

        result = [
            `   💬 There weren't any leftover ${ red('Temporary Files') } to begin with.` ,
            `      ⤷ ${ blue('/tmp/ServedSpicy_*') }`
        ]

        for await (const [ count , files ] of Temp.remove()){

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

            draw();

            if(count < 100)
                await sleep(100 / count);
        }

        if(c < 1){

            content.pop();
            content.push(...result);
        }

        draw();

    } catch (error) {

        throw error;
    }

    //
    // delta = Date.now() - before;
    //
    // await sleep(800 - delta);



    actions = `Press [${ blue('Enter') }] to finish.`;

    draw();



    while(true){
        const key = await userInput([ Enter ]);

        if(key)
            exit();
    }
}
