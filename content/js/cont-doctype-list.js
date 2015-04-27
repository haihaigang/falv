(function(){
	  var keyword = Tools.getQueryValue('name');
	  	//分页
    Ajax.paging({
        url: config.api_cont_doctype_keyword,
        data: {
            name: keyword
        },
        renderEle: '#doctype-list',
        renderFor: 'doctype-list-tmpl'
    });

})()