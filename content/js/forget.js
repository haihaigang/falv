(function(){

	var btnSend = $('#btn-send'),
		phone = $('input[name="phone"]'),
		code = $('input[name="code"]'),
		password = $('input[name="password"]'),
		repassword = $('input[name="repassword"]'),
		oriCode,//记录验证码
		phoneNum;//记录手机号码
	
	btnSend.on('click','a',function(e){
		e.preventDefault();
		
		if(phone.val().isEmpty()){
			Tools.showTip('爷的手机号码不能为空',5000);
			return;
		}
		if(!phone.val().isPhone()){
			Tools.showTip('爷的手机号码不正确！',5000);
			return;
		}
		
		if(btnSend.hasClass('ready')){
			
			checkPhone(phone.val(),function(){
				sendSms();
			});
		}
	});
		
	//提交
	$('#forget-form').submit(function(e){
		e.preventDefault();
		
		if(phone.val().isEmpty()){
			Tools.showTip('爷的手机号码不能为空',5000);
			return;
		}
		if(!phone.val().isPhone()){
			Tools.showTip('爷的手机号码格式不正确',5000);
			return;
		}
		if(code.val().isEmpty()){
			Tools.showTip('爷的验证码不能为空',5000);
			return;
		}
		if(oriCode != code.val()){
			Tools.showTip('爷的验证码错误',5000);
			return;
		}
		if(password.val().isEmpty()){
			Tools.showTip('爷的密码不能为空',5000);
			return;
		}
		if(!password.val().isValidPwd()){
			Tools.showTip('爷的密码格式不正确',5000);
			return;
		}
		if(repassword.val().isEmpty()){
			Tools.showTip('爷的确认密码不能为空',5000);
			return;
		}
		if(repassword.val() != password.val()){
			Tools.showTip('爷的确认密码错误',5000);
			return;
		}
		
		Ajax.submitForm({
			url: config.forget,
			data: $(this)
		},function(data){
			if(data.code != 'OK'){
				if(data.message == '验证码不正确！'){
					Tools.showTip('爷的验证码不正确！',5000);
					return;
				}
				if(data.message == '账号不存在！'){
					Tools.showTip('爷的手机号还未注册',5000);
					return;
				}
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			
			Tools.showTip('爷的密码重置成功！',5000, function(){
				location.href = 'login';
			});
		});
	});
	
	//发送短信验证码
	function sendSms(){
		var duration = 60,//重发计时
			inte;//计时器
		
		btnSend.removeClass('ready').html('<span>发送中···</span>');
		
		
		Ajax.queryRecord({
			url: config.sendSms,
			data: {
				phone: phone.val()
			}
		}, function(data){
			if(data.code != 'OK'){
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			//格式：{13641882170:123456}
			for(var i in data.result){
				oriCode = data.result[i];
			}
			
			//60秒计时重发
			inte = setInterval(function(){
				duration--;
				if(duration == 0){
					clearInterval(inte);
					//oriCode = undefined;
					btnSend.addClass('ready').html('<a href="#">获取验证码</a>');
					return;
				}
				btnSend.html('<span>重新发送(' + duration + ')</span>');
			},1000);

			//测试时直接填入验证码，需删除
			//code.val(oriCode);
			
		},function(){
		},function(){
			Tools.showTip('爷，验证码发送失败，请再点击发送',5000);
			btnSend.addClass('ready').html('<a href="#">获取验证码</a>');
		});
	}
	
	//验证手机号是否已注册
	function checkPhone(phone, callback, callbackdone){
		
		Ajax.queryRecord({
			url: config.checkPhone,
			data: {
				phone: phone
			}
		}, function(data){
			if(data.code != 'OK'){
				Tools.showTip(config.tips.server,5000);
				return;
			}
			
			if(!data.result){
				Tools.showTip('爷的手机号还未注册',5000);
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