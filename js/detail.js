//获取url中的数据
function getQueryString(name){
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	
	if(r!=null){
		return decodeURI(r[2]);
	}
	return null;
}
$(function(){
	var goodsID = getQueryString("goodsID");
	//获取商品
	getData(goodsID);
	//选项卡控制
	var iWidth = $(window).width();
	control(iWidth);
})
//获取数据
function getData(goodsID){
	$.ajax({
		type:"get",
		data:{goodsID:goodsID},
		url:"http://datainfo.duapp.com/shopdata/getGoods.php?callback=",
		async:true,
		success:function(data){
			data = eval(data)[0];
			setData(data,function(){
				//加载滚动条
				loadScroll();
				//加载轮播图
				loadSwiper();
			});
		}
	});
}
//渲染数据
var $goodsCon = $('.X_container');

function setData(data,fn){
	var oIntr = $('.intr');
	var oInfo = $('.main');
	var oPhoto = $('.swiper-wrapper');
	
	var time = timerMaker(data.discountTime);
	var goodsListImg = data.goodsListImg; //第一页的图片
	var price = data.price;//价钱
	var goodsName = data.goodsName; //第一页的简单描述
	goodsName = goodsName.substr(0,10) + '..';
	var discount = data.discount;//折扣
	var lastPrice = discount == 0? "暂无优惠" : parseInt(price*discount);
	var buyers = data.buynumber;
	var details = data.detail; //第二页的描述细节
	var img2 = data.goodsBenUrl; //第二页图片
	img2 = eval(img2);
	
	var imgsUrl = data.imgsUrl;//第三页图片
	imgsUrl = eval(imgsUrl);
	
	var oImgBox = $("<div class='imgbox'><img src='img/wait.gif'/></div>");
	var oPic = $("<img src='"+goodsListImg+"'/>");
	oPic.on("load",function(){
		oImgBox.empty();
		oImgBox.append(oPic);
	})
	var oMaiTxt = $("<div class='main-txt'><span class='price'>￥"+price+"</span><span>"+goodsName+"</span></div>");
	var oMaiInfo = $("<div class='main-info'><span>市场价：</span><span class='last-price'>"+lastPrice+"</span><span class='discount'>"+discount+"折</span><span class='buyers'>"+buyers+"人购买</span></div>");
	oIntr.append(oImgBox);
	oIntr.append(oMaiTxt);
	oIntr.append(oMaiInfo);
	
	var oPic2 = $("<li><img src='"+img2[0]+"' /></li>");
	var oPic3 = $("<li><img src='"+img2[1]+"' /></li>");
	var oPic4 = $("<li><img src='"+img2[2]+"' /></li>");
	var oDetail = $("<li><p>"+details+"</p></li>");
	
	$.each(img2, function(index) {
		var oPic = $("<li><img src='img/wait.gif'/></li>");
		var oImg = $("<img src='"+img2[index]+"' />");
		oImg.on("load",function(){
			oPic.empty();
			oPic.append(oImg);
			//加载滚动条
			myScroll.refresh();
		})
		if(index == 1){
			oInfo.append(oDetail);
			oInfo.append(oPic);
		}else{
			oInfo.append(oPic);
		}
	});
	
	$.each(imgsUrl, function(index) {
		var oImgUrL = $("<div class='swiper-slide'><img src='"+imgsUrl[index]+"' /></div>");
		oPhoto.append(oImgUrL);
	});
	
	fn&&fn();
}

//时间改造器
function timerMaker(times){
	var iTimer = null;
	if(times==null || times ==0){
		$(".header").hide();
		clearTimeout(iTimer);
	}else{
		$('.time').text(times);
		iTimer = setTimeout(function(){
			times -=1000;
			timerMaker(times);
		},1000)	
	}
}
//选项卡切换
function control(iWidth){
	$('footer span').on("touchstart",function(){
		$(this).addClass("active").siblings().removeClass("active");
		var iIndex = $(this).index();
		$goodsCon.css("transform","translateX("+-iWidth*iIndex+"px)");
	})
}
var mySwiper;
var myScroll;
//滚动
function loadScroll(){
	myScroll = new IScroll(".con",{
		mouseWheel:true,
		preventDefault: false,
	})
}
//轮播图
function loadSwiper(){
    mySwiper = new Swiper('.swiper-container', {
		
	})
}
