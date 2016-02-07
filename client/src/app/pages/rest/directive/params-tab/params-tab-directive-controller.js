/**
 * Created by Lenur on 08.01.2016.
 */

function ParamsTabDirectiveCtrl () {
    var paramsTab = this;

    paramsTab.bodyType = 'formData';

    paramsTab.checkBodyType = function(type) {
        return (paramsTab.bodyType == type) ? true : false;
    }
}