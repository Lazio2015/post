/**
 * Created by Lenur on 08.01.2016.
 */

function ParamsListDirective() {
    return {
        restrict: 'AE',
        templateUrl: 'tpls/pages/rest/directive/params-list/params-list.html',
        controller: 'ParamsListDirectiveCtrl',
        controllerAs: 'paramsList',
        scope: {
            params: '&'
        },
        link: function (scope, element, attr) {

        }
    }
}
