(function() {

	var status = {
		'LS0003': '提交中',
		'LS0004': '起草中',
		'LS0005': '确认中',
		'LS0006': '投递中',
		'LS0007': '存档中'
	}

	//模板帮助方法， 确定状态
	template.helper('$getLetterStatus', function(content) {
		if(!content){
			return '--';
		}

		return status[content] || '--';
	});

	//获取统计信息
	//ST0001-法律咨询, ST0002-发律师函, ST0003-智能合同, ST0004-合同审核, ST0005-法律培训
	Ajax.custom({
		url: config.api_service_stat,
		data: {
			serviceType: 'ST0002'
		}
	},function(data){
		if(data.error){
			return;
		}

		Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);
	})

	//分页
    Ajax.paging({
        url: config.api_letter_list,
        data: {
            skip: config.skip,
            limit: config.pageSize
        }
    }, function(data) {

    });

    //开始签发前，调用接口确认
    $('.icon-send').click(function(e){
        e.preventDefault();

        var that = $(this);

        Ajax.custom({
            url: config.api_service_valid,
            data: {
                userId:Storage.get(Storage.AUTH),
                serviceType: 'ST0002'
            }
        },function(data){
            if(data.error){
                Tools.showAlert(dta.error.message);
                return;
            }
            location.href = that.attr('href');
        })
    })
})();
