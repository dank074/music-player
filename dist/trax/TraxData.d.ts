import { TraxChannel } from "./TraxChannel";
export declare class TraxData {
    private _channels;
    private _metaData;
    constructor(data: string);
    get channels(): TraxChannel[];
    getSampleIds(): number[];
    get hasMetaData(): boolean;
    get metaCutMode(): boolean;
    get metaTempo(): number | null;
}
