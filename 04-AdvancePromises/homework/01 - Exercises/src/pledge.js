'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
class $Promise {
    constructor(executor){
        if(!executor || typeof executor !== 'function') {
            throw TypeError("Executor must be a function");
        }
        this._state = "pending";
        this._value = undefined;
        this._handlerGroups = [];
        executor(this._internalResolve, this._internalReject);
    }
    _internalResolve = (value) => {
        if(this._state === "pending") {
            this._state = "fulfilled";
            this._value = value;
            this._callHandlers(value);
        }
    }
    _internalReject = (reason) => {
        if(this._state === "pending") {
            this._state = "rejected";
            this._value = reason;
            this._callHandlers(reason);
        }
    }
    _callHandlers = (value) => {
        while(this._handlerGroups.length) {
            const currentHandler = this._handlerGroups.shift();
            if(this._state === "fulfilled") {
                if(currentHandler.successCb) {
                    try {
                        const newValue = currentHandler.successCb(value);
                        if(newValue instanceof $Promise) {
                            return newValue.then(
                                (value) => currentHandler.downstreamPromise._internalResolve(value),
                                (error) => currentHandler.downstreamPromise._internalReject(error)
                            )
                        } else {
                            currentHandler.downstreamPromise._internalResolve(newValue)
                        }
                    } catch(error) {
                        currentHandler.downstreamPromise._internalReject(error)
                    }
                } else {
                    currentHandler.downstreamPromise._internalResolve(value)
                }
            }
            if(this._state === "rejected") {
                if(currentHandler.errorCb) {
                    try {
                        const newValue = currentHandler.errorCb(value);
                        if(newValue instanceof $Promise) {
                            return newValue.then(
                                (value) => currentHandler.downstreamPromise._internalResolve(value),
                                (error) => currentHandler.downstreamPromise._internalReject(error)
                            )
                        } else {
                            currentHandler.downstreamPromise._internalResolve(newValue)
                        }
                    } catch(error) {
                        currentHandler.downstreamPromise._internalReject(error)
                    }
                } else {
                    currentHandler.downstreamPromise._internalReject(value)
                }
            }
        }
    }
    then = (successCb, errorCb) => {
        const downstreamPromise = new $Promise(() => {});
        const handlerGroup = {
            successCb: typeof successCb === 'function' ? successCb : false,
            errorCb: typeof errorCb === 'function' ? errorCb : false,
            downstreamPromise
        };
        this._handlerGroups.push(handlerGroup);
        if(this._state !== "pending") this._callHandlers(this._value);
        return downstreamPromise;
    }
    catch = (errorCb) => {
       return this.then(null, errorCb);
    }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
