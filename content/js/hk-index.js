(function() {

	var id = Storage.get(Storage.AUTH);

	if (id) {} else {
		//未登录，跳转
		//location.href = '../account/login.html';
		$('#hk-consult').attr('href', 'consult-info.html');
		$('#hk-cont').attr('href', 'cont-info.html');
		$('#hk-audit').attr('href', 'audit-info.html');
		$('#hk-letter').attr('href', 'letter-info.html');
		$('#hk-train').attr('href', 'train-info.html');
	}

})();