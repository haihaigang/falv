(function(){
	
	var id = location.search.getQueryValue('id');
	var commentForm = $('#comment-form');
	var uid = config.getId();

	//设置评论框需要的值
	commentForm.find('input[name="ccid"]').val(id);
	commentForm.find('input[name="openId"]').val(uid);
	
	config.tips.nodata = '爷来抢第一个槽呗…';
	
	//房源详情
	Ajax.queryRecord({
		url: config.houseDetail,
		data: {
			id: id
		}
	}, function(data){
		if(data.code != 'OK'){
			return;
		}
		
		//页面标题
		document.title = data.result.projectBaseInfo.projectExtendsName || '待定';
		
		//选项卡
		$('.tabs').show();
		
		//绑定收藏按钮
		$('.icon_favorite').bind('click', collect);
		
		//核心价值
		$('.icon_down').bind('click', showAssert);
		
		//热线电话
		if(data.result.projectBaseInfo.hotLine){
			$('#hot-line span').text(data.result.projectBaseInfo.hotLine);
			$('#hot-line').attr('href','tel:'+data.result.projectBaseInfo.hotLine);
		}
		
		//滚动图来自相册中的效果图
		if(data.result.projectThumbs){
			var effects = [];
			for(var i in data.result.projectThumbs){
				if(data.result.projectThumbs[i].attType == '效果图'){
					effects.push(data.result.projectThumbs[i]);
				}
			}
			var result = template.render('wu-scroller-tmpl', {'list':effects});
			$('.scroller').html(result);
			
			if(typeof config.initScroll == 'function'){
				config.initScroll();
			}
			
			//滚动图绑定tap事件，跳转链接
			$('.scroller .item').addSwipeEvents().bind('tap', function(evt, touch) {
				  location.href = 'album?id='+id;
			});
		}
		
		//房源的活动
		if(data.result.projectActivityInfo && data.result.projectActivityInfo.length > 0){
			var result = template.render('wu-activity-tmpl', {'list':data.result.projectActivityInfo});
			$('#wu-list0').html(result);
		}else{
			$('#wu-list0').html('<div style="padding:.1rem;">该死的，小松睡过头了。老大交代的内容还没交差呐！爷见谅啊～今儿个辛苦爷移个驾先，改天爷再来啊！</div>');
		}
		
		setTimeout(function(){
			//访问历史
			visit();
			//验证收藏
			checkCollect();
			//房源评论数
			count(data.result.projectBaseInfo.projectId);
		},500);
		
	});
	
	//tab切换
	$('.tabs a').click(function(e){
		e.preventDefault();
		
		$('.tabs a').removeClass('active');
		$(this).addClass('active');
		$('.tab_content').hide();
		$($(this).attr('href')).show();
		//切换评论时，若为空则获取评论
		if($(this).attr('href') == '#comment' 
			&& $('#wu-list').html() == ''){
			config.getList();
		}
	});
	
	//获取评论
	config.getList = function() {
		Ajax.pageRequest({
			url : config.commentList,
			data : {
				column : 'HOUSE',
				ccid : id,
				begin : config.cpage,
				count : config.pagesize
			}
		},function(data){
			$('#total').html(data.countData);
			$('.delComment').click(function(){
				delComment($(this).attr('data-id'));
			});
		});
	};
	
	//提交评论
	commentForm.submit(function(e) {
		e.preventDefault();
		
		var txt = commentForm.find('input[type="text"]').val();
		
		if(!uid){
			config.redirectLogin('shop/detail?id='+id);
			return;
		}
		if(/^\s*$/.test(txt)){
			Tools.showTip('爷，评论内容不能为空', 5000);
			return;
		}
		if (txt.length < 10) {
			Tools.showTip('爷，评论内容至少10个字', 5000);
			return;
		}

		Ajax.submitForm({
			url : config.commentCommit,
			data : $(this)
		}, function(data) {
			if(data.code != 'OK'){
				Tools.showTip('爷，服务器异常，请稍后再试～', 5000);
				return;
			}
			commentForm[0].reset();
			commentForm.hide();
			config.cpage = 0;
			config.getList();
			count(id);
		});
	});
	
	$('#comment').on('click', '.rec', function() {
		if (!uid) {
			//未登录时跳转
			config.redirectLogin('shop/detail?id=' + id);
			return;
		}
		commentForm.show();
		commentForm.find('input[type="text"]').focus();
	});
	
	//收藏（取消）房源
	function collect(e){
		e.preventDefault();
		
		var that = $(this),
			isC = that.hasClass('active'),
			uid = config.getId();
		
		if(!uid){
			Tools.toast('爷，还未登录');
			return;
		}
		
		Ajax.submitForm({
			url: config.houseCollect,
			data: {
				id: id,
				uid: uid,
				isCollect: !isC
			}
		},function(data){
			if(data.code != 'OK'){
				Tools.toast('收藏失败');
				return;
			}
			if(isC){
				that.removeClass('active');
				Tools.toast('取消收藏成功');
			}else{
				that.addClass('active');
				Tools.toast('收藏成功');
			}
		});
	}
	
	//浏览记录
	function visit(){
		if(!uid){
			return;
		}
		
		Ajax.submitForm({
			url: config.houseVisit,
			data: {
				id: id,
				uid: uid
			}
		},function(data){
			if(data.code != 'OK'){
				log(data.message || '记录失败！');
				return;
			}
		});
	}
	
	//验证是否已收藏
	function checkCollect(){
		if(!uid){
			return;
		}
		
		Ajax.submitForm({
			url: config.houseCheckCollect,
			data: {
				id: id,
				uid: uid
			}
		},function(data){
			if(data.code != 'OK'){
				log(data.message || '验证收藏失败！');
				$('.icon_favorite').show();
				return;
			}
			
			if(data.result){
				$('.icon_favorite').addClass('active').show();
			}else{
				$('.icon_favorite').removeClass('active').show();
			}
		});
	}
	
	//展开，收起核心价值
	function showAssert(e){
		e.preventDefault();
		
		$(this).toggleClass('active');
		$(this).parent().toggleClass('active');
	}
	
	//房源评论数
	function count(id){
		Ajax.submitForm({
			url: config.houseCommentCount,
			data: {
				id: id
			}
		},function(data){
			if(data.code != 'OK'){
				log(data.message || '获取房源评论数失败！');
				return;
			}
			
			var count = parseInt(data.result) || 0;
			$('#comment-count').text('('+(count > 99 ? '99+' : count)+')').show();
		});
	}
	
	//comment delete
    function delComment(comid){
    	Ajax.submitForm({
    		url:config.deleteComment,
    		data:{'commentId':comid},
    	},function(result){
    		if(!result){
    			return;
    		}
    		if(!result.code){
    			return;
    		}
    		if(result.code!='OK'){
    			return;
    		}
    		config.cpage = 0;
    		config.getList();
    		count(id);
    	});
   }
	
})();