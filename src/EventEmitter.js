export class EventEmitter {
    constructor() {
        this.events = {};
    }

    eventNames() {
        return Object.getOwnPropertyNames(this.events);
    }

    listeners(event, exists) {
        const available = this.events.hasOwnProperty(event);

        if (exists) {
            return available;
        }

        if (!available) {
            return [];
        }

        return this.events[event].on.map((item) => item.action)
            .concat(this.events[event].once.map((item) => item.action));
    }

    emit(event, ...args) {
        if (!this.events.hasOwnProperty(event)) {
            return false;
        }

        const eventListeners = this.events[event],
            _fire = (item) => {
                item.action.call(item.context, ...args);
            };

        eventListeners.on.forEach(_fire);

        eventListeners.once.forEach(_fire);
        eventListeners.once = [];

        return true;
    }

    on(event, action, context) {
        if (!(event in this.events)) {
            this.events[event] = {
                on: [],
                once: []
            };
        }

        this.events[event].on = [
            ...this.events[event].on,
            {
                action: action,
                context: context
            }
        ];

        return this;
    }

    once(event, action, context) {
        if (!(event in this.events)) {
            this.events[event] = {
                on: [],
                once: []
            };
        }

        this.events[event].once = [
            ...this.events[event].once,
            {
                action: action,
                context: context
            }
        ];

        return this;
    }

    off(event, action) {
        // if (!(event in this.events)) {
        //     return this;
        // }

        this.events[event].on = this.events[event].on.filter((item) => item.action !== action);
        this.events[event].once = this.events[event].once.filter((item) => item.action !== action);

        return this;
    }

    addListener(...args) {
        return this.on(...args);
    }

    removeListener(...args) {
        return this.off(...args);
    }

    removeAllListeners() {
        this.events = {};
    }

    setMaxListeners() {
        return this;
    }
}

export default EventEmitter;
