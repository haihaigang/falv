var config = {
    // 当前第几页，从0开始
    cpage: 0,
    // 默认分页大小
    pagesize: 4
};
config.server = location.protocol + '//' + location.host + '/mini/';
var url = "",
    concernUrl = "";
//获取在线咨询URL

//config.onlineUrl = 'http://101.230.8.67:8091/wap/{1}?sdkAccount={3}';//在线咨询Url(本地测试)
//config.onlineUrl = 'http://58.60.188.50:8082/wap/{1}?sdkAccount={3}';//在线咨询Url(世联服务器)
config.aliyunHost = 'http://haner1.oss-cn-hangzhou.aliyuncs.com/'; //阿里云主机
config.image = location.protocol + '//' + location.host + '/';
if (location.pathname.indexOf('/worldunion') == 0) {
    //本地测试加上项目名，发布后可删除
    config.image = location.protocol + '//' + location.host + '/worldunion/';
    config.server = location.protocol + '//' + location.host + '/worldunion/mini/';
}
config.concernUrl = concernUrl;
//会员
config.register = config.server + 'register';
config.login = config.server + 'login';
config.sendSms = config.server + 'sendsms';
config.checkPhone = config.server + 'checkphone';
config.roleList = config.server + 'role/list';
config.forget = config.server + 'forget';

//活动
config.activityList = config.server + 'activity/list';
config.activityDetail = config.server + 'activity/detail';
config.activityApply = config.server + 'activity/apply';
config.activityScroller = config.server + 'activity/scroller';
config.activityCity = config.server + 'activity/getCity';
config.activityIsApply = config.server + 'activity/isApply';

//用户中心
config.myRole = config.server + 'myrole';
config.myInfo = config.server + 'myinfo';
config.myPassword = config.server + 'mypassword';
config.myAddress = config.server + 'myaddress';
config.myActivity = config.server + 'myactivity';
config.myLoan = config.server + 'myloan';
config.myGift = config.server + 'mygift';
config.myGiftDetail = config.server + 'mygift/detail';
config.myHouse = config.server + 'myhouse';
config.myConversation = config.server + 'myconversation';

//礼品配置
config.giftList = config.server + 'gift/list';
config.giftDetail = config.server + 'gift/detail';
config.giftApply = config.server + 'gift/apply';
config.giftCheck = config.server + 'gift/check';
config.giftAddress = config.server + 'gift/address';
config.giftFirstConcern = config.server + 'gift/firstconcern';

//十爷秀
config.showList = config.server + 'show/list';
config.showDetail = config.server + 'show/detail';

//评论
config.commentList = config.server + 'comment/list';
config.commentCommit = config.server + 'comment/commit';
config.deleteComment = config.server + 'comment/deleteComment';

//家园云贷
config.loanList = config.server + 'loan/list';
config.loanApply = config.server + 'loan/apply';
config.loanIntent = config.server + 'loan/intent'; //意向楼盘

//房源
config.houseList = config.server + 'house/list0';
config.houseDetail = config.server + 'house/detail';
config.houseAlbum = config.server + 'house/album';
config.houseCollect = config.server + 'house/collect';
config.houseVisit = config.server + 'house/visit';
config.houseCheckCollect = config.server + 'house/checkcollect';
config.houseCommentCount = config.server + 'house/commentcount';

//游戏
config.gameInfo = config.server + 'game/info';
config.gameStat = config.server + 'game/stat';
config.gameJoin = config.server + 'game/join';
config.gameGift = config.server + 'game/gift';
config.gameReceive = config.server + 'game/receive';
config.gameOverWin = config.server + 'game/gameOverWin';

//大转盘游戏
config.zhuanpanProcess = config.server + 'zhuanpan/process';
config.zhuanpanWinner = config.server + 'zhuanpan/winner';

// 砸金蛋游戏
config.eggsProcess = config.server + 'goldEggs/process';
config.eggsWinner = config.server + 'goldEggs/winner';

//摇一摇游戏
config.shakeProcess = config.server + 'shake/process';
config.shakeWinner = config.server + 'shake/winner';

//首页
config.homeScroller = config.server + 'home/scroller';

//提示信息
config.tips = {
    server: '爷，服务器异常，请稍后再试～',
    timeout: '爷，请求超时啦，请重试～',
    nodata: '爷，没有数据啦~',
    nomoredata: '爷，没有更多数据啦~',
    loading: '加载中……',
    focus: '请爷扫一扫，关注十爷帮。<span class="wuqrcode"><img src="' + config.image + 'content/images/qr.jpg" alt="" /></span>'
};
