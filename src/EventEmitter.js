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

        return this.events[event].map((item) => item.action);
    }

    emit(event, ...args) {
        if (!this.events.hasOwnProperty(event)) {
            return false;
        }

        return this.events[event].map((item) => {
            if (item.once) {
                delete this.events[event];
            }

            return item.action.call(item.context, ...args);
        });
    }

    on(event, action, context) {
        if (!(event in this.events)) {
            this.events[event] = [];
        }

        this.events[event].push({
            action: action,
            context: context,
            once: false
        });

        return this;
    }

    once(event, action, context) {
        if (!(event in this.events)) {
            this.events[event] = [];
        }

        this.events[event].push({
            action: action,
            context: context,
            once: true
        });

        return this;
    }

    off(event, action) {
        if (!(event in this.events)) {
            return this;
        }

        const index = this.events[event].indexOf(action);

        delete this.events[event][index];

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
