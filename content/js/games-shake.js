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

	var ratio = 640 / $('.games_shake').width();//界面默认宽：容器宽
	var opts = [//游戏元素参数
		{s:'.games_title', w:369, h:69, t:329,l: 137},
		{s:'.games_content', w:379, h:251, t:709, l:130},
		{s:'.games_button', w:336, h:90, t:431, l:151},
		{s:'.games_content_shadow', w:394, h:173, t:787, l:123}
	];
	var imgs = [
		'../../content/images/shake/box_empty.png',
		'../../content/images/shake/box_full.png',
		'../../content/images/shake/box_shadow.png'
	];

	//初始化游戏界面
	for (var i = 0; i <= opts.length; i++) {
		var o = opts[i];
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
	    window.scrollTo(0, 0);
	    document.body.style.minHeight = window.innerHeight + 'px';
	}, 50);

	var content = $('.games_content'),
		shadow = $('.games_content_shadow'),
		harmmer = $('.games_harmmer'),
		title = $('.games_title'),
		btnStart = $('.games_start'),
		btnRestart = $('.games_restart');
	var cur = $('.games_container').offset();
	var last = {};
	var result;//游戏数据
	
	getGameInfo();

	// 请求摇一摇游戏数据
	function getGameInfo(restart){
		
		Ajax.queryRecord({
			url : config.shakeProcess
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

	//开始按钮
	btnStart.click(function(){
		start();
	});
	
	//重玩
	$('#game-btn-reset').click(function(e) {
		e.preventDefault();

		content.removeClass('empty full');
		title.show();
		btnStart.show();
		result = undefined;
		hideMsg();
		getGameInfo(false);
	});
	
//	$('#game-panel-bg').click(function(){
//		hideMsg();
//	});
	
	//开始游戏
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
		shadow.show();
		ani();
	}

	//游戏开始后的动画效果
	function ani(){
		var arr = ['status1','status2','status3']
		var index = 1,count = 0;
		last.top = parseInt(content.css('top'));
		content.addClass('ing');
		content.animate({
			top:368/ratio
		},50,'swing',function(){
			var inte = setInterval(function(){
				content.removeClass('status1 status2 status3').addClass('status'+index);
				index++;
				count++;
				if(index > 3){
					index = 1;
				}
				if(count > 7){
					clearInterval(inte);
					shadow.hide();
					content.removeClass('status1 status2 status3');
					content.removeClass('ing');
					content.css({top: last.top}).addClass(result.winner ? 'full' : 'empty');
					
					record();
					showMsg(result.winner ? result.winInfo : result.thanksInfo, result.winner ? result.awardName : false);
				}
			},40);

		});
	}

	// 记录游戏数据
	function record(){
		Ajax.queryRecord({
			url : config.shakeWinner,
			data : {
				awardId : result.awardId,
				winner : result.winner
			}
		});
		
	}
	
	function showMsg(content, awardName) {
		content = content && content.replace(/\r\n/gi, '<br/>');

		$('#game-panel-bg').show();
		msgpanel.find('h2').text(!!awardName?'恭喜':'提示');
		msgpanel.find('p').html(content);
		if (!!awardName) {
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