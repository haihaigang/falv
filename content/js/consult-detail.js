(function() {

	var id = Tools.getQueryValue('id');

	var d = Storage.get('FLV-CONSULT');
	if(d){
		log(d)
		Ajax.render('#flv-detail', 'flv-detail-tmpl', d);
	}
})();
