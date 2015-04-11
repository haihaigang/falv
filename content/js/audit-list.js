(function() {

    Ajax.paging({
        url: config.api_audit_list,
        data: {
            ship: '',
            limit: ''
        }
    }, function(data) {

    });
})();
