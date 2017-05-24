'use strict';

angular.module('epartyClound').controller('mycenterCtrl',function($scope,$http){
	$http.get('/json/orderList.json')
	.then(function(res){
		if(res.data.code === '200'){
			$scope.lists = res.data.model;
		}
	});
});

angular.module('epartyClound').filter('switchStatus',function(){
	return function(status){
		switch(status){
			case 1:
				return "订单已完成";
			case 2:
				return "订单未支付";
			case 3:
				return "订单已支付";
			case 4:
				return "订单已取消";
		}
	};
});

