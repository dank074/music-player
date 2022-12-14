import { Howl } from "howler";
import { EventEmitter } from 'events';
export interface MusicPlayer extends EventEmitter {
    /**
     * Emitted when the music player starts playing
     * @eventProperty
     */
    on(event: 'playing', listener: (currentTime: number, totalTime: number) => void): this;
    /**
     * Emitted when the music player stops playing
     * @eventProperty
     */
    on(event: 'stopped', listener: () => void): this;
    /**
     * Emitted when the music player is paused
     * @eventProperty
     */
    on(event: 'paused', listener: () => void): this;
    /**
     * Emitted when the music player is loading sounds
     * @eventProperty
     */
    on(event: 'loading', listener: () => void): this;
    /**
     * Emitted when the music player is playing at time <@param time>
     * @eventProperty
     */
    on(event: 'time', listener: (time: number) => void): this;
    /**
     * Emitted when the current song playing ends
     * @eventProperty
     */
    on(event: 'songended', listener: () => void): this;
}
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
    private reset;
    /**
     * Sets global howler volume for all sounds
     * @param volume value from 0.0 to 1.0
     */
    setVolume(volume: number): void;
    /**
     * Gets global howler volume for all sounds
     * @returns value from 0.0 to 1.0
     */
    getVolume(): number;
    /**
     * Gets sample from cache or loads it if not in cache
     * @param id sample id
     * @returns howl sound object
     */
    getSample(id: number): Promise<Howl>;
    private preload;
    private loadSong;
    private tick;
    private playPosition;
}
