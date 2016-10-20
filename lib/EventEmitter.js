/**
 * es6-eventemitter
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class EventEmitter {
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

        return this.events[event].map(item => item.action);
    }

    emit(event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        if (!this.events.hasOwnProperty(event)) {
            return false;
        }

        return this.events[event].map(item => {
            var _item$action;

            if (item.once) {
                delete this.events[event];
            }

            return (_item$action = item.action).call.apply(_item$action, [item.context].concat(args));
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

    addListener() {
        return this.on.apply(this, arguments);
    }

    removeListener() {
        return this.off.apply(this, arguments);
    }

    removeAllListeners() {
        this.events = {};
    }

    setMaxListeners() {
        return this;
    }
}

exports.EventEmitter = EventEmitter;
exports.default = EventEmitter;