# music-player
Plays habbo trax music

Test it out at https://dank074.github.io/music-player/

## Usage
```
npm install @dank074/music-player
```
## Listening for events
You can listen for specific events emmited by the music player. Available events are:
- "playing"
- "stopped"
- "paused"
- "loading"
- "time"
- "songended" 

example:
```js
const player = new MusicPlayer( 'https://flash.nitrodev.co/dcr/hof_furni/mp3/sound_machine_sample_%sample%.mp3');

player.on("playing", (currentTime, totalTime) => {
    console.log("now playing at time" + currentTime + "/" + totalTime);
});

player.on("time", (pos) => {
    console.log("current time: " + pos);
})
```
## Running example
1. build the trax player library by running ```npm install && npm run build``` in the main directory. This will create the built files in the dist directory
2. navigate to `/example` directory and run
``` npm install && npm run start```
This will start the example

## Trax track format
The track string follows the following format:

There can be 1 to n channels in a track. Channels are split by the `:` character.

Each channel consists of channel entries which are split by the `;` character.

A channel entry describes the sound id and duration of the sound, split by the `,` character. Duration is in blocks, and each block is 2 seconds long.

For example, the track `1:4,4:2:3,2;2,1:` results in the following:

Second: | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 
| --- | --- | --- | --- | ---- | --- | --- | --- | --- |
| channel 1: | 4| 4 | 4 | 4 | 4| 4 | 4 | 4
| channel 2: | 3 | 3 | 3 | 3 | 2 | 2 | | |
