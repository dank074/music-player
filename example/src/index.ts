import { MusicPlayer } from '@dank074/music-player';

let player = new MusicPlayer( 'https://flash.nitrodev.co/dcr/hof_furni/mp3/sound_machine_sample_%sample%.mp3');

const container = document.createElement("div");
const statusDiv = document.createElement("div");
const songInput = document.createElement("input");
const button = document.createElement("button");
const stopButton = document.createElement("button");

// status:
// 0 - not started
// 1 - playing
// 2 - paused
let status = 0;

statusDiv.innerText = "Stopped"
button.innerHTML = "Play/Pause";
stopButton.innerHTML = "Stop";
songInput.type = "text";
songInput.placeholder = "song";

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
});

player.on("loading", () => {
    status = 1;
    statusDiv.innerText = "Loading";
});

player.on("playing", () => {
    status = 1;
    statusDiv.innerText = "Playing";
});

player.on("paused", () => {
    status = 2;
    statusDiv.innerText = "Paused";
})

container.append(statusDiv);
container.append(songInput);
container.append(button);
container.append(stopButton);
document.body.append(container);