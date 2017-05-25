$(function(){
	var users = getLocalSave();
	if(users){
		getUsersData(users);
		$('.links').css("display","none");
	}else{
		$('.links').css("display","block");
	}
})



//获取用户信息
function getUsersData(users){
	$.ajax({
		type:"get",
		url:"http://datainfo.duapp.com/shopdata/getuser.php?callback=",
		data:{userID:users},
		async:true,
		success:function(data){
			data = eval(data);
			if(data){
				setData(data);
			}
		}
	});
}
//改变样式 
function setData(data){
	var userImg = data[0].userimg_url;
	var userId = data[0].userID;
	$('.nikiname').text(userId);
	$('.user-pic').src = userImg;
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