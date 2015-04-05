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
    <h1>爷的资料</h1>
    <a href="javascript:void(0)" class="icon icon_confirm"></a>
</header>

<section class="container ulist myinfo_v">
	<form id="my-form" action="#" >
		<div id="name" class="items modify">
			<div class="val"><input id="real-name" type="text" name="realName" maxlength="50" /></div>
		</div>
		<div id="weixin" class="items modify">
			<div class="val"><input id="wechat-nickname" type="text" name="wechatNickName" maxlength="50" /></div>
		</div>
		<div id="sex" class="items modify">
			<div class="val">
				<div class="box" id="gender">
					<input type="hidden" name="gender" />
					<a href="#" class="wu_select" data-v="男"><span>男</span></a>
					<a href="#" class="wu_select" data-v="女"><span>女</span></a>
				</div>
			</div>
		</div>
		<div id="birthday" class="items modify">
			<div class="val">
				<div class="box" id="birthday">
					<input type="hidden" name="birthday" />
					<a href="javascript:void(0)"><span id="year-text">年</span>
						<select id="year">
							<option value="">请选择</option>
						</select>
					</a>
					<a href="javascript:void(0)"><span id="month-text">月</span>
						<select id="month">
							<option value="">请选择</option>
							<option value="01">01</option>
							<option value="02">02</option>
							<option value="03">03</option>
							<option value="04">04</option>
							<option value="05">05</option>
							<option value="06">06</option>
							<option value="07">07</option>
							<option value="08">08</option>
							<option value="09">09</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
						</select>
					</a>
					<a href="javascript:void(0)"><span id="day-text">日</span>
						<select id="day">
							<option value="">请选择</option>
							<option value="01">01</option>
							<option value="02">02</option>
							<option value="03">03</option>
							<option value="04">04</option>
							<option value="05">05</option>
							<option value="06">06</option>
							<option value="07">07</option>
							<option value="08">08</option>
							<option value="09">09</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
							<option value="13">13</option>
							<option value="14">14</option>
							<option value="15">15</option>
							<option value="16">16</option>
							<option value="17">17</option>
							<option value="18">18</option>
							<option value="19">19</option>
							<option value="20">20</option>
							<option value="21">21</option>
							<option value="22">22</option>
							<option value="23">23</option>
							<option value="24">24</option>
							<option value="25">25</option>
							<option value="26">26</option>
							<option value="27">27</option>
							<option value="28">28</option>
							<option value="29">29</option>
							<option value="30">30</option>
							<option value="31">31</option>
						</select>
					</a>
				</div>
			</div>
		</div>
		<div id="address" class="items modify">
			<div class="val">
				<div class="box" id="family">
					<input type="hidden" name="familyStructure" />
					<a href="#" class="wu_select" data-v="孤家寡人"><span>孤家寡人</span></a>
					<a href="#" class="wu_select" data-v="小两口"><span>小两口</span></a>
					<a href="#" class="wu_select" data-v="三口之家小太阳"><span>三口之家小太阳</span></a>
					<a href="#" class="wu_select" data-v="三口之家大太阳"><span>三口之家大太阳</span></a>
					<a href="#" class="wu_select" data-v="上有老下有小"><span>上有老下有小</span></a>
					<a href="#" class="wu_select" data-v="空巢"><span>空巢</span></a>
				</div>
			</div>
		</div>
		<div id="mail" class="items modify" style="border-bottom: none;">
			<div id="email" class="val">
				<div class="mailbefore" style="border-bottom: 1px solid #dedede"><input id="email-f" type="text" maxlength="100" /></div>
				<div class="mailmiddle">@</div>
				<div class="mailafter" style="border-bottom: 1px solid #dedede"><input id="email-l" type="text" maxlength="100" /></div>
				<input type="hidden" name="email" />
			</div>
		</div>
		<div id="weibo" class="modify" >
			<div class="items ">
				<div class="val">
					<div class="box" id="weibo-type" >
						<input type="hidden" name="weiboType" />
						<a href="#SINA" class="wu_select" data-v="SINA"><span>新浪</span></a>
						<a href="#TENCENT" class="wu_select" data-v="TENCENT"><span>腾讯</span></a>
						<a href="#NETEASE" class="wu_select" data-v="NETEASE"><span>网易</span></a>
					</div>
				</div>
			</div>
			<div class="items">
				<span class="key">微博昵称：</span>
				<div class="val"><input id="weibo-nickname" type="text" name="weiboNickName" maxlength="100" /></div>
			</div>
		</div>
	    <input id="hidden-id" type="hidden" name="id" />
	</form>
    
</section>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script src="<%=request.getContextPath()%>/content/js/my-info-modify.js"></script>
</body>
</html>