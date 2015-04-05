(function() {

	var id = location.search.getQueryValue('id');
	var commentForm = $('#comment-form');
	var uid = config.getId();

	// 设置评论框需要的值
	commentForm.find('input[name="ccid"]').val(id);
	commentForm.find('input[name="openId"]').val(uid);

	config.tips.nodata = '爷来抢第一个槽呗…';
	// 详细
	Ajax.queryRecord({
		url : config.showDetail,
		data : {
			id : id
		}
	}, function(data) {
		if (data.code != 'OK') {
			Tools.showTip('爷，服务器异常，请稍后再试～', 5000);
			return;
		}
		//页面标题
		document.title = data.result.title;
		
		//绑定打开评论按钮
		$('.rec').click(function() {
			if (!uid) {
				//未登录时跳转
				config.redirectLogin('show/magazine-detail?id=' + id);
				return;
			}
			commentForm.show();
			commentForm.find('input[type="text"]').focus();
		});

		commentForm.show();

		//关注十爷帮
		$('.icon_focus').click(function(e){
			$(this).attr("href",config.concernUrl);
		});
		
		//初始化视频
		if($('#myvideojs').length > 0){
		videojs("myvideojs", {"height":"auto", "width":"auto"}).ready(function(){
		    var myPlayer = this;    // Store the video object
		    var aspectRatio = 5/12; // Make up an aspect ratio

		    function resizeVideoJS(){
		      // Get the parent element's actual width
		      var width = document.getElementById(myPlayer.id()).parentElement.offsetWidth;
		      // Set width to fill parent element, Set height
		      myPlayer.width(width).height( width * aspectRatio );
		    }

		    resizeVideoJS(); // Initialize the function
		    window.onresize = resizeVideoJS; // Call the function on resize
		  });
		}
		
		//初始化音频
		if($('#myaudiojs1').length > 0){
			initAudio();
		}
		
		// 加载完详细信息之后在查找评论
		setTimeout(function(){
			config.getList();
		},500);
	});

	// 评论数据
	config.getList = function() {
		Ajax.pageRequest({
			url : config.commentList,
			data : {
				column : 'SHOW',
				ccid : id,
				begin : config.cpage,
				count : config.pagesize
			}
		}, function(data) {
			if (data.code != 'OK') {
				Tools.showTip('爷，服务器异常，请稍后再试～', 5000);
				return;
			}
			$('#total').text(data.countData);
			$('.delComment').click(function(){
				delComment($(this).attr('data-id'));
			});
		});
	};

	// 提交评论
	commentForm.submit(function(e) {
		e.preventDefault();

		var txt = commentForm.find('input[type="text"]').val();

		if (!uid) {
			config.redirectLogin('show/magazine-detail?id=' + id);
			return;
		}
		if (/^\s*$/.test(txt)) {
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
			if (data.code != 'OK') {
				Tools.showTip('爷，服务器异常，请稍后再试～', 5000);
				return;
			}
			commentForm[0].reset();
			config.cpage = 0;
			config.getList();
		});
	});
	
	function initAudio (dom) {
        var currentUrl;

        var container = $('#audiojs-wrapper1'),
        	played = container.find('.played'),
        	duration = container.find('.duration'),
            progress = container.find('.progress'),
            errorMessage = container.find('.error-message'),
        	messageSound = $('#myaudiojs1')[0];
        if (!window.Audio) {
        	errorMessage.html('不支持语音');
            return;
        }

        currentUrl = $('#myaudiojs1').attr('data-src');

        //container.addClass('loading');

        messageSound.addEventListener('loadedmetadata', function () {
            var m = Math.floor(messageSound.duration / 60),
            	s = Math.floor(messageSound.duration % 60);
            container.removeClass('loading');
            duration.html((m<10?'0':'')+m+':'+(s<10?'0':'')+s);
        });
        messageSound.addEventListener('canplaythrough', function () {
            //messageSound.play();
        });
        messageSound.addEventListener('timeupdate', function (e) {
            progress.attr('style', 'width:' + Math.round(e.srcElement.currentTime / e.srcElement.duration * 100) + '%;');
            
            var m = Math.floor(messageSound.currentTime / 60),
            s = Math.floor(messageSound.currentTime % 60);
            played.html((m<10?'0':'')+m+':'+(s<10?'0':'')+s);
        });
        messageSound.addEventListener('pause', function () {

        });
        messageSound.addEventListener('ended', function () {
            progress.attr('style', 'width:100%;');
            container.removeClass('playing');
        });
        messageSound.addEventListener('error', function () {
            //加载失败时，Android下时长显示错误 6000
        	errorMessage.html('加载文件失败');
        });
        
        $('.play-pause').click(function(){
        	if(typeof messageSound.paused == 'undefined' || messageSound.paused){
        		container.addClass('playing');
        		messageSound.play();
        	}else{
        		container.removeClass('playing');
        		messageSound.pause();
        	}
        });

        messageSound.src = currentUrl;
    };
    
  //comment delete
    function delComment(id){
    	Ajax.submitForm({
    		url:config.deleteComment,
    		data:{'commentId':id},
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
    	});
   }

})();