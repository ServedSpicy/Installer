
import { blue , red , bold , dark } from 'Color';


const { log , clear } = console;

let { columns, rows } = Deno.consoleSize(Deno.stdout.rid);




const Ctrl_C = 0x03;
const Arrow_Up = [ 27 , 91 , 65 ];
const Arrow_Left = [ 27 , 91 , 68 ];
const Arrow_Down = [ 27 , 91 , 66 ];
const Arrow_Right = [ 27 , 91 , 67 ];
const Enter = [ 13 ];
const Escape = [ 27 ];

const { min , max } = Math;



rows -= 3;

// log(blue(('🯰'.repeat(columns)).repeat(rows)))

let option = 1;


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

    let content = [
        '' ,
        `  Ｉｎｓｔａｌｌｉｎｇ　${ bold(red('ＳｅｒｖｅｄＳｐｉｃｙ')) }`
    ];
    
    log(fill(content.join('\n'),dark));
    
    
}



function drawUpdateMenu(){

    clear();

    let content = [
        '' ,
        `  Ｕｐｄａｔｉｎｇ　${ bold(red('ＳｅｒｖｅｄＳｐｉｃｙ')) }`
    ];
    
    log(fill(content.join('\n'),dark));
    
}

function drawUninstallMenu(){
    
    clear();

    let content = [
        '' ,
        `  Ｕｎｉｎｓｔａｌｌｉｎｇ　${ bold(red('ＳｅｒｖｅｄＳｐｉｃｙ')) }`
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


async function install(){
    
    drawInstallMenu();
    
    while(true){
        await userInput();
    }
}

async function update(){
    
    drawUpdateMenu();
    
    while(true){
        await userInput();
    }
}

async function uninstall(){
    
    drawUninstallMenu();
    
    while(true){
        await userInput();
    }
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
        
        if(code >= 65281 && code <= 65376 || code === 12288){
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