(function() {

    var status = {
        'LS0001': '提交中',
        'LS0002': '起草中',
        'LS0003': '确认中',
        'LS0004': '投递中',
        'LS0005': '存档中'
    };

    var statuslabel = {
        'LS0001': '提交时间',
        'LS0002': '预计完成',
        'LS0003': '客户确认',
        'LS0004': '投递完成',
        'LS0005': '存档完成'
    }

    //模板帮助方法， 确定状态
    template.helper('$getLetterStatus', function(content) {
        if (!content) {
            return '--';
        }

        return status[content] || '--';
    });

    //模板帮助方法， 确定状态时间label
    template.helper('$getLetterLabel', function(content,isActive) {
        if (!content) {
            return '--';
        }
        log(isActive)

        if(isActive) return '完成时间';

        return statuslabel[content] || '--';
    });


    var id = Tools.getQueryValue('id');

    Ajax.custom({
        url: config.api_letter_detail,
        data: {
            id: id
        },
        showLoading: true
    }, function(data) {
        if (data.error) {
            return;
        }

        //处理律师函状态，若没有历史状态
        var d = data.data,
            st = [],
            isFirst = false;
        d.statusHistory = d.statusHistory || [];

        if (d.statusHistory.length == 0) {
            for (var i in status) {
                if (st.length == 0) {
                    st.push({
                        status: i,
                        statusUpdateAt: d.createAt,
                        active: true,
                        isEnd: false
                    });
                } else if(st.length == 1){
                    st.push({
                        status: i,
                        statusUpdateAt: '两个工作日内',
                        active: false,
                        isEnd: false
                    });
                }else {
                    st.push({
                        status: i,
                        statusUpdateAt: '',
                        active: false,
                        isEnd: false
                    });
                }
            }
        } else {
            for (var i in status) {
                var flag = {
                    status: i,
                    statusUpdateAt: '--',
                    active: false,
                    isEnd: false
                };
                for (var j in d.statusHistory) {
                    if (d.statusHistory[j].status == i) {
                        flag.statusUpdateAt = d.statusHistory[j].statusUpdateAt;
                        flag.active = true;
                        flag.isEnd = true;
                        break;
                    }
                }
                if (!flag.active) {
                    if(!isFirst && i != 'LS0003'){
                        flag.statusUpdateAt = '两个工作日内';
                        flag.active = true;
                    }
                    if(i == 'LS0003'){
                        flag.active = true;
                    }
                    isFirst = true;
                }
                st.push(flag);
            }
        }
        d.statusHistory = st;

        Ajax.render('#flv-detail', 'flv-detail-tmpl', d);
    });
})();
