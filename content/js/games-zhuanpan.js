(function() {
	var msgpanel = $('#message');// 提示信息框
	
	var info = null,
		angle = 0,
		awaId = null,
		giftId = null,
		winner = null,
		openId = location.search.getQueryValue('openId');
	var uid = config.getId();//当前登录用户
	
	//微信入口，记录openId
	if(openId){
		Cookie.set(Storage.OPENID, openId);
	}else{
		openId = Cookie.get(Storage.OPENID);
	}
	
	//初始化转盘位置
	var defaultW = 532,//转盘默认宽
		defaultH = 532,//转盘默认高
		defaultT = 20,//转盘默认偏移顶部
		defaultL = 49;//转盘默认偏移左
	var ratio = 640 / $('.games0').width();//转盘背景默认宽：容器宽
	
	$('.games0_container').css({
		width: defaultW / ratio,
		height: defaultH / ratio,
		top: defaultT / ratio,
		left: defaultL /ratio
	});
	alert(1);
	// 发送ajax请求，查看用户积分情况并加载转盘信息
	Ajax.queryRecord({
		url : config.zhuanpanProcess,
		data : {
			openId : openId
		}
	}, function(data) {
		if (data.code != 'OK') {
			Tools.showTip("读取游戏信息失败，请刷新页面！", 5000);
			return;
		}
		var pg = data.result;
		angle = pg.angle;
		winner = pg.winner;
		info = pg.info;
		awaId = pg.awaId;
		giftId = pg.giftId;

		$('#award1').text(pg.awardInfo1);
		$('#award2').text(pg.awardInfo2);
		$('#award3').text(pg.awardInfo3);

		if (angle < 0) {
			Tools.showTip(info, 5000);return;
		} else {
			$("#begin").show();
		}
	});

	// 指针转动事件
	$("#begin").click(function() {
		$(this).hide();
		$("#zhizhen").rotate({
			duration : 6000,// 转动时间间隔（转动速度）
			angle : 3600 + angle, // 开始角度
			animateTo : angle, // 转动角度
			callback : function() { // 回调函数
				Ajax.queryRecord({
					url : config.zhuanpanWinner,
					data : {
						openId : openId,
						awaId : awaId,
						giftId : giftId,
						angle : angle,
						winner : winner
					}
				});
				
				panziShow(info, winner);
			}
		});
	});
	
	function panziShow(content, hasWin){
		var dzpanel = $("#dzPanel");
		
		$('#game-panel-bg').show();
		dzpanel.find('p').html(content);
		dzpanel.css('margin-top', -(dzpanel.height() / 2));
		dzpanel.show();
		if(hasWin) {
			dzpanel.find("#game-btn-gift").show();
			dzpanel.find("#game-btn-receive").show();
		}else {
			dzpanel.find("#dz-suren").show();
		}
	}

	function hideMsg() {
		var dzpanel = $("#myPanel");
		dzpanel.hide();
		$('#game-panel-bg').hide();
	}
})();