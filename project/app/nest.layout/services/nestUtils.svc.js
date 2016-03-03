(function () {
    'use strict';

    angular
        .module('nest')
        .factory('nestUtilsSvc', Service);

    /** @ngInject */
    function Service($templateCache) {

        var api = {};

        api.observer = {

            on: function(eventName, handler, context) {
                if (!this._eventHandlers) this._eventHandlers = [];
                if (!this._eventHandlers[eventName]) this._eventHandlers[eventName] = [];
                this._eventHandlers[eventName].push({fn: handler, ctx: context});
            },

            off: function(eventName, handler) {
                var handlers = this._eventHandlers[eventName];
                if (!handlers) return;
                for(var i=0; i<handlers.length; i++) {
                    if (handlers[i].fn == handler) handlers.splice(i--, 1);
                }
            },

            trigger: function(eventName) {
                if (!this._eventHandlers || !this._eventHandlers[eventName]) return;

                var args = [].slice.call(arguments, 1);
                this._eventHandlers[eventName].forEach(function(item) {
                    item.fn.apply(item.ctx || this, args);
                }, this);
            }
        };

        api.templateCacheHelper = {
            get: function(input) {
                var data = $templateCache.get(input);

                return angular.isArray(data) ? data[1] : data;
            }
        };

        api.inherit = function (Child, Parent) {
            Child.prototype = Object.create(Parent.prototype);
            Child.prototype.constructor = Child;
        };

        return api;
    }

})();