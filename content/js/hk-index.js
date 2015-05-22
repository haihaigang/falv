(function() {

    var id = Storage.get(Storage.AUTH),
        expiresDom = $('#flv-expires');

    if (id) {
        //获取法律管家有效期，
        Ajax.custom({
            url: config.api_service_falv,
            showLoading: true
        }, function(data) {
            expiresDom.text('法率管家服务有效期：' + template.prototype.$getDateFromStr(data.data));
        }, function(error) {
            expiresDom.text('法率管家服务有效期：--')
        })
    } else {
        expiresDom.text('法率管家服务有效期：您还未登录')
        //未登录，设置链接都跳转到介绍页
        $('#hk-consult').attr('href', 'consult-info.html');
        $('#hk-cont').attr('href', 'cont-info.html');
        $('#hk-audit').attr('href', 'audit-info.html');
        $('#hk-letter').attr('href', 'letter-info.html');
        $('#hk-train').attr('href', 'train-info.html');
    }

})();
