(function() {

    var api_url = config.api_consult_list,
        consultType = Storage.get('FLV-CONSULT-TYPE');

    //获取统计信息
    //ST0001-法律咨询, ST0002-发律师函, ST0003-智能合同, ST0004-合同审核, ST0005-法律培训
    Ajax.custom({
        url: config.api_service_stat,
        data: {
            serviceType: 'ST0001'
        }
    }, function(data) {
        if (data.error) {
            return;
        }

        //剩余服务为0，左上角显示关于
        if(data.data.remainAmounttotal == 0){
            $('.icon-consult').text('关于').attr('href','consult-info.html');
        }

        Ajax.render('#flv-stat', 'flv-stat-tmpl', data.data);
    });

    //根据状态初始化
    if(consultType == 'question'){
        config.paging = getFileList;
        $('.consult-tabs-item').removeClass('active');
        $('.consult-list').hide();
        $('.question').addClass('active');
        $('#question').show();
    }else{
        config.paging = getList;
        $('.consult-tabs-item').removeClass('active');
        $('.consult-list').hide();
        $('.tel').addClass('active');
        $('#tel').show();
    }
    config.paging();

    //点击tab切换
    $('.consult-tabs-item').click(function(e) {
        if($(this).hasClass('active')) return;

        $('.consult-tabs-item').removeClass('active');
        $('.consult-list').hide();
        $(this).addClass('active');
        config.skip = 0;

        if ($(this).hasClass('question')) {
            config.paging = getFileList;
            $('#question').show();
            Storage.set('FLV-CONSULT-TYPE', 'question');
        } else {
            config.paging = getList;
            $('#tel').show();
            Storage.set('FLV-CONSULT-TYPE', 'tel');
        }
        config.paging();
    });

    //获取电话咨询列表
    function getList() {
        Ajax.paging({
            url: config.api_consult_list,
            data: {
                skip: config.skip,
                limit: config.pageSize
            },
            renderEle: '#flv-list',
            renderFor: 'flv-list-tmpl'
        });
    }

    //获取咨询材料列表
    function getFileList() {
        Ajax.paging({
            url: config.api_consult_file_list,
            data: {
                skip: config.skip,
                limit: config.pageSize
            },
            renderEle: '#flv-list-file',
            renderFor: 'flv-list-file-tmpl'
        });
    }

    $('#flv-list').on('click', 'a.box', function(e){
        e.preventDefault();

        var d = {};
        d.answer = $(this).attr('data-answer');
        d.status = $(this).attr('data-status');
        d.question = $(this).find('.title .txt').text();
        d.startTime = $(this).find('.start .txt').text();
        d.endTime = $(this).find('.end .txt').text();
        d.duration = $(this).find('.duration .txt').text();

        Storage.set('FLV-CONSULT',d);

        location.href = $(this).attr('href');
    });

    //开始咨询前，调用接口确认
    $('.icon-consult').click(function(e){
        e.preventDefault();

        var that = $(this);

        Ajax.custom({
            url: config.api_service_valid,
            data: {
                userId:Storage.get(Storage.AUTH),
                serviceType: 'ST0001'
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
