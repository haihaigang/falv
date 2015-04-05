config.tips.nodata ='爷，礼品已领完了，明儿请赶早！';
(function() {

	var openId = location.search.getQueryValue('openId');
	var isFirstConcern;

	// 微信入口，记录openId
	if (openId) {
		Cookie.set(Storage.OPENID, openId);
	} else {
		openId = Cookie.get(Storage.OPENID);
	}

	// 列表数据
	config.getList = function() {
		Ajax.pageRequest({
			url : config.giftList,
			data : {
				begin : config.cpage,
				count : config.pagesize
			}
		}, function(data) {
			if (data.code != 'OK') {
				Tools.showTip('爷，服务器异常，请稍后再试～', 5000);
				return;
			}

			$('.notice').show();

			if (data.result && data.result.length > 0) {
				$('#max-date').text(Tools.formatDate(data.result[0].maxEndTime, 1));
			}
			
			$('.btn_apply').bind('click', checkBtn);
		});
	};

	// 初始化
	if (!openId) {
		$('#no-concern').show();
	} else {
		if (!config.getId()) {
			// 未登录
			$('#reg1 a').attr('href','../register?from='+ encodeURIComponent('gift0/index?openId='+ openId));
			$('#reg1').show();
		}
		config.getList();
	}

	// 获取当前关注状态
	Ajax.queryRecord({
		url : config.giftFirstConcern
	}, function(data) {
		if (data.code != 'OK') {
			return;
		}

		isFirstConcern = data.result;
	});

	function checkBtn(e) {
		if (isFirstConcern === true) {
			e.preventDefault(e);
			Tools.showTip('小松余粮不多了，每位爷就一次机会哦！不好意西啦～', 5000);
		}
	}
	
})();
