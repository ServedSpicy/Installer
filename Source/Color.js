
import { bgRgb24 , rgb24 } from 'Colors';


const color_blue = { r : 88 , g : 147 , b : 222 };
const color_red = { r : 221 , g : 135 , b : 137 };
const color_dark = { r : 34 , g : 39 , b : 46 };


function colorize(color){
    return (text,inBackground = false) =>
        (inBackground ? bgRgb24 : rgb24)(`${ text }`,color);
}

// export function blue(text,inBackground = false){
//     return (inBackground ? bgRgb24 : rgb24)(text,color_blue);
// }

export const blue = colorize(color_blue);
export const red = colorize(color_red);
export const dark = colorize(color_dark);

// export function red(text,inBackground = false){
    // return (inBackground ? bgRgb24 : rgb24)(text,color_red);
// }

// export function dark(text,inBackground = false){
//     return (inBackground ? bgRgb24 : rgb24)(text,color_dark);
// }

export { bold } from 'Colors'
