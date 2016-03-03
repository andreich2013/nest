(function () {
    'use strict';

    angular
        .module('nest.thermostat')
        .config(Config);

    /** @ngInject */
    function Config($stateProvider) {

        $stateProvider
            .state({
                parent: 'nest',
                name: 'thermostat',
                url: '/thermostat',
                views: {
                    '@nest': {
                        templateUrl: 'nest.thermostat/templates/thermostat.html',
                        controller: 'nest.thermostat.ctrl'
                    }
                }
            });

    }

})();