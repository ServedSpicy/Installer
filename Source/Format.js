

export function center(text){

    const length = width(text);

    const padding = (columns - length) * .5;

    return (
        ' '.repeat(padding) +
        text +
        ' '.repeat(columns - length - padding)
    );
}

export function * lines(amount){
    while(amount-- >= 0)
        yield '';
}

export function width(text){

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

export function fill(text,color){

    text = text
        .split('\n')
        .map((line) => line + ' '.repeat(columns - width(line)));

    for(let i = text.length;i <= rows;i++)
        text.push(' '.repeat(columns));

    text = text.join('\n');

    return color(text,true);
}
