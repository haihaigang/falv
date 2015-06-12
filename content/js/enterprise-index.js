(function() {
    var id = Storage.get(Storage.AUTH);

    if(id){
    }else{
        //未登录，跳转
        location.href = '../account/login.html';
    }
    
    //点击搜索
    $('#search-form').submit(function(e) {
        e.preventDefault();

        if ($('input[name="province"]').val().isEmpty()) {
            Tools.showAlert('请选择一个省份');
            return;
        }
        if ($('input[name="keyword"]').val().isEmpty()) {
            Tools.showAlert('请输入关键字');
            return;
        }

        $(this)[0].submit();
    });

    var provincePage = $('#province-page'),
        hasRender = false, //是否已获取省市数据
        sp = new SecondPage('#province-page');

    //点击打开侧栏页面
    $('#selectPro').click(function() {
        sp.openSidebar(function(){
            getProvince();
        });
    });

    //选择了一个省市
    $('#flv-province').on('click', '.value', function(e) {
        e.preventDefault();

        sp.closeSidebar();
        $('#selectPro').val($(this).text());
        $('input[name="province"]').val($(this).attr('data-code'));
    });
    
    //获取全国省市
    function getProvince() {
        if (hasRender) return;

        Ajax.custom({
            url: config.api_enterprise_province,
            data: {
                key: config.appkey,
                dtype: 'json'
            }
        }, function(data) {
            data = data.data;
            if (data.Status != '200') {
                return;
            }

            var result = data.Result,
                lastLetter,
                res = [], //[{letter:'':items:[]}]
                idx = 0;

            for (var i = 0; i < result.length; i++) {
                var fl = result[i].Code.substring(0, 1);
                if (!lastLetter) {
                    lastLetter = fl;
                    res.push({
                        'letter': fl,
                        items: [result[i]]
                    });
                } else if (lastLetter == fl) {
                    res[idx].items.push(result[i]);
                } else {
                    idx++;
                    lastLetter = fl;
                    res.push({
                        'letter': fl,
                        items: []
                    });
                    res[idx].items.push(result[i]);
                }
            }

            Ajax.render('#flv-province', 'flv-province-tmpl', res)

        })
    }

})();
