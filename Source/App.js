
import main from './Menu/Main.js'
import { exit } from './Deno.js'

const { setRaw , stdin } = Deno;


try {

    setRaw(stdin.rid,true);

} catch (error) {}


await main();

exit();
