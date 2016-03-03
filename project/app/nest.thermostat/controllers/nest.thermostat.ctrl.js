(function () {
    'use strict';

    angular
        .module('nest.thermostat')
        .controller('nest.thermostat.ctrl', Controller);

    /** @ngInject */
    function Controller($scope, nestThermostatSvc) {

        var proto = {
            set: function(value) {
                this.value = value;
            },
            get: function() {
                return this.value;
            },
            is: function(value) {
                return this.value === value;
            }
        };

        var extremas = {
            c: {
                from: 9,
                to: 32,
                step: 0.5
            },
            f: {
                from: 48,
                to: 90,
                step: 1
            }
        };

        $scope.isReady = false;

        $scope.thermostat = {};

        $scope.temperature = {
            min: 9,
            max: 32,
            value: null,
            slider: {},
            range: null,
            set: function(value) {
                var scale = $scope.scale.get(),
                    hvac_mode = $scope.hvac_mode.get();

                if(!scale || !hvac_mode || !value) {
                    return;
                }

                nestThermostatSvc.target_temperature_strategy[hvac_mode](scale.toLowerCase(), value);
            },
            change: function(value) {
                this.set(value);
            }
        };

        $scope.temperature.slider.callback = function(value) {
            $scope.temperature.change(value);
        }

        $scope.scale = Object.create(proto, {});
        angular.extend($scope.scale, {
            value: null,
            options: ["C", "F"],
            is: function(value) {
                return this.value ? this.value.toLowerCase() === value : false;
            }
        });

        $scope.hvac_mode = Object.create(proto, {});
        angular.extend($scope.hvac_mode, {
            value: null,
            options: ["off", "cool", "heat", "heat-cool"],
            set: function(value) {
                nestThermostatSvc.setData("hvac_mode", value);
            },
            canHeatCool: function() {
                return $scope.thermostat.can_cool && $scope.thermostat.can_heat;
            },
            change: function() {
                this.set(this.is("heat-cool") ? "cool" : "heat-cool");
            }
        });

        nestThermostatSvc.on('thermostat:changed', function() {
            var data = nestThermostatSvc.thermostat,
                scale;

            $scope.thermostat = data;

            $scope.scale.set(data.temperature_scale);

            scale = $scope.scale.get().toLowerCase();

            $scope.hvac_mode.value = data.hvac_mode;
            $scope.hvac_mode.model = $scope.hvac_mode.is('heat-cool');

            $scope.temperature.value = data["target_temperature_" + scale];
            $scope.temperature.range = [data["target_temperature_low_" + scale], data["target_temperature_high_" + scale]].join(";")
            angular.extend($scope.temperature.slider, extremas[scale]);

            $scope.isReady = true;

            $scope.safeApply();
        });
    }

})();
