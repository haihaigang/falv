(function() {

    var token = Storage.get('FLV-TOKEN');

    Ajax.paging({
        url: config.api_gp_voiceHistory,
        data: {
            token: token,
            skip: config.skip,
            limit: config.pageSize
        }
    });

})();
