(function() {

	var fromCard = Tools.getQueryValue('card');

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
            data: $(this)
        }, function(data) {
            if (data.OK != 'true') {
            	Tools.showAlert('激活失败！<br/>请输入正确的卡号和密码。<br/>有疑问请联系我们的客服人员。<br/>400-440-8888');
                return;
            }

            location.href = 'overview.html';
        });
    });
})();
