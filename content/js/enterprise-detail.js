(function() {

    var id = Tools.getQueryValue('id'),
        no = Tools.getQueryValue('no'),
        province = Tools.getQueryValue('province'),
        forshare = Tools.getQueryValue('forshare');

    Ajax.detail({
        url: config.api_enterprise_detail,
        data: {
            key: config.appkey,
            dtype: 'json',
            unique: id,
            regno: no,
            province: province
        },
        key: {'data':[],'company':[]}
    });

    $('#flv-detail').on('click','.company-tag span',function(){
        $('.company-tag span').removeClass('active');
        $(this).addClass('active');
        $('.company-view').hide();
        $($(this).attr('data-to')).show();
    })
})();
