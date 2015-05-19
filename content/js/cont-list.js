(function() {

    //模板帮助方法，反编码
    template.helper('$decodeURI', function(content) {
        if (!content) {
            return '--';
        }
        return decodeURIComponent(content).replace('.docx','');
    });

    //模板帮助方法，获取文件链接地址
    template.helper('$getFileLink', function(content,type) {
        if (!content) {
            return 'javascript:;';
        }

        var d = undefined;
        for(var i in content){
            if(content[i].type == type){
                d = content[i];
                break;
            }
        }
        if(!d){
            return 'javascript:;';
        }

        return config.api_file_download +'?fileId='+ d.id;
    });

	//获取统计信息
	//ST0001-法律咨询, ST0002-发律师函, ST0003-智能合同, ST0004-合同审核, ST0005-法律培训
	Ajax.custom({
		url: config.api_service_stat,
		data: {
			serviceType: 'ST0003'
		}
	},function(data){
		if(data.error){
			return;
		}

		Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);
	});

	//分页
    Ajax.paging({
        url: config.api_cont_list,
        data: {
            skip: '',
            limit: ''
        }
    });

    //开始起草前，调用接口确认
    $('.icon-audit').click(function(e){
    	e.preventDefault();

    	var that = $(this);

    	Ajax.custom({
    		url: config.api_service_valid,
    		data: {
    			userId:Storage.get(Storage.AUTH),
    			serviceType: 'ST0003'
    		}
    	},function(data){
            if(data.data == 0){
                Tools.showAlert('没有服务，请购买后使用');
                return;
            }

    		location.href = that.attr('href');
    	})
    })
})();
