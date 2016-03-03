(function () {
    'use strict';

    angular
        .module('nest.thermostat')
        .controller('nest.thermostat.ctrl', Controller);

    /** @ngInject */
    function Controller($rootScope, $scope, nestThermostatSvc) {

        $scope.isReady = true;

        $scope.thermostat = {};

        $scope.temperature = {
            min: 9,
            max: 32,
            target: 15,
            range: [18, 21],
            set: function(value) {
                var scale = $scope.scale.get().toLowerCase(),
                    hvac_mode = $scope.hvac_mode.value,
                    hvac_state = $scope.hvac_mode.syncState(hvac_mode);

                nestThermostatSvc.target_temperature_strategy[hvac_mode](scale, value, hvac_state);
            },
            change: function() {
                this.set($scope.hvac_mode.value === "heat-cool" ? this.range : this.target);
            },
            isScale: function(value) {
                return $scope.scale.get().toLowerCase() === value;
            }
        };

        $scope.scale = {
            value: "C",
            options: ["C", "F"],
            change: function() {console.log(this.value);
                this.value = this.value === 'C' ? 'F' : 'C';
                this.set(this.value);
            },
            set: function(value) {
                nestThermostatSvc.setData("temperature_scale", value);
            },
            get: function() {
                return this.value;
            }
        }

        $scope.hvac_mode = {
            value: null,
            options: ["off", "cool", "heat", "heat-cool"],
            set: function(value) {
                nestThermostatSvc.setData("hvac_mode", value);
                nestThermostatSvc.setData("hvac_state", this.syncState(value));
            },
            syncState: function(value) {
                return nestThermostatSvc.hvac_mode_strategy[value]($scope.thermostat);
            },
            canHeatCool: function() {
                return $scope.thermostat.can_cool && $scope.thermostat.can_heat;
            },
            canAction: (function() {

                var cool = ["cool", "heat-cool"],
                    heat = ["heat", "heat-cool"];

                return function(value) {
                    var data = $scope.thermostat;

                    switch(value) {
                        case "cool":
                            return !data.can_cool;
                        case "heat":
                            return !data.can_heat;
                        case "heat-cool":
                            return !data.can_cool || !data.can_heat;
                        case "off":
                            return false;
                    }
                }

            }()),
            change: function(value) {
                this.set(value);
            }
        }

        $rootScope.$on('thermostat:changed', function() {
            var data = nestThermostatSvc.thermostat,
                scale;

            $scope.scale.value = data.temperature_scale;

            scale = temperature.isScale("c") ? "c" : "f";

            $scope.thermostat = data;
            $scope.temperature.target = data["target_temperature_" + scale];
            $scope.temperature.range = data["target_temperature_low_" + scale, "target_temperature_high_" + scale];

            $scope.hvac_mode.value = data.hvac_mode;

            $scope.isReady = true;
        });
    }

})();
