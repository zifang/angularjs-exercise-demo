'use strict';

/**
 * @ngdoc overview
 * @name epartyClound
 * @description
 * # epartyClound
 *
 * Main module of the application.
 */

angular.module('epartyClound', [
  'ui.router'
])

.config(function ($stateProvider,$urlRouterProvider) {

  $urlRouterProvider.when("","/orderDishes");

  $stateProvider
  .state('orderDishes',{
    url:'/orderDishes',
    templateUrl:'/views/orderDishes.html',
    controller:'orderDishesCtrl'
  })
  .state('alreadyOrder',{
    url:'/alreadyOrder',
    templateUrl:'/views/alreadyOrder.html',
    controller:'alreadyOrderCtrl'
  })
  .state('mycenter',{
    url:'/mycenter',
    templateUrl:'/views/mycenter.html',
    controller:'mycenterCtrl'
  })
  .state('details',{
    url:'/details/:orderId/:storeId/:token/:orderType',
    templateUrl:'/views/details.html',
    controller:'detailsCtrl'
  })
  .state('comment',{
    url:'/comment',
    templateUrl:'/views/comment.html',
    controller:'commentCtrl'
  })
  .state('confirm',{
    url:'/confim',
    templateUrl:'/views/confrim.html',
    controller:'confirmCtrl'
  })

  $urlRouterProvider.otherwise("/orderDishes");
});
