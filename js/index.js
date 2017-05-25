var mySwiper = new Swiper('.swiper-container', {
	pagination : '.swiper-pagination', //生成分页符
	preventClicks : false,//默认true
	//初始化
	onInit : function(swiper){
		//关闭所有动画
		swiperAnimateCache(swiper);
		//开启动画
		swiperAnimate(swiper);
	},
	//监听滚动结束
	onSlideChangeEnd : function(swiper){
		swiperAnimate(swiper);
	}
})
