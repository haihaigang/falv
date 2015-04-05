/** 仙剑翻牌游戏
 *   Date:   2013-02-24
 *   Author: fdipzone
 *   Ver     1.0
 */

/** card class */
var card = (function() {

	var carddata = []; // 记录牌的数据
	var leveldata = []; // 当前关卡牌数据
	var is_lock = 0; // 是否锁定
	var is_over = 0; // 游戏结束
	var first = -1; // 第一次翻开的卡
	var matchnum = 0; // 配对成功次数
	var totalcount = 16; // 总计可翻牌次数
	var curcount = 0; // 当前已翻牌次数
	var options = {}; // 配置信息
	var cardnum = 0; // 牌数量
	var cover = ''; // 卡牌背面图
	var cardwidth = 0; // 卡牌宽度

	var msgplane = $('#message');
	var gameplane = $('#gameplane');

	// 初始化
	init = function(data) {
		//message('游戏初始化中……');

		options = data;
		var gameimg = [];
		cardwidth = data.cardWidth;
		cardnum = data.cardsNum / 2;
		totalcount = data.expectCount;
		carddata = data.urls;

		gameimg = gameimg.concat(carddata);

		if (carddata) {
			// 背面图取第一张图片
			cover = carddata.shift();
		}

		img_preload(gameimg, function() {
			//start();
			msgplane.hide();
		});
	},

	// 开始游戏
	start = function() {
		reset();
		create();
		show();
		showtip();
		set_event();
		is_lock = 0;
		if (typeof options.stat == 'function') {
			options.stat();
		}
	},

	// 随机抽取N张牌
	create = function() {
		leveldata = [];
		// 抽取牌
		var len = carddata.length;
		for (var i = 0; i < len; i++) {
			var curcard = carddata[i];
			leveldata.push({
				'cardno' : i,
				'card' : curcard,
				'turn' : 0
			}, {
				'cardno' : i,
				'card' : curcard,
				'turn' : 0
			});
		}

		// 生成随机顺序游戏牌
		leveldata = shuffle(leveldata);
	},

	// 生成牌
	show = function() {
		var cardhtml = '';
		for (var i = 0; i < leveldata.length; i++) {
			cardhtml += '<div class="cardplane">';
			cardhtml += '<div class="card viewport-flip" id="card' + i
					+ '" style="width:' + cardwidth + 'px;height:' + cardwidth
					+ 'px;">';
			cardhtml += '<div class="list flip out"><img src="'
					+ leveldata[i]['card'] + '"></div>';
			cardhtml += '<div class="list flip"><img src="' + cover
					+ '"></div>';
			cardhtml += '</div>';
			cardhtml += '</div>';

		}
		gameplane.html(cardhtml);
	},

	// 全部翻转
	turnall = function() {
		for (var i = 0; i < leveldata.length; i++) {
			turn_animate(i);
		}
	},

	// 翻转动画
	turn_animate = function(key) {
		var obj = $('#card' + key).children();
		var cardfont, cardback;

		if ($(obj[0]).hasClass('out')) {
			cardfont = obj[0];
			cardback = obj[1];
		} else {
			cardfont = obj[1];
			cardback = obj[0];
		}

		$(cardback).removeClass('in').addClass('out');
		var et = setTimeout(function() {
			$(cardfont).removeClass('out').addClass('in');
		}, 225);
	},

	// 设置点击事件
	set_event = function() {
		$('#gameplane').on('click', '.card', function() {
			turn($(this).attr('id'));
		});
	},

	// 游戏讯息动画
	message = function(msg, type, callback) {

		is_lock = 1;
		msgplane.html(msg).show();
	},

	// 翻牌
	turn = function(id) {
		if (is_lock == 1) {
			return;
		}

		var key = parseInt(id.replace('card', ''));

		if (leveldata[key]['turn'] == 0) { // 未翻开
			if (first == -1) { // 第一次翻
				turn_animate(key);
				first = key;
				leveldata[key]['turn'] = 1;
			} else { // 第二次翻
				turn_animate(key);
				leveldata[key]['turn'] = 1;
				check_turn(key);
			}
		}

	},

	// 检查是否翻牌成功
	check_turn = function(key) {
		is_lock = 1;

		if (leveldata[first]['cardno'] == leveldata[key]['cardno']) { // 配对成功
			matchnum++;

			if (matchnum == cardnum) {
				if (curcount <= totalcount) {
					//未超过翻拍次数限制，成功
					success();
				}else{
					//超过次数，失败
					fail();
				}
			}

			first = -1;
			is_lock = 0;

		} else { // 配对失败,将翻开的牌翻转

			var et = setTimeout(function() {
				turn_animate(first);
				leveldata[first]['turn'] = 0;
				turn_animate(key);
				leveldata[key]['turn'] = 0;

				first = -1;

				if (is_over == 0) {
					is_lock = 0;
				}

			}, 500);
		}

		curcount++;
		showtip();
	},

	// 游戏成功
	success = function() {
		is_over = 1;
		
		if (typeof options.success == 'function') {
			options.success();
		}
	},

	// 游戏失败
	fail = function() {
		is_over = 1;
		
		if (typeof options.fail == 'function') {
			options.fail();
		}
	},

	// 显示计数
	showtip = function() {
		$('#gamecount').html(curcount);
	},

	// 重置参数
	reset = function() {
		is_lock = 1;
		is_over = 0;
		first = -1;
		matchnum = 0;
	}

	/** common function */

	/** 将数组内元素打乱 */
	function shuffle(arr) {
		var tmparr = [];
		var num = arr.length;
		for (var i = 0; i < num; i++) {
			tmparr.push(arr.splice(Math.random() * arr.length, 1).pop());
		}
		return tmparr;
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
				callback();
			}
		}, 200);
	}

	return this;

})();