(function () {
    'use strict';

    angular
        .module('nest')
        .config(Config)
        .run(Run);

    /** @ngInject */
    function Config($stateProvider, $locationProvider, $urlRouterProvider) {

        $stateProvider
            .state({
                abstract: true,
                name: 'nest',
                views: {
                    '@': {
                        templateUrl: 'nest.layout/templates/layout.html',
                        controller: 'nest.layout.ctrl'
                    },
                    'top@nest': {
                        templateUrl: 'nest.layout/templates/header.html',
                        controller: 'nest.header.ctrl'
                    }
                }
            });

        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/thermostat');
    }

    /** @ngInject */
    function Run($rootScope, $cookies, $location, nestConfigSvc) {

        var token = $cookies.get('nest_token');

        if (token) {
            nestConfigSvc.data.auth(token);
        } else {
            $location.path('/auth/nest');
        }

        $rootScope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
    }

})();
