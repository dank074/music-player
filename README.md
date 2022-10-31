# music-player

## Listening for events
You can listen for specific events emmited by the music player. Available events are:
- "playing"
- "stopped"
- "paused"
- "loading"

example:
```js
const player = new MusicPlayer( 'https://flash.nitrodev.co/dcr/hof_furni/mp3/sound_machine_sample_%sample%.mp3');

player.on("playing", () => {
    console.log("now playing");
});
```
## Running example
1. build the trax player library by running ```npm install && npm run build``` in the main directory. This will create the built files in the dist directory
2. navigate to `/example` directory and run
``` npm install && npm run start```
This will start the example