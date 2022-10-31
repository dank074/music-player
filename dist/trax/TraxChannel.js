export class TraxChannel {
    constructor(id) {
        this._id = id;
        this._items = [];
    }
    addChannelItem(item) {
        this._items.push(item);
    }
    get items() {
        return this._items;
    }
}
