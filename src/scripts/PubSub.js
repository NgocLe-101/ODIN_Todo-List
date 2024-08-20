export default class PubSub {
    constructor() {
        this._events = {};
    }

    subscribe(event, listener) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(listener);
    }

    unsubscribe(event, listenerToRemove) {
        if (!this._events[event]) return;

        this._events[event] = this._events[event].filter(listener => listener !== listenerToRemove);
    }

    publish(event, data) {
        if (!this._events[event]) return;

        this._events[event].forEach(listener => listener(data));
    }
}