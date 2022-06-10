
import main from './Menu/Main.js'
import { exit } from './Deno.js'

const { setRaw } = Deno;



setRaw(0,true);

await main();

exit();
