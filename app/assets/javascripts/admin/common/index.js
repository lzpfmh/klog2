define(function(require, exports, module) {
    var angular = require('angularjs');
    var ngAnimate = require('angular-animate');
    var ngResource = require('angular-resource');
    var ngRoute = require('angular-route');
    var ngSanitize = require('angular-sanitize');
    var bootstrap = require('angular/bootstrap/0.0.1/index');
    var ajaxSpinner = require('./ajax-spinner');
    var validation = require('./validation');

    var common = angular.module('common', [
        ngAnimate.name,
        ngRoute.name,
        ngResource.name,
        ngSanitize.name,
        bootstrap.name,
        ajaxSpinner.name,
        validation.name
    ]);

    common.controller(require('./controller/nav'));

    common.factory(require('./factory/attach'));
    common.factory(require('./factory/blog'));
    common.factory(require('./factory/category'));
    common.factory(require('./factory/confirm'));
    common.factory(require('./factory/flash'));

    common.directive(require('./directive/popover'));
    common.directive(require('./directive/scroll-top-percent'));
    common.directive(require('./directive/loading-btn'));
    common.directive(require('./directive/file-input'));

    module.exports = common;
});