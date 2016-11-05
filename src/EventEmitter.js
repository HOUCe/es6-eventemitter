export class EventEmitter {
    constructor() {
        this.events = {};
        this.maxListeners = this.constructor.defaultMaxListeners;
    }

    getMaxListeners() {
        return this.maxListeners;
    }

    setMaxListeners(value) {
        this.maxListeners = value;

        return this;
    }

    eventNames() {
        return Object.getOwnPropertyNames(this.events);
    }

    listenerCount(eventName) {
        const available = this.events.hasOwnProperty(eventName);

        if (!available) {
            return 0;
        }

        const eventListeners = this.events[eventName];

        return eventListeners.on.length + eventListeners.once.length;
    }

    listeners(eventName, exists) {
        const available = this.events.hasOwnProperty(eventName);

        if (exists) {
            return available;
        }

        if (!available) {
            return [];
        }

        const eventListeners = this.events[eventName];

        return eventListeners.on.map((item) => item.listener)
            .concat(eventListeners.once.map((item) => item.listener));
    }

    emit(eventName, ...args) {
        if (!this.events.hasOwnProperty(eventName)) {
            return false;
        }

        const eventListeners = this.events[eventName],
            listenerArgs = [ ...args ],
            listenerCallDelegate = (item) => item.listener.apply(item.context, listenerArgs);

        eventListeners.on.forEach(listenerCallDelegate);
        eventListeners.once.forEach(listenerCallDelegate);

        this.events = Object.assign({}, this.events, {
            [eventName]: {
                on: eventListeners.on,
                once: []
            }
        });

        return true;
    }

    on(eventName, listener, context, prepend) {
        if (eventName in this.events) {
            const eventListeners = this.events[eventName];

            let on;

            if (prepend) {
                on = [
                    {
                        listener: listener,
                        context: context
                    },
                    ...eventListeners.on
                ];
            }
            else {
                on = [
                    ...eventListeners.on,
                    {
                        listener: listener,
                        context: context
                    }
                ];
            }

            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: on,
                    once: eventListeners.once
                }
            });
        }
        else {
            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: [
                        {
                            listener: listener,
                            context: context
                        }
                    ],
                    once: []
                }
            });
        }

        // this.emit('newListener', eventName, listener);

        return this;
    }

    once(eventName, listener, context, prepend) {
        if (eventName in this.events) {
            const eventListeners = this.events[eventName];

            let once;

            if (prepend) {
                once = [
                    {
                        listener: listener,
                        context: context
                    },
                    ...eventListeners.once
                ];
            }
            else {
                once = [
                    ...eventListeners.once,
                    {
                        listener: listener,
                        context: context
                    }
                ];
            }

            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: eventListeners.on,
                    once: once
                }
            });
        }
        else {
            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: [],
                    once: [
                        {
                            listener: listener,
                            context: context
                        }
                    ]
                }
            });
        }

        // this.emit('newListener', eventName, listener);

        return this;
    }

    off(eventName, listener) {
        const listenerRemoveFilter = (item) => item.listener !== listener;

        if (eventName in this.events) {
            const eventListeners = this.events[eventName];

            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: eventListeners.on.filter(listenerRemoveFilter),
                    once: eventListeners.once.filter(listenerRemoveFilter)
                }
            });
        }

        // this.emit('removeListener', eventName, listener);

        return this;
    }

    addListener(eventName, listener, context) {
        return this.on(eventName, listener, context, false);
    }

    prependListener(eventName, listener, context) {
        return this.on(eventName, listener, context, true);
    }

    prependOnceListener(eventName, listener, context) {
        return this.once(eventName, listener, context, true);
    }

    removeListener(eventName, listener) {
        return this.off(eventName, listener);
    }

    removeAllListeners(eventName) {
        if (eventName === undefined) {
            this.events = {};

            return;
        }

        const newEvents = {};

        for (const eventKey of Object.getOwnPropertyNames(this.events)) {
            if (eventKey !== eventName) {
                newEvents[eventKey] = this.events[eventKey];
            }
        }

        // this.emit('removeListener', eventName, listener);

        this.events = newEvents;
    }
}

EventEmitter.defaultMaxListeners = 10;

export default EventEmitter;
