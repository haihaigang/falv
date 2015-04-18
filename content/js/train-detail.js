(function() {

	var id = Tools.getQueryValue('id');

    Ajax.detail({
        url: config.api_audit_detail,
        data: {
        	id: id
        }
    });
})();
