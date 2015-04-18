(function() {

	var id = Tools.getQueryValue('id');

    Ajax.detail({
        url: config.api_consult_file_detail,
        data: {
        	id: id
        }
    });
})();
