(function(){

	var btnSend = $('#repeat-send'),
		phone = $('input[name="id"]'),
		code = $('input[name="code"]'),
		password = $('input[name="password"]'),
		repassword = $('input[name="repassword"]'),
		oriCode,//记录验证码
		phoneNum;//记录手机号码
	
	btnSend.on('click',function(e){
		e.preventDefault();
		
		if(phone.val().isEmpty()){
			Tools.showAlert('手机号不能为空',5000);
			return;
		}
		if(!phone.val().isPhone()){
			Tools.showAlert('手机号格式不正确！',5000);
			return;
		}
		
		if(btnSend.hasClass('ready')){
			
				sendSms();
		}
	});
		
	//提交
	$('#forget-form').submit(function(e){
		e.preventDefault();
		
		if(phone.val().isEmpty()){
			Tools.showAlert('手机号不能为空',5000);
			return;
		}
		if(!phone.val().isPhone()){
			Tools.showAlert('手机号格式不正确',5000);
			return;
		}
		if(code.val().isEmpty()){
			Tools.showAlert('验证码不能为空',5000);
			return;
		}
		// if(oriCode != code.val()){
		// 	Tools.showAlert('验证码错误',5000);
		// 	return;
		// }
		if(password.val().isEmpty()){
			Tools.showAlert('密码不能为空',5000);
			return;
		}
		if(!password.val().isValidPwd()){
			Tools.showAlert('密码格式不正确',5000);
			return;
		}
		if(repassword.val().isEmpty()){
			Tools.showAlert('确认密码不能为空',5000);
			return;
		}
		if(repassword.val() != password.val()){
			Tools.showAlert('确认密码不一致',5000);
			return;
		}
		
		Ajax.submit({
			url: config.api_forget,
			data: $(this)
		},function(data){
			if(data.error){
				Tools.showAlert(data.error.message || '服务器异常，请稍后再试～',5000);
				return;
			}
			log(data)
			Tools.showAlert('密码重置成功！',5000, function(){
				Cookie.set(Storage.AUTH,data.data.id);
				Storage.set(Storage.AUTH, data.data.id);
				Storage.set(Storage.REMEMBER, data.data.id);
				Storage.set(Storage.ACCOUNT,data.data);
				location.href = "../user/index.html";
			});
		});
	});
	
	//发送短信验证码
	function sendSms(){
		var duration = 60,//重发计时
			inte;//计时器
		
		btnSend.removeClass('ready').html('<span>发送中···</span>');
		
		Ajax.custom({
			url: config.api_forget_resendSMS,
			data: {
				reguid: phone.val(),
				actionKbn: 'forget'
			},
			type: 'POST'
		}, function(data){
			if(data.error){
				Tools.showAlert(data.error.message || '服务器异常，请稍后再试～',5000);
				btnSend.addClass('ready').html('获取验证码');
				return;
			}

			oriCode = data.data.code;
			
			//60秒计时重发
			inte = setInterval(function(){
				duration--;
				if(duration == 0){
					clearInterval(inte);
					//oriCode = undefined;
					btnSend.addClass('ready').html('获取验证码');
					return;
				}
				btnSend.html('<span>重发(' + duration + ')</span>');
			},1000);

			//测试时直接填入验证码，需删除
			//code.val(oriCode);
			
		},function(){
			Tools.showAlert('验证码发送失败，请再点击发送',5000);
			btnSend.addClass('ready').html('获取验证码');
		});
	}
	
	//验证手机号是否已注册
	function checkPhone(phone, callback, callbackdone){
		
		Ajax.custom({
			url: config.api_forget_step1,
			data: {
				phone: phone
			}
		}, function(data){
			if(data.code != 'OK'){
				Tools.showAlert('服务器异常，请稍后再试～',5000);
				return;
			}
			
			if(!data.result){
				Tools.showAlert('手机号还未注册',5000);
				return;
			}
			
			phoneNum = phone;
			
			if(typeof callback == 'function'){
				callback();
			}
		},function(){
			if(typeof callbackdone == 'function'){
				callbackdone();
			}
		});
	}
})();