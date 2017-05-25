var bBtn = true;
$(function(){
	var users = getLocalSave();
	$('#username').val(users);
	
	$(".setradio").on("touchend",function(){
		$('#checkPic').toggleClass('checked');
	})
	
	
	
	
	
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
	
	$('#accept').on("touchend",function(){
		bBtn = $('#checkPic').hasClass('checked');
		_login();
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

function _login(){
	var username = $('#username').val();
	var psd = $('#psw').val();
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
		  	  var user = getUser(username,psd);
		  	  getLogData(user);
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
function getLogData(user){
	//请求接口
 	$.ajax({
 		type:"post",
 		url:"http://datainfo.duapp.com/shopdata/userinfo.php",
 		async:true,
 		data:{status:'login',userID:user.userID,password:user.password},
 		success:function(data){
 			if(data == 0){
 				$("#tips-con").text("用户名有误");
				$(".tips").show();
				$(".shadow").show();
 			}else if(data ==2){
 				localSave(user.userID);
 				$("#tips-con").text("密码错误");
				$(".tips").show();
				$(".shadow").show();
 			}else{
 				if(bBtn){
 					localSave(user.userID);
 				}
   				window.location.href = "myshow.html";
 			}
 		}
 	});
}
function localSave(data){
	localStorage.setItem("users",JSON.stringify(data));
}
function getLocalSave(){
	var users = localStorage.getItem("users");
	return JSON.parse(users);
}
