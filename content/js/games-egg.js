(function() {
	var msgpanel = $('#dzPanel');// 提示信息框
	var openId = location.search.getQueryValue('openId');
	var uid = config.getId();//当前登录用户
	
	//微信入口，记录openId
	if(openId){
		Cookie.set(Storage.OPENID, openId);
	}else{
		openId = Cookie.get(Storage.OPENID);
	}

	var ratio = 640 / $('.games_egg').width();//界面默认宽：容器宽
	var opts = [//游戏元素参数
		{s:'.games_title', w:451, h:104, t:300,l: 100},
		{s:'.games_content', w:550, h:450, t:508, l:80},
		{s:'.games_button', w:367, h:84, t:973, l:137},
		{s:'.games_egg_1', w:124, h:180, t:236, l:226},
		{s:'.games_egg_2', w:190, h:250, t:114, l:80},
		{s:'.games_egg_3', w:149, h:214, t:134, l:270},
		{s:'.games_harmmer', w:153, h:144, t:407, l:440},
		{s:'.games_content_shine', w:556, h:487, t:530, l:70}
	];
	var eggPos = [{t:744, l:306},{t:622, l:160},{t:642, l:350}];
	var imgs = [
		'../../content/images/egg/eggs_1.png',
		'../../content/images/egg/eggs_2.png',
		'../../content/images/egg/eggs_3.png',
		'../../content/images/egg/harmmer.png',
		'../../content/images/egg/shine_2.png'
	];
	var harmmerPos;
	
	//初始化游戏界面
	for (var i = 0; i < opts.length; i++) {
		var o = opts[i];
		if(o.s == '.games_harmmer'){
			harmmerPos  = o;
		}
		o && $(o.s).css({
			width: o.w / ratio,
			height: o.h / ratio,
			top: o.t / ratio,
			left: o.l /ratio
		});
	};

	//预加载图片
	img_preload(imgs);

	document.body.style.minHeight = window.innerHeight + 100 + 'px';
	setTimeout(function () {
	    window.scrollTo(0, 400);
	    document.body.style.minHeight = window.innerHeight + 'px';
	}, 200);
	document.addEventListener('touchmove', function(e) {
	    e.preventDefault();
	}, false);

	var content = $('.games_content'),
		shine = $('.games_content_shine'),
		harmmer = $('.games_harmmer'),
		title = $('.games_title'),
		btnStart = $('.games_start'),
		btnRestart = $('.games_restart');
	var cur = $('.games_container').offset();
	var last = {};
	var result ;//游戏数据
	var hasTouch = 'ontouchstart' in window,
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

	getGameInfo();
	
	// 请求砸金蛋游戏数据
	function getGameInfo(restart){

		Ajax.queryRecord({
			url : config.eggsProcess,
		}, function(data) {
			if (data.code != 'OK') {
				Tools.showTip("读取游戏信息失败，请刷新页面！", 5000);
				return;
			}
			result = data.result;

			if(restart){
				start();
			}
		});
	}

	//开始
	btnStart.click(function(){
		start();
	});

	//砸蛋
	$('.games_content div').click(function(){
		onHitting($(this).attr('data-idx'));
	});
		
	//重玩
	$('#game-btn-reset').click(function(e) {
		e.preventDefault();

		content.removeClass('award1 award2 award3');
		title.show();
		btnStart.show();
		result = undefined;
		hideMsg();
		resetHarmmer();
		getGameInfo(false);
	});
		
	// 开始游戏
	function start(){
		if(!result.canPlay){
			if(result.noCanMsg == 'onlyMember'){
				Tools.showTip('仅限会员参与',5000);
				return;	
			}
			Tools.showTip(result.noCanMsg,5000);
			return;
		}
		
		btnStart.hide();
		title.hide();
		harmmer.addClass('shaking').show();
		content.find('div').show();
	}

	//移动锤子
	function move(e){
		var point = hasTouch ? e.touches[0] : e;
		var top = point.pageY - cur.top - harmmer.height()*2/3,
			left = point.pageX - cur.left;

		last.top = top;
		last.left = left;
		harmmer.css({top:top, left:left});
	}
	
	//砸的动画
	function onHitting(idx){
		content.removeClass('award2').removeClass('award3').removeClass('award1');

		var t = eggPos[idx - 1].t / ratio - harmmer.width() / 3,
		l = eggPos[idx - 1].l / ratio + harmmer.height() / 3;
		
		harmmer.animate({
			top: t,
			left: l
		},150,'swing',function(){
			harmmer.removeClass('shaking').addClass('hitting');
			setTimeout(function(){
				onHitted(idx);
			},300)
		});
	}
	
	//砸的动画结束
	function onHitted(idx){
		harmmer.removeClass('hitting').hide();
		content.find('div').hide();
		content.addClass('award'+idx);
		shine.show();

		var abc = result['egg'+idx];
		if(abc){
			record(abc.awardId, abc.winner);
		}else{
			abc = {};
			abc.winner = false;
		}
		setTimeout(function(){
			showMsg(abc.winner ? result.winInfo : result.thanksInfo, abc.winner ? abc.awardName : false);
		},200);
	}
	
	//重置錘子位置
	function resetHarmmer(){
		if(harmmerPos){
			harmmer.css({
				top: harmmerPos.t / ratio,
				left: harmmerPos.l / ratio
			});
		}
	}

	// 记录游戏数据
	function record(awardId, winner){
		Ajax.queryRecord({
			url : config.eggsWinner,
			data : {
				awardId : awardId,
				winner : winner
			}
		});
	}
	
	function showMsg(content, awardName) {
		content = content && content.replace(/\r\n/gi, '<br/>');

		$('#game-panel-bg').show();
		msgpanel.find('h2').text(!!awardName?'恭喜':'提示');
		msgpanel.find('p').html(content);
		if (awardName) {
			var str = '获得了<span>' + awardName + '</span>';
			msgpanel.find('.pround').html(str).show();
			if(uid){
				$('#game-btn-gift').show();
				$('#game-btn-receive').hide();
			}else{
				$('#game-btn-gift').hide();
				$('#game-btn-receive').show();
			}
			$('#game-btn-reset').show();
		} else {
			msgpanel.find('.pround').hide();
			$('#game-btn-receive').hide();
			$('#game-btn-gift').hide();
			$('#game-btn-reset').show();
		}
		msgpanel.css('margin-top', -(msgpanel.height() / 2));
		msgpanel.show();
	}

	function hideMsg() {
		msgpanel.hide();
		$('#game-panel-bg').hide();
	}

	/*
	 * img preload @param img 要加载的图片数组 @param callback 图片加载成功后回调方法
	 */
	function img_preload(img, callback) {
		var onload_img = 0;
		var tmp_img = [];
		for (var i = 0, imgnum = img.length; i < imgnum; i++) {
			tmp_img[i] = new Image();
			tmp_img[i].src = img[i];
			if (tmp_img[i].complete) {
				onload_img++;
			} else {
				tmp_img[i].onload = function() {
					onload_img++;
				}
			}
		}
		var et = setInterval(function() {
			if (onload_img == img.length) { // 定时器,判断图片完全加载后调用callback
				clearInterval(et);
				callback && callback();
			}
		}, 200);
	}
})();