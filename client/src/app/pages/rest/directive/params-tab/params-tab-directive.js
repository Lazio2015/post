/**
 * Created by Lenur on 08.01.2016.
 */

function ParamsTabDirective() {
    return {
        restrict: 'C',
        templateUrl: 'tpls/pages/rest/directive/params-tab/params-tab.html',
        controller: 'ParamsTabDirectiveCtrl',
        controllerAs: 'paramsTab',
        scope: {
            item: '='
        },
        link: function (scope, element, attr) {

        }
    }
}
