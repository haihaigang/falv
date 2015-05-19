(function() {

	var token = Storage.get('FLV-TOKEN');

    //分页
    config.paging = function() {
        Ajax.paging({
            url: config.api_gp_voiceHistory,
            data: {
            	token: token,
                skip: config.skip,
                limit: config.pageSize
            }
        });
    };

    config.paging();

    $('#flv-list').on('click','.btn',function(e){
    	e.preventDefault();

        Tools.showAlert('不能播放，请在app中播放');
        return;

    	if($(this).hasClass('play')){
    		$(this).removeClass('play').addClass('stop').text('停止');
    	}else{
    		$(this).removeClass('stop').addClass('play').text('播放');
    	}

    	$('#flv-video').attr('src','');
    })
})();
