(function() {

    var id = Storage.get(Storage.AUTH);

    if (!id) {
        location.href = '../account/login.html?from=../user/index.html'
    }

    var token, //存证云token
        numDom = $('#flv-num'),//号码dom
        code = Tools.getQueryValue('code'),
        phone = Tools.getQueryValue('phone'),
        redirect = encodeURIComponent('http://42.192.0.11:4001/static/gramophone/dial.html'),
        url = 'https://test.cunnar.com:15443/opencloud/api/oauth2/authorize?app_key=21503160001&redirect_uri=' + redirect;

    if (code) {
        Ajax.custom({
            url: config.api_gp_getTokenByCode,
            data: {
                code: code
            },
            showLoading: true
        }, function(data) {
            if (data.error) {
                Tools.showAlert(data.error.message);
                return;
            }

            token = data.data.access_token;
            Storage.set('FLV-TOKEN', token);

            getDialList();
        });
    } else {
        Ajax.custom({
            url: config.api_gp_getTokenByPhone,
            data: {
                phone: id
            },
            showLoading: true
        }, function(data) {
            if (data.error) {
                //若未授权跳转存证云授权网页
                if (data.error.code == 'PERMISSION_FALSE') {
                    //location.href = url;
                }
                return;
            }

            token = data.data.access_token;
            Storage.set('FLV-TOKEN', token);

            getDialList();
        });
    }

    if(phone){
        numDom.text(phone);
    }

    //拨打电话
    $('#flv-dial').click(function(e) {
        if (!token) {
            Tools.showAlert('获取token失败，请刷新重试');
            return;
        }
        var v = numDom.text();
        if(!v){
            Tools.showAlert('请输入被叫号码');
            return;
        }
        Ajax.custom({
            url: config.api_gp_call,
            data: {
                token: token,
                caller: id, //(主叫手机)
                called: v //(被叫手机)
            },
            showLoading: true
        }, function(data) {
            if (data.data.error) {
                Tools.showAlert(data.data.error_code);
                return;
            }

            $('#flv-phone').removeClass('disabled').attr('href','tel:4008015888');
        })
    });

    //模拟数字键盘操作
    $('.keyboard a.d').click(function(e) {
        e.preventDefault();

        var v = numDom.text();
        numDom.text(v + $(this).text())
    });
    $('#flv-empty').click(function() {
        numDom.empty();
    });
    $('#flv-del').click(function() {
        var v = numDom.text();
        if (v.length == 0) return;
        v = v.substring(0, v.length - 1);
        numDom.text(v);
    });

    //获取拨打记录
    function getDialList() {
        Ajax.custom({
            url: config.api_gp_voiceHistory,
            data: {
                token: token,
                skip: config.skip,
                limit: config.pageSize
            }
        }, function(data) {
            if (data.data.error_code) {
                $('#flv-list').html('<div class="nodata">' + data.data.error_code + '</div>');
                return;
            }

            if (!data.data || data.data.length == 0) {
                $('#flv-list').html('<div class="nodata">暂无记录</div>');
            } else {

                Ajax.render('#flv-list', 'flv-list-tmpl', data.data);
            }
        });
    }

    // 用户如果已经在存证云注册过，必须跳转到存证云自己的“请求授权”页面，
    // 用户输入原存证云账号和密码，点击“同意授权”后，会跳转到我们指定的页面。
    // 这个需要你们在app端用webview来完成url拦截
    // 具体流程是：

    // 你们调用/cunnar/getTokenByPhone接口，会返回{"apiVersion":"1.0","error":{"code":"PERMISSION_FALSE","message":"无用户权限。"}}

    // ——>你用webview来访问
    // https://test.cunnar.com:15443/opencloud/api/oauth2/authorize?app_key=21503160001&redirect_uri=https%3A%2F%2Fwww.ilaw66.com%2Fcunnarresponse
    // 用户数据他的账号密码，点击同意授权(参考图示sheet)后会跳转到
    // https://www.ilaw66.com/cunnarresponse?code=xxx
    // 你拦截到code(xxx)后,调用/cunnar/getTokenByCode，会返回数据类似下面这个{"apiVersion":"1.0","data":{"user_id":"1622702","access_token":"9440a695-6484-4632-ab08-79acb0e638c7","expires_in":86400,"start_time":0,"end_time":0}}

    // （这步是必须的，只有调用code获得token这个接口才能完成授权）
})();
