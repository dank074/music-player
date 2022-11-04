import { MusicPlayer } from '@dank074/music-player';
import data from './songs.json';

let player = new MusicPlayer( 'https://flash.nitrodev.co/dcr/hof_furni/mp3/sound_machine_sample_%sample%.mp3');

const container = document.createElement("div");
const statusDiv = document.createElement("div");
const songInput = document.createElement("input");
const button = document.createElement("button");
const stopButton = document.createElement("button");

const inputPreselected = document.createElement("select");

// status:
// 0 - not started
// 1 - playing
// 2 - paused
let status = 0;

let totalTime = 0;

statusDiv.innerText = "Stopped"
button.innerHTML = "Play/Pause";
stopButton.innerHTML = "Stop";
songInput.type = "text";
songInput.placeholder = "song";


inputPreselected.append(document.createElement("option"));

for(let song of data.songs) {
    //populate the songs
    const option = document.createElement("option");
    option.value = song.track;
    option.text = song.name;
    inputPreselected.append(option);
}

inputPreselected.onchange = (event) => {
    songInput.value = inputPreselected.value;
}

button.onclick = () => {
    if(status === 0) {
        player.play(songInput.value);
    }
    else if( status === 1) {
        player.pause();
    }
    else {
        player.resume();
    }
}

stopButton.onclick = () => {
    player.stop();
}

player.on("stopped", () => {
    status = 0;
    statusDiv.innerText = "Stopped";
    console.log("stopped")
});

player.on("loading", () => {
    status = 1;
    statusDiv.innerText = "Loading";
});

player.on("playing", (curr, total) => {
    status = 1;
    totalTime = total;
    statusDiv.innerText = `Playing ${curr}/${totalTime}`;
});

player.on("paused", () => {
    status = 2;
    statusDiv.innerText = "Paused";
});

player.on("time", (pos) => {
    console.log(pos);
    statusDiv.innerText = `Playing ${pos}/${totalTime}`;
});

container.append(statusDiv);
container.append(songInput);
container.append(button);
container.append(stopButton);
container.append(inputPreselected);
document.body.append(container);