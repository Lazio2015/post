/**
 * Created by Lenur on 08.01.2016.
 */

function ParamsListDirective() {
    return {
        require: 'ngModel',
        restrict: 'C',
        templateUrl: 'tpls/pages/rest/directive/params-list/params-list.html',
        scope: {
            params: '=ngModel',
            placeholderKey: '@'
        },
        link: function (scope, element, attr) {

            if (!scope.placeholderKey) {
                scope.placeholderKey = 'URL parameter key';
            }

            scope.addNewParam = function () {
                scope.params.push({key: '', value: ''});
            };

            scope.deleteParam = function (index) {
                scope.params.splice(index, 1);
            };
        }

    }
}
