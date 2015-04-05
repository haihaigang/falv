<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="../com/meta.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/content/css/user.css" />
</head>
<body>
<noscript>
    <div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
</noscript>

<header class="header">
    <a href="my-info" class="icon icon_return"></a>
    <h1>修改密钥</h1>
    <a href="#" class="icon icon_confirm"></a>
</header>

<section class="container mypassword">
    <form id="password-form" action="#">
    	<input type="hidden" name="uid" />
    	<div class="items">
    		<span class="key phone">原始密钥</span>
            <div class="val"><input type="password" name="oldpassword" maxlength="16" placeholder="请输入爷的原始密钥" /></div>
        </div>
    	<div class="items">
    		<span class="key phone">新密钥</span>
            <div class="val"><input type="password" name="password" maxlength="16" placeholder="请输入爷的新密钥" /></div>
        </div>
    	<div class="items">
    		<span class="key phone">重复新密钥</span>
            <div class="val"><input type="password" name="repassword" maxlength="16" placeholder="请重复爷的新密钥" /></div>
        </div>
    </form>
</section>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script>
(function(){
	$('input[name="uid"]').val(config.getId());
	
	$('.icon_confirm').click(function(e){
		e.preventDefault();
		
		var pForm = $('#password-form'),
		oldpassword = $('input[name="oldpassword"]').val(),
		password = $('input[name="password"]').val(),
		repassword = $('input[name="repassword"]').val();
		
		if(oldpassword.isEmpty()){
			Tools.showTip('爷的原始密钥不能为空',5000);
			return;
		}
		if(!oldpassword.isValidPwd()){
			Tools.showTip('爷的原始密钥格式不正确',5000);
			return;
		}
		if(password.isEmpty()){
			Tools.showTip('爷的新密钥不能为空',5000);
			return;
		}
		if(!password.isValidPwd()){
			Tools.showTip('爷的新密钥格式不正确',5000);
			return;
		}
		if(repassword.isEmpty()){
			Tools.showTip('爷的重复新密钥不能为空',5000);
			return;
		}
		if(!repassword.isValidPwd()){
			Tools.showTip('爷的重复新密钥错误',5000);
			return;
		}
		
		Ajax.submitForm({
			url: config.myPassword,
			data: pForm
		},function(data){
			if(data.code != 'OK'){
				if(data.message == '原始密码错误！'){
					Tools.showTip('爷，原始密钥不正确',5000);
					return;
				}
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			Tools.showTip('爷，密钥已修改成功啦~',5000,function(){
				location.href="my-info";
			});
		});
	});
})();
</script>
</body>
</html>