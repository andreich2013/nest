(function () {
    'use strict';

    angular
        .module('nest.thermostat')
        .factory('nestThermostatSvc', Service);

    /** @ngInject */
    function Service($rootScope, nestConfigSvc) {
        var self = this;

        this.$get = function () {
            return this;
        };

        this.structure = {};
        this.thermostat = {};

        this.setData = function(property, value) {
            var path = 'devices/thermostats/' + this.thermostat.device_id + '/' + property;

            nestConfigSvc.data.child(path).set(value);
        };

        this.target_temperature_strategy = (function() {

            function cool(scale, value, hvac_state) {
                self.setData("target_temperature_" + scale, value);
                self.setData("hvac_state", hvac_state);
            }

            return {
                cool: cool,
                heat: cool,
                "heat-cool": function(scale, value, hvac_state) {
                    self.setData("target_temperature_low_" + scale, value[0]);
                    self.setData("target_temperature_high_" + scale, value[1]);
                    self.setData("hvac_state", hvac_state);
                },
                off: function() {}
            };

        }());

        this.hvac_mode_strategy = {
            cool: function(thermostat) {
                return thermostat.target_temperature_f < thermostat.ambient_temperature_f ? "cooling" : "off";
            },
            heat: function(thermostat) {
                return thermostat.target_temperature_f > thermostat.ambient_temperature_f ? "heating" : "off";
            },
            "heat-cool": function(thermostat) {
                if(thermostat.target_temperature_f < thermostat.target_temperature_low_f) {
                    return "heating";
                } else if(thermostat.target_temperature_f > thermostat.target_temperature_high_f) {
                    return "cooling";
                } else {
                     return "off";
                }
            },
            off: function() {
                return "off";
            }
        }

        nestConfigSvc.data.on('value', function (snapshot) {
            var data = snapshot.val();

            // For simplicity, we only care about the first
            // thermostat in the first structure
            this.structure = data.structures[Object.keys(data.structures)[0]];
            this.thermostat = data.devices.thermostats[this.structure.thermostats[0]];

            // TAH-361, device_id does not match the device's path ID
            this.thermostat.device_id = this.structure.thermostats[0];

            $rootScope.$emit('thermostat:changed');
        }.bind(this));

        return this;

    }

})();
