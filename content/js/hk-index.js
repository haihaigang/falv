(function() {

	var id = Storage.get(Storage.AUTH);

    if(id){
    }else{
        //未登录，跳转
        location.href = '../account/login.html';
    }

})();
