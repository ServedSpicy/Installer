
import { bgRgb24 , rgb24 } from 'Colors';


const Color = {
    blue : { r : 88 , g : 147 , b : 222 } ,
    dark : { r : 34 , g : 39 , b : 46 } ,
    red : { r : 221 , g : 135 , b : 137 } ,
}


const colorize = (color) => (text,inBackground = false) =>
    (inBackground ? bgRgb24 : rgb24)(`${ text }`,color);


export const blue =
    colorize(Color.blue);

export const red =
    colorize(Color.red);

export const dark =
    colorize(Color.dark);


export { bold } from 'Colors'
