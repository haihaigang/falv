(function(){
    
    var id = Tools.getQueryValue('id');

    $(".btn-view").on('click',function(){
        window.location.href="cont-detail.html?id="+id
    })
    
    $(".btn-risk").on('click',function(){
        window.location.href="cont-tips.html"
    })
})()