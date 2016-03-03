(function () {
    'use strict';

    angular
        .module('nest')
        .controller('nest.rangeSlider.ctrl', Controller);

    /** @ngInject */
    function Controller($scope) {
        var COMFORTABLE_STEP = $scope.step, // whether the step is comfortable that depends on u
            tracker = $scope.tracker = {    // track style
                width: 0,
                left : 0,
                right: 0
            };

        function updateSliders() {
            if ($scope.upperValue - $scope.lowerValue > $scope.gap) {
                $scope.lowerMaxLimit = $scope.lowerValue + COMFORTABLE_STEP;
                $scope.upperMinLimit = $scope.upperValue - COMFORTABLE_STEP;
            } else {
                $scope.lowerMaxLimit = $scope.lowerValue;
                $scope.upperMinLimit = $scope.upperValue;
            }
            updateSlidersStyle();
        }

        function updateSlidersStyle() {
            // update sliders style
            $scope.lowerWidth = $scope.lowerMaxLimit / $scope.max * 100;
            $scope.upperWidth = ($scope.max - $scope.upperMinLimit) / $scope.max * 100;
            // update tracker line style
            tracker.width = 100 - $scope.lowerWidth - $scope.upperWidth;
            tracker.left = $scope.lowerWidth || 0;
            tracker.right = $scope.upperWidth || 0;
        }

        // watch lowerValue & upperValue to update sliders
        $scope.$watchGroup(["lowerValue", "upperValue"], function (newVal) {
            // filter the default initialization
            if (newVal !== undefined) {
                updateSliders();
            }
        });

        function init() {
            $scope.step = $scope.step || 1;
            $scope.gap = $scope.gap || 0;
            $scope.lowerMaxLimit = $scope.lowerValue + COMFORTABLE_STEP;
            $scope.upperMinLimit = $scope.upperValue - COMFORTABLE_STEP;
            updateSlidersStyle();
        }

        init();
    }

})();
