(function() {

    Ajax.paging({
        url: config.api_lcard_list,
        data: {
        	skip: config.skip,
        	limit: config.pageSize
        }
    });
})();
