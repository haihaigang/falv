(function() {
    var id = Tools.getQueryValue('id'), letterData;

    Ajax.custom({
        url: config.api_letter_detail,
        data: {
            id: id
        }
    },function(data){
        // config.api_file_img
        var evidences = data.data.evidences
        $.each(evidences,function(i){
            log(evidences[i])
            evidences[i].fileId = config.api_file_img + evidences[i].fileId;
        })
        Ajax.render('#flv-voucher', 'flv-voucher-tmpl', data.data.evidences);
    });

})()
