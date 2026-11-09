import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export default defineConfig({base:'./',define:{__GAME_LAYOUT_HASH__:JSON.stringify(createHash('sha256').update(readFileSync('public/app/game.html')).digest('hex'))},build:{target:'es2022'}});
