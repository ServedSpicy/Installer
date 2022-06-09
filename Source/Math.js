
const { min , max } = Math;


export function limit(value,minimum,maximum){
    return min(max(value,minimum),maximum);
}
