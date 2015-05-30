(function() {
    var id = Tools.getQueryValue('id');

    Ajax.detail({
        url: config.api_letter_detail,
        data: {
            id: id
        }
    });

    $('#flv-detail').on('click', '.btn-sure', function(e) {
        e.preventDefault();

        Tools.showConfirm('您确认改律师函内容后，代理律师将尽快寄出正本，法率网将短信通知您最新进程。', doOk);
    });

    //确认发送
    function doOk() {
        Ajax.custom({
            url: config.xxx,
            data: {}
        }, function(data) {
        	if(data.error){
        		Tools.showAlert(data.error.message);
        		return;
        	}

        	Tools.showAlert('确认成功',function(){
        		history.go(-1);
        	})
        })
    }
})();
