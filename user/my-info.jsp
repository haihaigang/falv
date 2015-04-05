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
    <a href="index" class="icon icon_return"></a>
    <h1>爷的资料</h1>
</header>

<section class="container ulist myinfo">
    <div class="box">
        <a href="my-info-modify?type=name">
            <span>真实姓名</span>
            <em id="real-name">--</em>
            <i>&nbsp;</i>
        </a>
        <a href="javascript:void(0)" class="disabled">
            <span>手机号</span>
            <em id="phone">--</em>
            <i>&nbsp;</i>
        </a>
        <a href="my-info-modify?type=weixin">
            <span>微信昵称</span>
            <em id="wechat-nickname">--</em>
            <i>&nbsp;</i>
        </a>
        <a href="my-info-modify?type=sex">
            <span class="i3">性别</span>
            <em id="gender">--</em>
            <i>&nbsp;</i>
        </a>
        <a href="my-info-modify?type=birthday">
            <span class="i3">生辰</span>
            <em id="birthday">--</em>
            <i>&nbsp;</i>
        </a>
        <a href="my-info-modify?type=address">
            <span class="i3">爷的家</span>
            <em id="family">--</em>
            <i>&nbsp;</i>
        </a>
    </div>
    <div class="box address">
        <a href="my-address">
            <span class="i4">收礼地址</span>
            <i>&nbsp;</i>
        </a>
        <ul>
            <li>
                <span id="btn-logout">收礼人：</span>
                <div id="gift-name">--</div>
            </li>
            <li>
                <span>手机号：</span>
                <div id="gift-phone">--</div>
            </li>
            <li>
                <span>地址：</span>
                <div id="gift-address">--</div>
            </li>
        </ul>
    </div>
    <div class="box">
        <a href="my-info-modify?type=mail">
            <span class="i7">邮箱</span>
            <em id="email">--</em>
            <i>&nbsp;</i>
        </a>
        <a href="my-info-modify?type=weibo">
            <span class="i7" id="weibo-type">微博昵称</span>
            <em id="weibo-nickname">--</em>
            <i>&nbsp;</i>
        </a>
    </div>
</section>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script>
(function(){
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
		if(data.result.gender == '男'){
			$('#gender').addClass('male').removeClass('female');
		}else if(data.result.gender == '女'){
			$('#gender').addClass('female').removeClass('male');
		}
		$('#phone').text(data.result.phone);
		$('#real-name').text(data.result.realName);
		$('#gender').text(data.result.gender || '--');
		$('#birthday').text(data.result.birthday || '--');
		$('#family').text(data.result.familyStructure || '--');
		$('#email').text(data.result.email || '--');
		$('#wechat-nickname').text(data.result.wechatNickName || '--');
		$('#weibo-nickname').text(data.result.weiboNickName || '--');
		if(data.result.weiboType){
		var weiboType = "微博昵称";
			switch(data.result.weiboType){
			case 'SINA':
				weiboType = "新浪"+weiboType;
				break;
			case 'TENCENT':
				weiboType = "腾讯"+weiboType;
				break;
			case 'NETEASE':
				weiboType = "网易"+weiboType;
				break;
			}
			$('#weibo-type').text(weiboType);
		}
		var privateInfo = data.result.privateInfo;
		if(privateInfo){
			//目前接口需转义引号
			privateInfo = privateInfo.replace(/&quot;/g,'"');
			var address = JSON.parse(privateInfo);
			$('#gift-name').text(address.name || '--');
			$('#gift-phone').text(address.phone || '--');
			$('#gift-address').text(address.province + address.city + address.area + ' ' + address.address || '--');
		}else{
			$('#gift-name').text(data.result.realName || '--');
			$('#gift-phone').text(data.result.phone || '--');
		}
	});
	
	//退出
	$('#btn-logout-').click(function(e){
		e.preventDefault();
		
		Cookie.remove(Storage.AUTH);
 		Storage.remove(Storage.AUTH);
		Storage.remove(Storage.ACCOUNT);
		location.href= '../index';
	});
})();
</script>
</body>
</html>