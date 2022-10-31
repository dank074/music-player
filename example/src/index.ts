import { MusicPlayer } from '@dank074/music-player';

let player = new MusicPlayer( 'https://flash.nitrodev.co/dcr/hof_furni/mp3/sound_machine_sample_%sample%.mp3');

const container = document.createElement("div");
const statusDiv = document.createElement("div");
const songInput = document.createElement("input");
const button = document.createElement("button");

let isPlaying = false;

statusDiv.innerText = "Stopped"
button.innerHTML = "Play";
songInput.type = "text";
songInput.placeholder = "song";

button.onclick = () => {
    isPlaying = !isPlaying;

    if(isPlaying) {
        player.play(songInput.value);
    }

    else {
        player.stop();
    }
}

player.on("stopped", () => {
    statusDiv.innerText = "Stopped";
    isPlaying = false;
});

player.on("loading", () => {
    statusDiv.innerText = "Loading";
});

player.on("playing", () => {
    statusDiv.innerText = "Playing";
});

player.on("paused", () => {
    statusDiv.innerText = "Paused";
})

container.append(statusDiv);
container.append(songInput);
container.append(button);
document.body.append(container);