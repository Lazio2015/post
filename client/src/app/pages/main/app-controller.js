/**
 * Created by Lenur on 08.01.2016.
 */


function AppCtrl () {

    var app = this;
    app.selectItem = 'home';

    app.setSelectItem = function (value) {
        app.selectItem = value;
    };
}