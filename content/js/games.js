(function() {
	var msgpanel = $('#message');// 提示信息框
	var gameData = {};// 游戏数据
	var gameId;//当前游戏的编号
	var tempTodayCount = 0;// 临时记录游戏当天次数
	var tempTotalCount = 0;// 临时记录游戏总次数
	var openId = location.search.getQueryValue("openId");//微信openid
	var uid = config.getId();//当前登录用户
	
	//微信入口，记录openId
	if(openId){
		Cookie.set(Storage.OPENID, openId);
	}else{
		openId = Cookie.get(Storage.OPENID);
	}

	// 加载游戏数据
	Ajax.queryRecord({
		url : config.gameInfo,
		data : {
			id : location.search.getQueryValue('id'),
		}
	}, function(data) {
		if (data.code != 'OK') {
			Tools.showTip('爷，当前游戏只能通过微信访问', 5000);
			return;
		}

		if (!data.result) {
			Tools.showTip('爷，还没有游戏~', 5000);
			return;
		}

		// 初始化一些游戏需要的数据
		gameId = data.result.tcid;
		var cardWidth = Math.round(document.body.offsetWidth / 4) - 14;
		data.result.cardWidth = cardWidth;
		data.result.stat = stat;
		data.result.success = join;
		data.result.fail = fail;
		gameData = data.result;
		if(data.result.record){
			tempTodayCount = data.result.record.todayCount;
			tempTotalCount = data.result.record.totalCount;
		}
		card.init(gameData);

		// 绑定游戏开始事件
		$('.games_preview').click(function() {
			checkAndStart();
		});
	});

	// 验证并开始游戏
	function checkAndStart() {
		// 验证是否可以开始游戏，是否已结束或是否会员或者当日次数限制
		if(gameData.end || !gameData.publish){
			Tools.showTip('游戏尚未开始，请爷稍候',5000);
			return;
		}
		if (gameData.onlyMember && !config.getId()) {
			Tools.showTip('该活动需要会员才能参与', 5000, function() {
				location.href = '../login?from=hui/games';
			});
			return;
		}
		if (gameData.todayFull || tempTodayCount >= gameData.todayNum) {
			Tools.showTip(gameData.repeatInfo || '今天次数已满', 5000);
			return;
		}

		$('#gameplane').css('height',
				(gameData.cardWidth + 14) * Math.round(gameData.cardsNum / 4));
		$('.games_preview').hide();
		$('.board').show();

		card.start();
	}

	// 游戏计数
	function stat(callback) {
		if (!openId) {
			log('不统计非微信用户');
			return;
		}

		Ajax.submitForm({
			url : config.gameStat,
			data : {
				id : gameId
			}
		},function(data) {
			log('game stat success');
			//只在计数成功之后才更新界面
			tempTodayCount++;
			tempTotalCount++;
			$('#today-count').text(tempTodayCount);
			$('#total-count').text(tempTotalCount);
		});
	}

	// 参与抽奖
	function join(callback) {
		if(!openId){
			showMsg('提示', gameData.thanksInfo);
			return;
		}

		Ajax.submitForm({
			url : config.gameJoin,
			data : {
				id : gameId
			}
		}, function(data) {
			if (data.code != 'OK') {
				return;
			}
			if (callback) {
				callback(data);
			}
			if (!data.result) {
				// 未中奖
				showMsg('提示', gameData.thanksInfo);
			} else {
				var str = '获得了<span>' + data.result.awardName + '</span>';
				showMsg('恭喜', gameData.winInfo, str);
				$.ajax({
					url : config.gameOverWin,
					type : "post",
					dataType : "json",
					data : {
						"id" : gameId,
						"giftId" : data.result.giftId,
						"awardId" : data.result.awardId,
						"giftName" : data.result.giftName
					},
					success : function(datas){
						if(datas.result != "ok"){
							Tools.showTip("赠送礼品失败", 5000);
						}
					}
				});
			}
			log('game join success');
		},function(){
			
		},function(){
			Tools.showTip(config.tips.server, 5000);
		});
	}

	// 游戏结束
	function fail() {
		showMsg('提示', gameData.gameEndInfo);
	}

	function showMsg(title, content, hasWin) {
		content = content.replace(/\r\n/gi, '<br/>');

		$('#game-panel-bg').show();
		msgpanel.find('h2').text(title);
		msgpanel.find('p').html(content);
		msgpanel.css('margin-top', -(msgpanel.height() / 2));
		if (hasWin) {
			msgpanel.find('.pround').html(hasWin).show();
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
		msgpanel.show();
	}

	function hideMsg() {
		msgpanel.hide();
		$('#game-panel-bg').hide();
	}

	$('#game-button').click(function() {
		if ($(this).attr('href') == 'javascript:void(0)') {
			hideMsg();
			return false;
		}
	});
	$('#game-panel-bg').click(function() {
		hideMsg();
	});

	$('#game-btn-reset').click(function(e) {
		e.preventDefault();

		// location.href = location.href;
		hideMsg();
		checkAndStart();
	});

	config.join = join;
})();