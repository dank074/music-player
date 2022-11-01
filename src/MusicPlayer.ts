import { Howl } from "howler";
import { TraxData } from "./trax/TraxData";
import { EventEmitter } from 'events';

export class MusicPlayer extends EventEmitter {
    private _currentSong: TraxData | undefined;
    private _startPos: number;
    private _playLength: number;
    private _isPlaying: boolean;
    private _currentPos: number;
    private _cache: Map<number, Howl>;
    private _sampleUrl: string;

    private _tickerInterval: number | undefined;
    private _sequence: ISequenceEntry[][];

    constructor(sampleUrl: string) {
        super();
        this._sampleUrl = sampleUrl;
        this._isPlaying = false;
        this._startPos = 0;
        this._currentPos = 0;
        this._playLength = 0;
        this._sequence = [];
        this._cache = new Map<number, Howl>();
    }

    public async play(song: string, startPos: number = 0, playLength: number = -1): Promise<void>
    {
        this.stop();
        
        this._currentSong = new TraxData(song);
        this._startPos = startPos;
        this._playLength = playLength;
        this._currentPos = startPos;
        this.emit("loading");
        await this.preload();
        this._isPlaying = true;
        this.emit("playing");
        this._tickerInterval = window.setInterval(() => this.tick(), 1000);
    }

    public pause(): void {
        this._isPlaying = false;
        this.emit("paused");
        Howler.stop();
    }

    public resume(): void {
        this._isPlaying = true;
        this.emit("playing");
    }

    /**
     * Sets global howler volume for all sounds
     * @param volume value from 0.0 to 1.0
     */
    public setVolume(volume: number): void {
        Howler.volume(volume);
    }

    /**
     * Gets global howler volume for all sounds
     * @returns value from 0.0 to 1.0
     */
    public getVolume(): number {
        return Howler.volume();
    }

    /**
     * Gets sample from cache or loads it if not in cache
     * @param id sample id
     * @returns howl sound object
     */
    public async getSample(id: number): Promise<Howl> {
        let sample =  this._cache.get(id);

        if(!sample) sample = await this.loadSong(id);

        return Promise.resolve(sample);
    }

    public stop(): void
    {
        this._isPlaying = false;
        clearInterval(this._tickerInterval);
        Howler.stop();
        this._currentSong = undefined;
        this._startPos = 0;
        this._playLength = 0;
        this._sequence = [];
        this._currentPos = 0;
        this.emit("stopped");
    }

    private async preload(): Promise<void>
    {
        this._sequence = [];

        if(!this._currentSong) return;

        for(const channel of this._currentSong.channels)
        {
            const sequenceEntryArray: ISequenceEntry[] = [];
            for(const sample of channel.items)
            {
                let sampleSound = this._cache.get(sample.id);

                if(!sampleSound)
                {
                    sampleSound = await this.loadSong(sample.id);
                }

                const repeat = Math.ceil( (sample.length * 2) / Math.ceil(sampleSound.duration()));

                for(let i = 0; i < repeat; i++)
                {
                    const entry: ISequenceEntry = { sampleId: sample.id, position: 0 };
                    sequenceEntryArray.push(entry);

                    for(let l = 0; l < (Math.ceil(sampleSound.duration()) - 1); l++)
                    {
                        const entry: ISequenceEntry = { sampleId: sample.id, position: l + 1 };
                        sequenceEntryArray.push(entry);
                    }
                }
            }

            this._sequence.push(sequenceEntryArray);
        }

        if(this._playLength <= 0) this._playLength = Math.max(...this._sequence.map( (value: ISequenceEntry[] ) => value.length))
    }

    private async loadSong(songId: number): Promise<Howl>
    {
        return new Promise <Howl>((resolve, reject) =>
        {
            const sample = new Howl({
                src: [this._sampleUrl.replace('%sample%', songId.toString())],
                preload: true,
            });

            sample.once('load', () =>
            {
                this._cache.set(songId, sample);
                resolve(sample);
            });

            sample.once('loaderror', () =>
            {
                console.log('failed to load sample ' + songId);
                reject('failed to load sample ' + songId);
            });
        });
    }


    private tick(): void
    {
        if(this._currentPos > this._playLength - 1)
        {
            this.stop();
        }

        if(this._isPlaying)
        {
            if(this._currentSong)
            {
                this.emit("time", this._currentPos);
                this.playPosition(this._currentPos);
            }

            this._currentPos++;
        }
    }

    private playPosition(pos: number): void
    {
        if(this._currentSong && this._sequence)
        {
            for(const sequencyEntry of this._sequence)
            {
                const entry = sequencyEntry[pos];
                if(!!entry && entry.sampleId !== -1)
                {
                    const sampleAudio = this._cache.get(entry.sampleId);

                    if(!sampleAudio) return;

                    if(entry.position === 0)
                    {
                        sampleAudio.play();
                    }
                    // code below is wrong. Need to keep track of id of current playing one
                    else if(!sampleAudio.playing())
                    {
                        sampleAudio.seek(entry.position);
                        sampleAudio.play();
                    }
                }
            }
        }
    }

}

interface ISequenceEntry
{
    sampleId: number;
    position: number;
}