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
    <a href="../index" class="icon icon_home"></a>
    <h1>爷的地盘</h1>
</header>
<section class="container nopadding2">
<section class="user_top">
    <a class="thumb" href="my-role"><img id="role-img" src="<%= request.getContextPath() %>/content/images/role/temp.png" alt="" /></a>
    <div class="names">
        <p><span>爷的角色：</span><em id="role-name">--</em></p>
        <p><span>真实姓名：</span><em id="real-name">--</em></p>
    </div>
</section>
<section class="ulist user" style="padding: .1rem;">
    <div class="box">
        <a href="my-info">
            <span class="i1">爷的资料</span>
            <em id="rate"></em>
            <i>&nbsp;</i>
        </a>
        <a href="my-activity">
            <span class="i2">爷的活动</span>
            <em class="num"></em>
            <i>&nbsp;</i>
        </a>
        <a href="my-gift">
            <span class="i3">爷的礼品</span>
            <i>&nbsp;</i>
        </a>
    </div>
    <div class="box">
        <a href="my-house">
            <span class="i4">爷的府邸</span>
            <i>&nbsp;</i>
        </a>
    </div>
    <div class="box">
        <a href="my-conversation">
            <span class="i7">爷的回忆</span>
            <i>&nbsp;</i>
        </a>
        <a href="my-password">
            <span class="i8">修改密钥</span>
            <i>&nbsp;</i>
        </a>
    </div>
</section>
</section>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script>
(function(){
	var account = Storage.get(Storage.ACCOUNT);
	
	if(account){
		$('#real-name').text(account.realName);
		$('#rate').text(countRate(account));
		
		getRoleInfo(account.roleId);
	}else{
		Ajax.queryRecord({
			url: config.myInfo,
			data: {
				uid: config.getId()
			}
		},function(data){
			if(data.code != 'OK'){
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			
			Storage.set(Storage.ACCOUNT,data.result);

			$('#real-name').text(data.result.realName);
			$('#rate').text(countRate(data.result));
			
			getRoleInfo(data.result.roleId);
		});
	}
	
	//查询角色
	function getRoleInfo(roleId){
		Ajax.queryRecord({
			url: config.myRole,
			data: {
				id: roleId
			}
		},function(data){
			if(data.code != 'OK'){
				Tools.showTip('爷，服务器异常，请稍后再试～',5000);
				return;
			}
			if(data.result){
				var url = data.result.picUrl;
				if(url.indexOf('http') != 0){
					url = config.image + url;
				}
				$('#role-img').attr('src', url);
				$('#role-name').text(data.result.roleName);
			}
		});
	}
	
	//计算信息完成度百分比
	function countRate(account){
		var has = 0;
		var total = 0;
		var keys = ['address','birthday','email','familyStructure',
				'gender','phone',
				'realName','roleId','wechatNickName','weiboNickName'];
		
		for(var i in account){
			if(keys.join(',').indexOf(i) >= 0){
				if(account[i]){
					has++;
				}
				total++;
			}
		}
		
		return Math.round(has/total*100) + '%';
	}
	
	
})();
</script>
</body>
</html>