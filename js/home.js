////轮播图
//var mySwiper = new Swiper('.swiper-container', {
//	autoplay: 1000,//可选选项，自动滑动
//	pagination : '.swiper-pagination',
//	loop : true,
//})
//滚动条
var myScroll = new IScroll(".H_container",{
	mouseWheel:true,
	scrollbars:true,
	preventDefault: false,
})


$(function(){
	//获取轮播图
	getBanner();
	//点击头部回到顶部
	$('header').on("touchstart",function(){
		myScroll.scrollToElement($('header').get(0),1500)
	})
	//搜索
	$('.search-box').on("focus",function(){
		$('.search-result').css("display","block");
		$('.goods').hide();
		$('.swiper-container').hide();
		getData("selectText",1)
	})
	$('.search-box').on("blur",function(){
		$(this).val('');
  		document.addEventListener("touchend",function(event){
  			$('.search-result').css("display","none");
			$('.goods').show();
			$('.swiper-container').show();
  		})
	})
	$('.search-box').on("input",function(){
		var txt = $(this).val();
		txt = encodeURI(txt);
		getData("selectText",txt);
	})
	var goodsID = getQueryString('goodsID');
	//默认获取商品
	getData("getGoods",1);
	//当前页面页数
	$("#page").val(1);
	//监听滚动事件
	var myScrollY = 0;
	document.addEventListener("touchend",function(){
		if(myScroll.y > 0){
			$('.tips').show();
			$('.goods').empty(); //清空当前商品
			getData("getGoods",1);;//重新获取商品
			$("#page").val(1);
			myScrollY = 0;
		}
		if(myScroll.y >= myScroll.maxScrollY && myScroll.y < myScrollY){
			myScrollY = myScroll.y;
			$('.tips').show();
			var iIndex = parseInt($("#page").val()) + 1;
			getData("getGoods",iIndex);;//重新获取商品
			$("#page").val(iIndex);
		}
	})
})
//获取商品
function getData(type,reqData){
	if(type == "selectText"){
		var toUrl = "http://datainfo.duapp.com/shopdata/selectGoodes.php?callback=";
		reqData = encodeURI(reqData);
		var reqData = {selectText:reqData,linenumber:6};
		var resData = setSelectData;
	}
	if(type == "getGoods"){
		var toUrl = "http://datainfo.duapp.com/shopdata/getGoods.php?callback=";
		var reqData = {classID:reqData};
		var resData = setGoodsData;
	}
	$.ajax({
		type:"get",
		url:toUrl,
		async:true,
		data:reqData,
		success : function(data){
			var data = eval(data);
			$('.tips').hide(5000);
			resData(data);
		}
	});
}
//渲染商品
function setGoodsData(data){
	var $goods = $('.goods');
	$.each(data, function(index) {
		var goodslist = $("<li class='goods-list'></li>"); //存放生成的商品列表
		var goodsinfo = $("<dl class='goods-show'></dl>");
		var imgbox = $("<dt class='goods-img'><img src='img/wait.gif'/></dt>"); //存放图片
		var thisImg = $("<img src='"+data[index].goodsListImg+"'/>"); //图片
		
		//预加载
		thisImg.on("load",function(){
			imgbox.empty();//清除图片盒子内容
			imgbox.append(thisImg); //装入图片
			myScroll.refresh(); //重新刷新滚动条
		})
		//绑定点击事件
		thisImg.on("touchstart",function(){
	 		window.location.href="detail.html?goodsID="+encodeURI(data[index].goodsID)
	 	})
		var lastPrice;
		var discount = data[index].discount;
		if(discount == 0){
			lastPrice = '';
			discount = '亲，暂无优惠哈';
		}else{
			lastPrice = parseInt(data[index].price) * parseInt(discount);
			lastPrice = Math.round(lastPrice);
			lastPrice = "￥" + lastPrice;
			discount = discount + "折";
		}
		//存放商品信息
		var goodsMsg = $("<dd></dd>");
		data[index].goodsName = data[index].goodsName.substr(0,20);
		var goodsName = $("<p class='msg'>"+data[index].goodsName+"...</p>");
		var goodsPrice = $("<p class='price'><span class='now-price'>￥"+data[index].price+"</span><span class='last-price'>"+lastPrice+"</span></p>")
		var goodsDiscount = $("<p class='discount'>"+discount+"</p>");
		var shopcarIcon = $("<div class='add iconfont' data-id="+data[index].goodsID+">&#xe73c;</div>");
		
		var num = 0;
		shopcarIcon.on("touchstart",function(){
			var users = getLocalSave();
			var id = $(this).attr("data-id");
			if(users){
				num++;
				var goods = setShopData(users,id,num);
				postShop(goods);
			}else{
				alert("请先登录")
			}
		});
		
		
		goodsMsg.append(goodsName);
		goodsMsg.append(goodsPrice);
		goodsMsg.append(goodsDiscount);
		goodsMsg.append(shopcarIcon);
		
		//整体放入商品栏
		goodsinfo.append(imgbox);
		goodsinfo.append(goodsMsg);
		goodslist.append(goodsinfo);
		
		$goods.append(goodslist);
	});
	
}
//<li class="search-item">
//	<span class="serch-item-name">茵曼 2015秋装新款文艺长袖格子衬</span><span class="serch-item-price">￥338</span>
//</li>
//渲染搜索商品
function setSelectData(data){
	var $searchlist = $('.search-list');
	$searchlist.empty();
	if(data == 0){
		var goodslist = $("<li class='search-item'>好像没有东西哎...</li>");
		$searchlist.append(goodslist);
	}else{
		$.each(data,function(index){
			var goodslist = $("<li class='search-item'>");
			var goodsName = $("<span class='serch-item-name'>"+data[index].goodsName+"</span>");
			//绑定点击事件
			goodslist.on("touchend",function(){
				window.location.href="detail.html?goodsID="+encodeURI(data[index].goodsID);
			});
			var goodsPrice = $("<span class='serch-item-price'>￥"+data[index].price+"</span>");
			
			goodslist.append(goodsName);
			goodslist.append(goodsPrice);
			$searchlist.append(goodslist);
		})	
	}
}
//更新购物车
function setShopData(users,goodsID,number){
	return data = {userID:users,goodsID:goodsID,number:number};
}
function postShop(data){
	$.ajax({
		type:"post",
		data:data,
		url:"http://datainfo.duapp.com/shopdata/updatecar.php",
		async:true,
		success:function(data){
			if(data==1){
				alert("操作成功");
			}else if(data==0){
				alert("操作失败");
			}else{
				alert("未知错误，状态码500")
			}
		}
	});
}
//读取购物车信息

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
//读取历史记录
function localSave(name){
	localStorage.setItem("users",encodeURI(name));
}
function getLocalSave(){
	var users = localStorage.getItem("users");
	users = decodeURI(users);
	users = eval(users);
	return users;
}
//获取banner图
var $banner = $('.swiper-wrapper');
function getBanner(){
	$.ajax({
		type:"get",
		url:"http://datainfo.duapp.com/shopdata/getBanner.php?callback=",
		async:true,
		success:function(data){
			data = eval(data);
			setBanner(data);
		}
	});
}
function setBanner(data){
	$.each(data, function(index) {
		var banner = eval(data[index].goodsBenUrl);
		var slide = $("<div class='swiper-slide'><img src='img/shopcar.jpg'/></div>")
		var banImg = $("<img src='"+banner[0]+"'/>");

		banImg.on("load",function(){
			slide.empty();
			slide.append(banImg);
			var mySwiper = new Swiper('.swiper-container', {
				autoplay: 2000,//可选选项，自动滑动
				pagination : '.swiper-pagination',
				loop : true,
			})
		})
		$banner.append(slide);
	});
}
