/**
 * Created by Lenur on 08.01.2016.
 */

function ParamsListDirective() {
    return {
        require: 'ngModel',
        restrict: 'AE',
        templateUrl: 'tpls/pages/rest/directive/params-list/params-list.html',
        controller: 'ParamsListDirectiveCtrl',
        controllerAs: 'paramsList',
        scope: {
            params: '=ngModel'
        },
        link: function (scope, element, attr) {
            //scope.openParams = function() {
            //    scope.isCollapsed = !scope.isCollapsed;
            //};

            scope.addNewParam = function () {
                scope.params.push({
                    key: '',
                    value: ''
                });
            };

            scope.deleteParam = function (index) {
                scope.params.splice(index, 1);
            };
        }
    }
}
