(function () {
    'use strict';

    angular
        .module('nest')
        .provider('nestConfigSvc', Service);

    /** @ngInject */
    function Service(ENV) {

        this.$get = function () {
            return this;
        };

        this.data = new Firebase(ENV.endpoint);

        return this;

    }

})();
