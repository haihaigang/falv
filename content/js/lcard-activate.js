(function() {

	var fromCard = Tools.getQueryValue('card'),
        id = Storage.get(Storage.AUTH);

    if(id){
        $('.phone').text(id);
    }

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
