(function(){
	if(Storage.get('SEARCH_History')){
        var d = Storage.get('SEARCH_History'),str="";
        for (var i = 0; i < d.length ; i++) {
        	str +="<li>"+d[i]+"</li>"
        }
		$("#doctypeKeywordList").append(str);
	    $("#doctypeKeywordList > li").click(function(){
			$("#name").val($(this).text()).focus();
		});
		$("#emptyList").css("display","block");
    }
	$("#emptyList").click(function(){
		$("#doctypeKeywordList").empty();
		$(this).css("display","none");
		Storage.remove('SEARCH_History')
	});
})()