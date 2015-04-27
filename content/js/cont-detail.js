(function() {

	var id = Tools.getQueryValue('id');

    Ajax.detail({
        url: config.api_cont_preview,
        data: {
        	id: id
        }
    });
})();
