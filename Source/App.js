
import main from './Menu/Main.js'
import { exit } from './Deno.js'

const { setRaw , stdin } = Deno;



setRaw(stdin.rid,true);

await main();

exit();
