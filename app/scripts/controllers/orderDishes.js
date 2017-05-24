'use strict';

angular.module('epartyClound').controller('orderDishesCtrl',function($scope,$http,$state){
	$scope.isList = true;
	$scope.menuCount = 0;
	$scope.sumCount = 0;
	$scope.sumPrice = 0;
	$scope.cartList = [];
	$scope.showCart = false;
	$scope.showClearCart = false;
	$scope.replaceCuIndex = false;
	$scope.showAnimate = false;
	$scope.currentIndex = 0;
	$scope.listHeight = [];
	$scope.scrollY = 0;
	$scope.dropBalls = [];
	$scope.balls = [
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        },
        {
          show:false
        }
    ];

	$http.get('/json/orderDishes.json')
	.then(function(res){
		if(res.data.code==200){
			$scope.dishesList = res.data.model.dishesSortList;
		}
		
	},function(error){
		console.log(error);
	});

	//加载菜单列表
	$http.get('/json/loadStoreInfo.json')
	.then(function(res){
		if(res.data.code==='200'){
			$scope.info = res.data.model;

	        //初始化滚动条
			$scope.initScroll();
			$scope.initHeight();
		}
	});

	$scope.initScroll = function() {
		//iscroll通用模块
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端	
		var clickEvent=false;
		if(isAndroid){clickEvent=true;}
		var wrapper = document.getElementById('shopmenu-list');
		$scope.myScroll = new IScroll(wrapper, {
			click: clickEvent,
			scrollbars:false,
			probeType: 3,
			mouseWheel: true
			// scrollBar:false
		});

		//左侧菜单滚动条初始化
		var leftmenu = document.getElementById('shopmenu-category');
		$scope.leftScroll = new IScroll(leftmenu, {
			click:clickEvent
		})

		$scope.myScroll.on('scrollEnd', function () {
			$scope.scrollY = Math.abs(Math.round(this.y))
            for(var j=0; j<$scope.listHeight.length; j++){
              var height1 = $scope.listHeight[j];
              var height2 = $scope.listHeight[j+1];
              if(!height2 || ($scope.scrollY>=height1 && $scope.scrollY<height2)){
	              	if($scope.replaceCuIndex){//点击左边菜单
	              		$scope.replaceCuIndex = false;
                        return $scope.currentIndex;
                    }else{
                       	$scope.currentIndex = j;
                       	$scope.$apply();
                       	return;
                    }
              }
            }
		});
	}

	//下一步
	$scope.nextClick = function() {
		var _cartList = $scope.cartList;
		sessionStorage.setItem("cartList",JSON.stringify(_cartList));
		alert("共消费：¥"+$scope.sumPrice.toFixed(2));
		// $state.go("confirm");
	}

	//选中左侧菜单
	$scope.selectMenu = function(index,event) {
		$scope.currentIndex = index;
        if(!$scope.replaceCuIndex){
          $scope.replaceCuIndex = true;
        }
        var foodList = document.getElementsByClassName("listgroup");
        var el = foodList[index];
        //获取列表dom，并且滚动到对应位置 
        $scope.myScroll.scrollToElement(el,300);
	}

	//计算菜单分类高度
	$scope.initHeight = function() {
		//计算每个分类的高度
        var foodList = document.getElementsByClassName("listgroup");
        var height = 0;
        $scope.listHeight.push(height);
        for(var i=0;i<foodList.length;i++){
          var item = foodList[i];
          height += item.clientHeight;
          $scope.listHeight.push(height)
        }
	}

	//加菜
	$scope.addDish = function(subitem,target){
		if(!subitem.count){
			subitem['count'] = 0;
		}

		subitem.count++;
		
		//初始化菜单总数量和点餐总数量
		$scope.initCount();

		//小球动画
		for(let i=0;i<$scope.balls.length;i++){
          var ball =$scope.balls[i]
          if(!ball.show){
            ball.show=true;
            ball.el=target;
            $scope.dropBalls.push(ball);
            return;
          }
        }
	};

	//减菜
	$scope.decreaseDish = function(subitem) {
		if(!subitem.count){
			return;
		}

		subitem.count--;

		//初始化菜单总数量和点餐总数量
		$scope.initCount();
	};

	//显示隐藏购物车
	$scope.showCartList = function() {
		if($scope.sumCount==0) return;
		this.showCart = !this.showCart;
	};

	//确定要清空购物车吗？
	$scope.showClearBox = function() {
		$scope.showClearCart = true;
		$scope.showCart = false;
	};

	//确定清空购物车
	$scope.clearCart = function() {
		$scope.cartList = [];
		$scope.sumCount = 0;
		$scope.sumPrice = 0;

		angular.forEach($scope.dishesList,function(data,index,array){
			$scope.submenuCount = 0;
			angular.forEach(data.list,function(subdata,index,array){
				if(subdata.count){
					subdata.count = 0;
				}

			})
			if(data.submenuCount){
				data.submenuCount = 0
			}
		});

		$scope.showClearCart = false;
	};

	//菜品数量统计
	$scope.initCount = function() {
		$scope.cartList = [];
		$scope.sumCount = 0;
		$scope.sumPrice = 0;
		angular.forEach($scope.dishesList,function(data,index,array){
			$scope.submenuCount = 0;
			angular.forEach(data.list,function(subdata,index,array){
				if(subdata.count){
					$scope.submenuCount += subdata.count;
					$scope.sumCount += subdata.count;
					$scope.sumPrice += subdata.count * subdata.price;
					$scope.cartList.push(subdata);
				}

			})
			if(!data.submenuCount){
				data['submenuCount'] = 0;
			}
			data.submenuCount = $scope.submenuCount;
		})

		//如果总数为0，隐藏购物车
		if($scope.sumCount==0){
			$scope.showCart = false;
		}
	};
});