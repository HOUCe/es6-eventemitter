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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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

        return this.events[event].on.map(item => item.action).concat(this.events[event].once.map(item => item.action));
    }

    emit(event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        // if (!this.events.hasOwnProperty(event)) {
        //     return false;
        // }

        const eventListeners = this.events[event],
              _fire = item => {
            var _item$action;

            (_item$action = item.action).call.apply(_item$action, [item.context].concat(args));
        };

        eventListeners.on.forEach(_fire);

        eventListeners.once.forEach(_fire);
        eventListeners.once = [];
    }

    on(event, action, context) {
        if (!(event in this.events)) {
            this.events[event] = {
                on: [],
                once: []
            };
        }

        this.events[event].on = [].concat(_toConsumableArray(this.events[event].on), [{
            action: action,
            context: context
        }]);

        return this;
    }

    once(event, action, context) {
        if (!(event in this.events)) {
            this.events[event] = {
                on: [],
                once: []
            };
        }

        this.events[event].once = [].concat(_toConsumableArray(this.events[event].once), [{
            action: action,
            context: context
        }]);

        return this;
    }

    off(event, action) {
        // if (!(event in this.events)) {
        //     return this;
        // }

        this.events[event].on = this.events[event].on.filter(item => item.action !== action);
        this.events[event].once = this.events[event].once.filter(item => item.action !== action);

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