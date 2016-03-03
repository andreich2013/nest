angular
    .module('nest')
    .directive('rangeSlider', function () {
        return {
            restrict   : "E",
            scope      : {
                max       : '=',
                min       : '=',
                gap       : '=?',
                step      : '=?',
                lowerValue: "=",
                upperValue: "="
            },
            templateUrl: 'nest.layout/templates/range-slider.html',
            controller : 'nest.rangeSlider.ctrl'
        };
});