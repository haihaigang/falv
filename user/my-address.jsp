<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<jsp:include page="../com/meta.jsp"></jsp:include>
	<link rel="Stylesheet" href="<%=request.getContextPath()%>/content/css/mobiscroll-2.3.1.full.min.css" />
    <link rel="stylesheet" href="<%=request.getContextPath()%>/content/css/user.css" />
</head>
<body>
<noscript>
    <div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
</noscript>

<header class="header">
    <a href="my-info" class="icon icon_return"></a>
    <h1>收礼地址</h1>
    <a href="#" class="icon icon_confirm"></a>
</header>

<section class="container myaddress">
    <form id="address-form" action="#" method="get">
        <div class="items">
            <span class="key">收礼人</span>
            <div class="val"><input type="text" name="name" maxlength="50" placeholder="请输入收礼物人姓名" /></div>
        </div>
        <div class="items">
            <span class="key">联系手机</span>
            <div class="val"><input type="text" name="phone" maxlength="11" placeholder="请输入收礼人手机号码" /></div>
        </div>
        <div class="items">
            <span class="key">地区信息</span>
            <div class="val" id="address1">
            	<select style="display: none;"></select>
            	<select style="display: none;"></select>
            	<select style="display: none;"></select>
            	<input type="hidden" name="province" />
            	<input type="hidden" name="city" />
            	<input type="hidden" name="area" />
            	<span id="province">请选择</span>
            	<span id="city">请选择</span>
            	<span id="area">请选择</span>
            </div>
        </div>
        <div class="items">
            <span class="key">收礼地址</span>
            <div class="val"><input type="text" name="address" maxlength="100" placeholder="请输入收礼人详细地址" /></div>
        </div>
        <div class="items">
            <span class="key">邮政编码</span>
            <div class="val"><input type="text" name="postcode" maxlength="6" placeholder="请输入邮政编码" /></div>
        </div>
        <input type="hidden" name="privateInfo" />
    </form>
</section>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script src="<%=request.getContextPath()%>/content/js/address.js"></script>
<script src="<%=request.getContextPath()%>/content/js/mobiscroll-2.3.1.full.min.js"></script>
<script src="<%=request.getContextPath()%>/content/js/my-address.js"></script>
</body>
</html>