(function(){
	var step1 = $('#step1'),
		step2 = $('#step2'),
		step3 = $('#step3'),
		step4 = $('#step4'),
		phoneNum,//记录手机号
		oriCode,//记录验证码
		inte,//计时器
		phoneDom = $('input[name="id"]');

	//手机号回填
	$('input[name="id"]').val(Tools.getQueryValue('phone'));

	//重发验证码
	$('#repeat-send').click(function(e){
		e.preventDefault();

		if(phoneDom.val().isEmpty()){
			Tools.showAlert('手机号不能为空',5000);
			return;
		}
		if(!phoneDom.val().isPhone()){
			Tools.showAlert('手机号格式不正确！',5000);
			return;
		}

		phoneNum = phoneDom.val();
		
		if($(this).hasClass('ready')){
			sendSms();
		}
		
	});
	
	//提交表单
	$('#register-form').submit(function(e){
		e.preventDefault();
		
		var phone = $('input[name="id"]').val(),
			code = $('input[name="code"]').val(),
			password = $('input[name="password"]').val(),
			password1 = $('input[name="password1"]').val();
		
		if(phone.isEmpty()){
			Tools.showAlert("手机号不能为空",5000);
			return;
		}
		if(!phone.isPhone()){
			Tools.showTip('手机号格式不正确',5000);
			return;
		}
		if(code.isEmpty()){
			Tools.showAlert("验证码不能为空",5000);
			return;
		}
		if(password.isEmpty()){
			Tools.showAlert("密码不能为空",5000);
			return;	
		}
		if(!password.isValidPwd()){
			Tools.showAlert("密码格式不正确",5000);
			return;	
		}
		if(password1.isEmpty()){
			Tools.showTip('确认密码不能为空',5000);
			return;
		}
		if(password != password1){
			Tools.showAlert("确认密码不一致",5000);
			return;
		}

		Ajax.submit({
			url: config.api_reg_app,
			data: $(this),
			type: 'POST'
		}, function(data){
			if(data.error){
				Tools.showAlert(data.error.message,5000);
				return;
			}

			Cookie.set(Storage.AUTH,data.data._id);
			Storage.set(Storage.AUTH, data.data._id, true);
			Storage.set(Storage.ACCOUNT,data.data);
			var from = Tools.getQueryValue('from');
			if(from){
				location.href = decodeURIComponent(from);
			}else{
				location.href = "reg-sus.html";
			}
		});
	});
	
	//发送短信验证码
	function sendSms(phone){
		var btnSend = $('#repeat-send'),
			duration = 60;//重发计时
			
		btnSend.removeClass('ready').text('发送中···');

		//重复发送，重置数据
		$('input[name="code"]').val('');
		oriCode = undefined;
		if(inte){
			clearInterval(inte);
		}
		
		Ajax.custom({
			url: config.api_reg_resendSMS,
			data: {
				reguid: phone || phoneNum,
				actionKbn: 'reg'
			},
			type: 'POST'
		}, function(data){
			if(data.error){
				Tools.showAlert(data.error.message,5000);
				btnSend.addClass('ready').text('获取验证码');
				return
			}
			
			//返回数据
			// _id: "5531ccacbad489afcc4a41d8"
			// code: "670652"
			// createAt: "2015-04-18T03:17:00.095Z"
			// uid: "13641882176"
			// updateAt: "2015-04-18T03:17:00.095Z"
			// valid: 1
			oriCode = data.data.code;
			
			//60秒计时重发
			inte = setInterval(function(){
				duration--;
				if(duration == 0){
					clearInterval(inte);
					//oriCode = undefined;
					btnSend.addClass('ready').text('重发验证码');
					return;
				}
				btnSend.text('还剩' + duration + '秒');
			},1000);
			
			//测试时直接填入验证码，需删除
			//$('input[name="code"]').val(oriCode);
		},function(){
			Tools.showAlert('验证码发送失败，请再点击发送',5000);
			btnSend.addClass('ready').text('重发验证码');
		});
	}
	
	//校验短信验证码
	function checkCode(code){
		Ajax.queryRecord({
			url: config.sendSms,
			data: {
				phone: phone
			}
		}, function(data){
			
		});
	}
	
	//获取角色数据
	function getRoleData(){
		if($('#role-list').html() != ''){
			//若获取过角色数据则返回
			return;
		}
		Ajax.queryRecord({
			url: config.roleList
		}, function(data){
			if(data.code != 'OK'){
				Tools.showAlert('服务器异常，请稍后再试～',5000);
				return;
			}
			var result = template.render('role-list-tmpl', {list: data.result});
			$('#role-list').html(result);
		});
	}
	
	//验证手机号是否已注册
	function checkPhone(phone, callback, callbackdone){
		
		Ajax.queryRecord({
			url: config.api_reg_resendSMS,
			data: {
				reguid: phone
			}
		}, function(data){
			if(data.code != 'OK'){
				Tools.showAlert(config.tips.server,5000);
				return;
			}
			
			if(data.result){
				Tools.showAlert('手机号已注册',5000);
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