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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class EventEmitter {
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

        return eventListeners.on.map(item => item.listener).concat(eventListeners.once.map(item => item.listener));
    }

    emit(eventName) {
        if (!this.events.hasOwnProperty(eventName)) {
            return false;
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        const eventListeners = this.events[eventName],
              listenerArgs = [].concat(args),
              listenerCallDelegate = item => item.listener.apply(item.context, listenerArgs);

        this.events = Object.assign({}, this.events, {
            [eventName]: {
                on: eventListeners.on,
                once: []
            }
        });

        eventListeners.on.forEach(listenerCallDelegate);
        eventListeners.once.forEach(listenerCallDelegate);

        return true;
    }

    emitAsync(eventName) {
        var _this = this,
            _arguments = arguments;

        return _asyncToGenerator(function* () {
            if (!_this.events.hasOwnProperty(eventName)) {
                return false;
            }

            for (var _len2 = _arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = _arguments[_key2];
            }

            const eventListeners = _this.events[eventName],
                  listenerArgs = [].concat(_toConsumableArray(args)),
                  listenerCallDelegate = function listenerCallDelegate(item) {
                return new Promise(function (resolve, reject) {
                    try {
                        resolve(item.listener.apply(item.context, listenerArgs));
                    } catch (err) {
                        reject(err);
                    }
                });
            };

            _this.events = Object.assign({}, _this.events, {
                [eventName]: {
                    on: eventListeners.on,
                    once: []
                }
            });

            const result = eventListeners.on.map(listenerCallDelegate).concat(eventListeners.once.map(listenerCallDelegate));

            yield Promise.all(result);

            return true;
        })();
    }

    on(eventName, listener, context, prepend) {
        if (eventName in this.events) {
            const eventListeners = this.events[eventName];

            let on;

            if (prepend) {
                on = [{
                    listener: listener,
                    context: context
                }].concat(_toConsumableArray(eventListeners.on));
            } else {
                on = [].concat(_toConsumableArray(eventListeners.on), [{
                    listener: listener,
                    context: context
                }]);
            }

            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: on,
                    once: eventListeners.once
                }
            });
        } else {
            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: [{
                        listener: listener,
                        context: context
                    }],
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
                once = [{
                    listener: listener,
                    context: context
                }].concat(_toConsumableArray(eventListeners.once));
            } else {
                once = [].concat(_toConsumableArray(eventListeners.once), [{
                    listener: listener,
                    context: context
                }]);
            }

            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: eventListeners.on,
                    once: once
                }
            });
        } else {
            this.events = Object.assign({}, this.events, {
                [eventName]: {
                    on: [],
                    once: [{
                        listener: listener,
                        context: context
                    }]
                }
            });
        }

        // this.emit('newListener', eventName, listener);

        return this;
    }

    off(eventName, listener) {
        const listenerRemoveFilter = item => item.listener !== listener;

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

exports.EventEmitter = EventEmitter;
EventEmitter.defaultMaxListeners = 10;

exports.default = EventEmitter;