(function(){
	
	var type = location.search.getQueryValue('type'),
		tit = $('.header h1'),
		myForm = $('#my-form'),
		yearDom = $('#year');
	
	//初始化信息
	$('#'+type).css('display','block');
	if(type=="name"){
		tit.text("真实姓名");
	};
	if(type=="weixin"){
		tit.text("微信昵称");
	};
	if(type=="sex"){
		tit.text("性别");
	};
	if(type=="birthday"){
		tit.text("生辰");
	};
	if(type=="address"){
		tit.text("爷的家");
	};
	if(type=="mail"){
		tit.text("邮箱");
	};
	if(type=="weibo"){
		tit.text("微博昵称");
	};
	
	var date = new Date();
	var year = date.getFullYear();
	
	for(var i = 1970; i <= year; i++){
		var option = new Option(i);
		yearDom.append(option);
	}
	
	$('#year').change(function(){
		$('#year-text').text($(this).val() + '年');
	});
	$('#month').change(function(){
		$('#month-text').text($(this).val() + '月');
	});
	$('#day').change(function(){
		$('#day-text').text($(this).val() + '日');
	});
	
	//设置生辰
	function setBirthday(value){
		if(!value){
			return;
		}
		
		var arr = value.split('-');
		if(arr.length != 3){
			return;
		}
		
		$('#birthday').find('input[type="hidden"]').val(value);
		
		$('#year').val(arr[0]);
		$('#year-text').text(arr[0]+'年');
		$('#month').val(arr[1]);
		$('#month-text').text(arr[1]+'月');
		$('#day').val(arr[2]);
		$('#day-text').text(arr[2]+'日');
	}
	
	//获取生辰
	function getBirthday(){
		var y = $('#year').val();
		var m =$('#month').val();
		var d = $('#day').val();
		
		if(!y || !m || !d){
			return;
		}
		var v = y +'-'+ m +'-'+ d;

		$('#birthday').find('input[type="hidden"]').val(v);
	}
	
	//自定义下拉框点击
	$('.wu_select').click(function(e){
		e.preventDefault();
		
		$(this).parent().find('.wu_select').removeClass('active');
		$(this).addClass('active');
		$(this).parent().find('input[type="hidden"]').val($(this).attr('data-v'));
	});
	
	
	//查询详细
	Ajax.queryRecord({
		url: config.myInfo,
		data: {
			uid: config.getId()
		}
	}, function(data){
		if(data.code != 'OK'){
			Tools.showTip('爷，服务器异常，请稍后再试～',5000);
			return;
		}
		$('input[type="submit"]').removeAttr('disabled');
		$('#hidden-id').val(data.result.id);
		$('#real-name').val(data.result.realName);
		setWuSelect('#gender',data.result.gender);
		setBirthday(data.result.birthday);
		$('#family').val(data.result.familyStructure);
		setWuSelect('#family',data.result.familyStructure);
		setEmail(data.result.email);
		$('#wechat-nickname').val(data.result.wechatNickName);
		setWuSelect('#weibo-type',data.result.weiboType);
		$('#weibo-nickname').val(data.result.weiboNickName);
	});
	
	//自定义下拉框赋值
	function setWuSelect(container,value){
		$(container).find('input[type="hidden"]').val(value);
		$(container).find('a').each(function(){
			if($(this).attr('data-v') == value){
				$(this).addClass('active');
			}
		});
	}
	
	function setEmail(value){
		if(!value){
			return;
		}
		
		var arr = value.split('@');
		if(arr.length != 2){
			return
		}
			
		$('#email-f').val(arr[0]);
		$('#email-l').val(arr[1]);
		$('#email').find('input[type="hidden"]').val(value);
	}
	
	function getEmail(){
		var v = $('#email-f').val() + '@' + $('#email-l').val();
		if(v == '@'){
			return '';
		}
		$('#email').find('input[type="hidden"]').val(v);
		return v;
	}
	
	//点击确定提交
	$('.icon_confirm').click(function(e){
		e.preventDefault();
		
		getBirthday();
		
		var email = getEmail();
		
		if(!email.isEmpty() && !email.isValidMail()){
			Tools.showTip('爷的邮箱格式不正确',5000);
			return;
		}

		Ajax.submitForm({
			url: config.myInfo,
			data: myForm
		},function(data){
			if(data.code != 'OK'){
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}

			Storage.set(Storage.ACCOUNT, data.result);
			location.href = 'my-info';
		});
	});
})();