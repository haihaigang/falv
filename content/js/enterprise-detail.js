(function() {

    var id = Tools.getQueryValue('id'),
    no = Tools.getQueryValue('no'),
        province = Tools.getQueryValue('province');

    Ajax.detail({
        url: config.api_enterprise_detail,
        data: {
            key: config.appkey,
            dtype: 'json',
            unique: id,
            regno: no
        },
        key: 'company'
    });
})();
