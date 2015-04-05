(function(){
	var step1 = $('#step1'),
		step2 = $('#step2'),
		step3 = $('#step3'),
		step4 = $('#step4'),
		phoneNum,//记录手机号
		oriCode,//记录验证码
		inte;//计时器

	//手机号回填
	$('input[name="phone"]').val(location.search.getQueryValue('phone'));
	
	$('#btn-ok-1').click(function(e){
		e.preventDefault();
		
		var that = $(this);
		
		if(that.hasClass('disabled')){
			return;
		}
		
		var phone = $('input[name="phone"]').val();
		//验证号码
		if(phone.isEmpty()){
			Tools.showTip('爷的手机号码不能为空',5000);
			return;
		}
		if(!phone.isPhone()){
			Tools.showTip('爷的手机号码格式不正确',5000);
			return;
		}
		
		//号码已验证则忽略
		if((phoneNum && phoneNum == phone)){
			$('#phone').html(phone);
			$('#phone2').html(phone);
			
			step1.hide();
			step2.show();
		}else{
			that.addClass('disabled');
		
			checkPhone(phone,function(){
				
				sendSms(phone);
				
				$('#phone').html(phone);
				$('#phone2').html(phone);
				
				step1.hide();
				step2.show();	
			},function(){
				that.removeClass('disabled');
			});
		}
		
	});
	$('#btn-ok-2').click(function(e){
		e.preventDefault();

		var phone = $('input[name="phone"]').val();
		var code = $('input[name="code"]').val();
		//验证
		if(code.isEmpty()){
			Tools.showTip('爷的验证码不能为空',5000);
			return;
		}
		//校验短信验证码
		if(oriCode != code){
			Tools.showTip('爷的验证码不正确',5000);
			return;
		}
		
		step2.hide();
		step3.show();
	});
	$('#btn-ok-3').click(function(e){
		e.preventDefault();
		
		var password = $('input[name="password"]').val(),
			repassword = $('input[name="repassword"]').val();
		//验证
		if(password.isEmpty()){
			Tools.showTip('爷的密码不能为空',5000);
			return;
		}
		if(!password.isValidPwd()){
			Tools.showTip('爷的密码格式不正确',5000);
			return;
		}
		if(repassword.isEmpty()){
			Tools.showTip('爷的确认密码不能为空',5000);
			return;
		}
		if(password != repassword){
			Tools.showTip('爷的确认密码错误',5000);
			return;
		}
		
		step3.hide();
		step4.show();
		getRoleData();
	});
	$('#btn-no-2').click(function(e){
		e.preventDefault();
		step1.show();
		step2.hide();
	});
	$('#btn-no-3').click(function(e){
		e.preventDefault();
		step2.show();
		step3.hide();
	});
	
	//重发验证码
	$('#repeat-send').click(function(e){
		e.preventDefault();
		
		if($(this).hasClass('ready')){
			sendSms();
		}
		
	});
	
	//选择角色
	var hiddenRole = $('input[name="roleId"]');
	$('#role-list').on('click','li',function(e){
		e.preventDefault();
		
		$('#role-list li').removeClass('active');
		$(this).addClass('active');
		hiddenRole.val($(this).attr('data-id'));
	});
	
	//提交表单
	$('#register-form').submit(function(e){
		e.preventDefault();
		
		var username = $('input[name="realName"]').val(),
			role = $('input[name="roleId"]').val();
		
		if(username.isEmpty()){
			Tools.showTip("爷的姓名不能为空",5000);
			return;
		}
		if(role.isEmpty()){
			Tools.showTip("爷的角色不能为空",5000);
			return;
		}
		
		Ajax.submitForm({
			url: config.register,
			data: $(this)
		}, function(data){
			if(data.code != 'OK'){
				if(data.message == '验证码不正确！'){
					Tools.showTip('爷的验证码不正确！',5000);
					return;
				}
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			if(!data.result){
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			
			Cookie.set(Storage.AUTH,data.result.id);
			Storage.set(Storage.AUTH, data.result.id, true);
			Storage.set(Storage.ACCOUNT,data.result);
			var from = location.search.getQueryValue('from');
			if(from){
				location.href = decodeURIComponent(from);
			}else{
				location.href = "hui/index";
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
		
		Ajax.queryRecord({
			url: config.sendSms,
			data: {
				phone: phone || phoneNum
			}
		}, function(data){
			if(data.code != 'OK'){
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
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
					btnSend.addClass('ready').text('重发验证码');
					return;
				}
				btnSend.text('还剩' + duration + '秒');
			},1000);
			
			//测试时直接填入验证码，需删除
			//$('input[name="code"]').val(oriCode);
		},function(){
		},function(){
			Tools.showTip('爷，验证码发送失败，请再点击发送',5000);
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
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			var result = template.render('role-list-tmpl', {list: data.result});
			$('#role-list').html(result);
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
			
			if(data.result){
				Tools.showTip('爷的手机号已注册',5000);
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