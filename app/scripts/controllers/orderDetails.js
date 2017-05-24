'use strict';

angular.module('epartyClound').controller('detailsCtrl',function($scope,$http,$stateParams){
	$scope.isList = true;
	$scope.orderId = $stateParams.orderId;
	$scope.storeId = $stateParams.storeId;
	$scope.token = $stateParams.token;
	$scope.orderType = $stateParams.orderType;

	$http.get('/json/orderDetails.json')
	.then(function(res){
		if(res.data.code==='200'){
			$scope.data = res.data.model;
		}
		
	},function(error){
		console.log(error);
	});

	//获取广告信息
	$http.get('http://portal.51eparty.com/api/ad?type=ORDER_DETAIL')
	.then(function(res){
		if(res.data.data){
		  if(res.data.data.imageUrl){
		  	$scope.advertise = res.data.data;
		  }
		}
	})

});
//发票类型过滤器
angular.module('epartyClound').filter('invoiceTypeFilter',function(){
	// 0.不需要发票 1.个人纸质 2.个人电子 3.公司纸质 4.公司电子
	return function(status){
		switch(status){
			case 0:
				return "不需要发票";
			case 1:
				return "个人纸质";
			case 2:
				return "个人电子";
			case 3:
				return "公司纸质";
			case 4:
				return "公司电子"
		}
		return "";
	}
})