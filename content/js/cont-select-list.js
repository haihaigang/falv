(function(){
    var type = Tools.getQueryValue('type');
    log(config.api_cont_doctype_list);
  	//分页
    if(type=="doctype"){
        Ajax.paging({
            url: config.api_cont_doctype_list,
            data: {},
            renderEle: '#result',
            renderFor: 'doc-list-tmpl'
        });
    }
    if(type=="category"){
        Ajax.paging({
            url: config.api_cont_category_list,
            data: {},
            renderEle: '#result',
            renderFor: 'cat-list-tmpl'
        });
    }
    $("#result-list > li").on('click',function(){
        var txt=$(this).text();
        window.location.href="cont-build.html?type="+type+"&choose="+txt
    })
})()