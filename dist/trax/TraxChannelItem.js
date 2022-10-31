export class TraxChannelItem {
    constructor(id, length) {
        this._id = id;
        this._length = length;
    }
    get id() {
        return this._id;
    }
    get length() {
        return this._length;
    }
}
