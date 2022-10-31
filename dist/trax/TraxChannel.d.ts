import { TraxChannelItem } from "./TraxChannelItem";
export declare class TraxChannel {
    private _id;
    private _items;
    constructor(id: number);
    addChannelItem(item: TraxChannelItem): void;
    get items(): TraxChannelItem[];
}
