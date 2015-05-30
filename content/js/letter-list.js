(function() {

    var status = {
        'LS0001': '提交中',
        'LS0002': '起草中',
        'LS0003': '确认中',
        'LS0004': '投递中',
        'LS0005': '邮寄凭证'
    }

    //模板帮助方法， 确定状态
    template.helper('$getLetterStatus', function(content) {
        if (!content) {
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
    }, function(data) {
        if (data.error) {
            return;
        }

        //剩余服务为0，左上角显示关于
        if(data.data.remainAmounttotal == 0){
            $('.icon-send').text('关于').attr('href','letter-info.html');
        }

        Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);

        // 进入编辑页面
        $('#flv-list').delegate('.letter-edit','click',function(){
            var id = $(this).attr('data-id');
            window.location.href = 'letter-send.html?id=' + id;
     
        })
    })

    //分页
    config.paging = function() {
        Ajax.paging({
            url: config.api_letter_list,
            data: {
                skip: config.skip,
                limit: config.pageSize
            }
        });
    }

    config.paging();

    //开始签发前，调用接口确认
    $('.icon-send').click(function(e) {
        e.preventDefault();

        var that = $(this);

        Ajax.custom({
            url: config.api_service_valid,
            data: {
                userId: Storage.get(Storage.AUTH),
                serviceType: 'ST0002'
            }
        }, function(data) {
            if (data.data == 0) {
                Tools.showAlert('没有服务，请购买后使用');
                return;
            }
            location.href = that.attr('href');
        })
    })

})();
