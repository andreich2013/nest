(function() {
    'use strict';

    angular
        .module('nest', [
            'ngCookies',
            'ngSanitize',
            'ui.router',
            'ngMaterial',

            'nest.thermostat'
        ]);

})();
