(function() {
    'use strict';

    angular
        .module('nest', [
            'ngCookies',
            'ngSanitize',
            'ui.router',
            'ngMaterial',
            'ui-rangeSlider',

            'nest.thermostat'
        ]);

})();
