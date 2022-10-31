import { Howl } from "howler";
import { EventEmitter } from 'events';
export declare class MusicPlayer extends EventEmitter {
    private _currentSong;
    private _startPos;
    private _playLength;
    private _isPlaying;
    private _currentPos;
    private _cache;
    private _sampleUrl;
    private _tickerInterval;
    private _sequence;
    constructor(sampleUrl: string);
    play(song: string, startPos?: number, playLength?: number): Promise<void>;
    pause(): void;
    resume(): void;
    stop(): void;
    private preload;
    loadSong(songId: number): Promise<Howl>;
    private tick;
    private playPosition;
}
