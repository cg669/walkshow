var users;
$(function(){
	users = getLocalSave();
	if(users){
		getUsersData(users);
	}else{
		alert("请先登录");
		setTimeout(function(){
			window.location.href = "login.html";
		},500)
	}
})
//滚动条

var myScroll = new IScroll(".S_container",{
	mouseWheel:true,
	scrollbars: true,
	preventDefault: false
})


//获取用户信息
function getUsersData(users){
	$.ajax({
		type:"get",
		url:"http://datainfo.duapp.com/shopdata/getCar.php?callback=",
		data:{userID:users},
		async:true,
		success:function(data){
			data = eval(data);
			$('.goods').empty();
			console.log(data);
			setData(data);
		}
	});
}
var $goods = $('.goods');
function setData(data){
	if(data==0){
		$('.tips').show();
	}else{
		$('tips').hide();
		var totalNum =0;
		var totalMoney = 0;
		$.each(data, function(index) {
			var $dl = $("<dl></dl>");
			var imgBox = $("<dt><img src='img/shopcar.jpg' /></dt>")
			var loadImg = $("<img src='"+data[index].goodsListImg+"'/>")
			loadImg.on("load",function(){
				imgBox.empty();
				imgBox.append(loadImg);
			})
			var txtBox = $("<dd></dd>");
			var goodsName = data[index].goodsName.substr(0,20);
			var goodsTxt = $("<p>"+goodsName+"..</p>");
			var goodsPrice = $("<p>单价:<span class='price'>￥"+data[index].price+"</span></p>");
			var goodsNum = $("<p class='goods-num'  data-num="+data[index].number+" data-id="+data[index].goodsID+">数量：<span class='mius'>-</span><i class='num'>"+data[index].number+"</i><span class='add'>+</span></p>");
			
			txtBox.append(goodsTxt);
			txtBox.append(goodsPrice);
			txtBox.append(goodsNum);
			
			$dl.append(imgBox);
			$dl.append(txtBox);
			
			$goods.append($dl);
			myScroll.refresh();
			totalNum += parseInt(data[index].number);
			totalMoney += parseInt(data[index].number) * parseInt(data[index].price);
			
		});	
		$('.mius').on('touchstart',function(){
			var num = $(this).parent('.goods-num').attr("data-num");
			num--;
			$(this).parent('.goods-num').attr("data-num",num);
			var goodsID = $(this).parent('.goods-num').attr("data-id");
			var goodsNum = $(this).parent('.goods-num').attr("data-num");
		
			var data = setShopData(users,goodsID,goodsNum);
			postShop(data);
			getUsersData(users);
		})
		$('.add').on('touchstart',function(){
			var num = $(this).parent('.goods-num').attr("data-num");
			num++;
			$(this).parent('.goods-num').attr("data-num",num);
			var goodsID = $(this).parent('.goods-num').attr("data-id");
			var goodsNum = $(this).parent('.goods-num').attr("data-num");
			
			var data = setShopData(users,goodsID,goodsNum);
			postShop(data);
			getUsersData(users);
		})
		$(".totalNum").text(totalNum);
		$(".totalMoney").text(totalMoney);
	}
}
//改变用户信息
function changeData(req){
	$.ajax({
		type:"post",
		data:req,
		url:"http://datainfo.duapp.com/shopdata/updatecar.php",
		async:true,
		success:function(res){
			req = parseInt(res);
			if(res ==1){
				alert("操作成功");
			}else{
				alert("未知错误，导致无法删除或添加商品");
			}
		}
	});
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