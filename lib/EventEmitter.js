/**
 * es6-eventemitter
 *
 * @version v0.0.1
 * @link http://eser.ozvataf.com
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventEmitter = undefined;

var _immunity = require('immunity');

var _immunity2 = _interopRequireDefault(_immunity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        return _immunity2.default.mergeArrays(eventListeners.on.map(item => item.listener), eventListeners.once.map(item => item.listener));
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

        this.events = _immunity2.default.appendToObject(this.events, {
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

            _this.events = _immunity2.default.appendToObject(_this.events, {
                [eventName]: {
                    on: eventListeners.on,
                    once: []
                }
            });

            const result = _immunity2.default.mergeArrays(eventListeners.on.map(listenerCallDelegate), eventListeners.once.map(listenerCallDelegate));

            yield Promise.all(result);

            return true;
        })();
    }

    on(eventName, listener, context, prepend) {
        if (eventName in this.events) {
            const eventListeners = this.events[eventName];

            this.events = _immunity2.default.appendToObject(this.events, {
                [eventName]: {
                    on: (prepend ? _immunity2.default.prependToArray : _immunity2.default.appendToArray)(eventListeners.on, {
                        listener: listener,
                        context: context
                    }),
                    once: eventListeners.once
                }
            });
        } else {
            this.events = _immunity2.default.appendToObject(this.events, {
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

            this.events = _immunity2.default.appendToObject(this.events, {
                [eventName]: {
                    on: eventListeners.on,
                    once: (prepend ? _immunity2.default.prependToArray : _immunity2.default.appendToArray)(eventListeners.once, {
                        listener: listener,
                        context: context
                    })
                }
            });
        } else {
            this.events = _immunity2.default.appendToObject(this.events, {
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

            this.events = _immunity2.default.appendToObject(this.events, {
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

        this.events = _immunity2.default.removeKeyFromObject(this.events, eventName);
    }
}

exports.EventEmitter = EventEmitter;
EventEmitter.defaultMaxListeners = 10;

exports.default = EventEmitter;