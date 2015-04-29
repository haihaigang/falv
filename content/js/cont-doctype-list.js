(function(){
    var keyword = Tools.getQueryValue('name'),d=[];

	
    Ajax.paging({
        url: config.api_cont_doctype_keyword,
        data: {
            name: keyword
        },
        renderEle: '#doctype-list',
        renderFor: 'doctype-list-tmpl'
    });
    template.helper("keyword", keyword);

    // Storage.remove('SEARCH_History')
    if( !Storage.get('SEARCH_History')){
        d[0] = keyword;
    }else{
        d=Storage.get('SEARCH_History');
        // log(d.length)
        if(!d.length && d[0]!=keyword){
            d[1]= keyword;
        }else{
            var bool=true;
            for (var i = 0; i < d.length ; i++) {
                if(keyword==d[i]) {
                    bool=false;
                    break;
                }
            }
            if(bool)
                d[d.length]=keyword;
        }
    }
    Storage.set('SEARCH_History',d);

    $("#doctype-list").find("li").on("click",function(){
        e.preventDefault();
        $(this).attr("data-level");
        $(this).attr("data-id");
        $(this).text();
    })
})()