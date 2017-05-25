$(function(){
	$('#username').on("input",function(){
		var sTxt = $(this).val();
		var result = testStr(sTxt);
		$(this).val(result);
	})
	$('#psw').on("change",function(){
		var sPsw = $(this).val();
		var result = testpsw(sPsw);
		if(!result){
			$(this).siblings().css("display","block");
		}else{
			$(this).siblings().css("display","none");
		}
	})
	$('#repsw').on("change",function(){
		var sPsw = $('#psw').val();
		var sRePsw = $(this).val();
		if(sRePsw != sPsw){
			$(this).siblings().css("display","block");
		}else{
			$(this).siblings().css("display","none");
		}
	})
	
	$('#accept').on("touchend",function(){
		_register();
	})
	
	$('.close').on("touchend",function(){
		$('.tips').hide();
		$(".shadow").hide();
	})
})

function testStr(str) {
	var str=str.replace(/<\/?[^>]*>/gim,"");//去掉所有的html标记
	var str=str.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
	var str=str.replace(/\s/g,"");//去除文章中间空格
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\s+]") //特殊字符
	var rs = ""; 
	for (var i = 0; i < str.length; i++) { 
		rs = rs+str.substr(i, 1).replace(pattern, ''); 
	} 
	return rs; 
} 
function testpsw(str){
	if(str.length !=0){
		var pattern = /^[a-zA-Z0-9_]+$/; //数字字母
		var result = pattern.test(str);
		return result;
	}
}

function _register(){
	var username = $('#username').val();
	var psd = $("#psw").val();
	var repsd = $("#repsw").val();
	if(username == ""){
		$("#tips-con").text("请输入姓名");
		$(".tips").show();
		$(".shadow").show();
	}else{
		if(psd == ''){
			$("#tips-con").text("请输入密码");
			$(".tips").show();
			$(".shadow").show();
		}else{
		  if(psd == repsd){
		  	  var user = getUser(username,psd)
		  	  getRegData(user)
		  }else{
		  	$("#tips-con").text("亲,密码不一致");
			$(".tips").show();
			$(".shadow").show();
		  }
			
		}
	}
}
function getUser(name,psd){
	 var user = {
	 	userID:name,
	 	password:psd
	 }
	 return user
}
function getRegData(user){
	//请求接口
 	$.ajax({
 		type:"post",
 		url:"http://datainfo.duapp.com/shopdata/userinfo.php",
 		async:true,
 		data:{status:'register',userID:user.userID,password:user.password},
 		success:function(data){
 			if(data == 0){
 				$("#tips-con").text("亲,账号已有");
				$(".tips").show();
				$(".shadow").show();
 			}else if(data ==1){
 				localSave(user.userID);
 				$("#tips-con").text("注册成功");
				$(".tips").show();
				$(".shadow").show();
 			}else{
 				$("#tips-con").text("未知错误，500");
				$(".tips").show();
				$(".shadow").show();
 			}
 		}
 	});
}
function localSave(name){
	localStorage.setItem("users",JSON.stringify(name));
}
