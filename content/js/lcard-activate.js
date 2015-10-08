(function() {

	var canal = Tools.getQueryValue('canal'),
        id = Storage.get(Storage.AUTH),
        account = Storage.get(Storage.ACCOUNT);

    if(id){
        $('.phone').text(account.id);
    }else{
        //未登录，跳转
        if(config.checked)
            location.href = '../account/login.html?from=../lcard/activate.html';
    }

    //如果扫码过来的，自动激活
    if(canal){
        Ajax.custom({
            url: config.api_lcard_activate_auto,
            data: {
                canal: canal
            }
        }, function(data){
            if(data.error){
                Tools.showAlert(data.error.message);
                return;
            }

            Storage.set('FLV-LCARD',data.data)

            location.href = 'overview.html';
        })
    }

    //提交激活
    $('#lcard-form').submit(function(e) {
        e.preventDefault();

        var cardId = $('input[name="cardId"]').val(),
            password = $('input[name="password"]').val();

        if (cardId.isEmpty()) {
            Tools.showAlert('卡号为空', 5000);
            return;
        }
        if (password.isEmpty()) {
            Tools.showAlert('密码为空', 5000);
            return;
        }

        Ajax.submit({
            url: config.api_lcard_activate,
            data: $(this),
            type: 'GET'
        }, function(data) {
            if (data.error) {
            	Tools.showAlert('激活失败！<br/>请输入正确的卡号和密码。<br/>有疑问请联系我们的客服人员。<br/>400-440-8888');
                return;
            }

            Storage.set('FLV-LCARD',data.data)

            location.href = 'overview.html';
        });
    });
})();
