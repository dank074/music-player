var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Howl } from "howler";
import { TraxData } from "./trax/TraxData";
import { EventEmitter } from 'events';
export class MusicPlayer extends EventEmitter {
    constructor(sampleUrl) {
        super();
        this._sampleUrl = sampleUrl;
        this._isPlaying = false;
        this._startPos = 0;
        this._currentPos = 0;
        this._playLength = 0;
        this._sequence = [];
        this._cache = new Map();
    }
    play(song, startPos = 0, playLength = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reset();
            this._currentSong = new TraxData(song);
            this._startPos = startPos;
            this._playLength = playLength;
            this._currentPos = startPos;
            this.emit("loading");
            yield this.preload();
            this._isPlaying = true;
            this.emit("playing", this._currentPos, this._playLength - 1);
            this._tickerInterval = window.setInterval(() => this.tick(), 1000);
        });
    }
    pause() {
        this._isPlaying = false;
        this.emit("paused");
        Howler.stop();
    }
    resume() {
        this._isPlaying = true;
        this.emit("playing", this._currentPos, this._playLength - 1);
    }
    stop() {
        this.reset();
        this.emit("stopped");
    }
    reset() {
        this._isPlaying = false;
        clearInterval(this._tickerInterval);
        Howler.stop();
        this._currentSong = undefined;
        this._startPos = 0;
        this._playLength = 0;
        this._sequence = [];
        this._currentPos = 0;
    }
    /**
     * Sets global howler volume for all sounds
     * @param volume value from 0.0 to 1.0
     */
    setVolume(volume) {
        Howler.volume(volume);
    }
    /**
     * Gets global howler volume for all sounds
     * @returns value from 0.0 to 1.0
     */
    getVolume() {
        return Howler.volume();
    }
    /**
     * Gets sample from cache or loads it if not in cache
     * @param id sample id
     * @returns howl sound object
     */
    getSample(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let sample = this._cache.get(id);
            if (!sample)
                sample = yield this.loadSong(id);
            return Promise.resolve(sample);
        });
    }
    preload() {
        return __awaiter(this, void 0, void 0, function* () {
            this._sequence = [];
            if (!this._currentSong)
                return;
            for (const channel of this._currentSong.channels) {
                const sequenceEntryArray = [];
                for (const sample of channel.items) {
                    let sampleSound = this._cache.get(sample.id);
                    if (!sampleSound) {
                        sampleSound = yield this.loadSong(sample.id);
                    }
                    const repeat = Math.ceil((sample.length * 2) / Math.ceil(sampleSound.duration()));
                    for (let i = 0; i < repeat; i++) {
                        const entry = { sampleId: sample.id, position: 0 };
                        sequenceEntryArray.push(entry);
                        for (let l = 0; l < (Math.ceil(sampleSound.duration()) - 1); l++) {
                            const entry = { sampleId: sample.id, position: l + 1 };
                            sequenceEntryArray.push(entry);
                        }
                    }
                }
                this._sequence.push(sequenceEntryArray);
            }
            if (this._playLength <= 0)
                this._playLength = Math.max(...this._sequence.map((value) => value.length));
        });
    }
    loadSong(songId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sample = new Howl({
                    src: [this._sampleUrl.replace('%sample%', songId.toString())],
                    preload: true,
                });
                sample.once('load', () => {
                    this._cache.set(songId, sample);
                    resolve(sample);
                });
                sample.once('loaderror', () => {
                    console.log('failed to load sample ' + songId);
                    reject('failed to load sample ' + songId);
                });
            });
        });
    }
    tick() {
        if (this._currentPos > this._playLength - 1) {
            this.emit("songended");
            this.stop();
        }
        if (this._isPlaying) {
            if (this._currentSong) {
                this.emit("time", this._currentPos);
                this.playPosition(this._currentPos);
            }
            this._currentPos++;
        }
    }
    playPosition(pos) {
        if (this._currentSong && this._sequence) {
            for (const sequencyEntry of this._sequence) {
                const entry = sequencyEntry[pos];
                if (!!entry && entry.sampleId !== -1) {
                    const sampleAudio = this._cache.get(entry.sampleId);
                    if (!sampleAudio)
                        return;
                    if (entry.position === 0) {
                        sampleAudio.play();
                    }
                    // code below is wrong. Need to keep track of id of current playing one
                    else if (!sampleAudio.playing()) {
                        sampleAudio.seek(entry.position);
                        sampleAudio.play();
                    }
                }
            }
        }
    }
}
