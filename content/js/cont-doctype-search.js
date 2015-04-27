(function(){
	$("#doctypeKeywordList > li").click(function(){
		$("#name").val($(this).text()).focus();
	});
	$("#emptyList").click(function(){
		$("#doctypeKeywordList").empty();
		$(this).css("display","none");
	});
})()