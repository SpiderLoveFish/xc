var list = document.getElementById("list");
var QuestionID = '';
var iSAnonymityType = '';
var html = '<i class="ques_tag">问答题</i>@QuestionDescription@urllist';
var 图片 = '<img src="@url" data-preview-src="" data-preview-group="1"/>';
var Anwer = '<li class="comment_list">' +
	'	<img class="comment_head" src="@Avatar" alt="" />' +
	'	<div class="comment_name">@UserName</div>' +
	'	<div class="comment_time">@U_Time</div>' +
	'	<p class="comment_container">@QuestionDaAN</p>' +
	'</li>';
mui.init();
mui.plusReady(function() {
	mui.previewImage();
	QuestionID = common.getQueryString("id");
	iSAnonymityType = common.getQueryString('iSAnonymityType');
	common.showWaiting(true);
	var pic_template = '';
	common.postApi('GetSurveys', {
		ID: QuestionID,
		strWhere: '',
		starIndex: '0',
		endIndex: '1000',
		type: 'getAnwer_Result_WenDa',
	}, function(response) {
		resultData = eval(response.data);
		dataArray0 = resultData[0]; //问题详情

		dataArray1 = resultData[1]; //问题的图片
		var imglist = '';
		for (var i = 0; i < dataArray1.length; i++) {
			var obj = dataArray1[i];
			imglist += 图片.replace('@url', obj.PicURL);
		}
		document.getElementById("QuestionDescription").innerHTML = html.replace('@QuestionDescription', dataArray0[0].QuestionDescription).replace('@urllist', imglist);
		dataArray2 = resultData[2]; //选项详情
		//实名调查:显示人信息
		if (iSAnonymityType == '0') {
			for (var i = 0; i < dataArray2.length; i++) {
				var obj = dataArray2[i];
				list.innerHTML += Anwer.replace('@Avatar', obj.Avatar).replace('@UserName', obj.UserName).replace('@U_Time', getDateDiff(getDateTimeStamp(obj.AnswerTime))).replace('@QuestionDaAN', obj.QuestionDaAN);
			}
		} else {
			for (var i = 0; i < dataArray2.length; i++) {
				var obj = dataArray2[i];
				list.innerHTML += Anwer.replace('@Avatar', '../../images/ScApp/general/placeholdimg/UploadImage.png').replace('@UserName', '匿名').replace('@U_Time', getDateDiff(getDateTimeStamp(obj.AnswerTime))).replace('@QuestionDaAN', obj.QuestionDaAN);
			}
		}
		common.closeWaiting();
	}, 'json');
	//后退键隐藏层
	mui.back = function() {
		currentViewHide();
	}

	function currentViewHide() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		//closeMenu 是C页面自定义事件的名称
		mui.fire(fatherView, 'hideDetailPage', {});
	}
	//---------------------------------------------------  
	// 日期格式化  
	// 格式 YYYY/yyyy/YY/yy 表示年份  
	// MM/M 月份  
	// W/w 星期  
	// dd/DD/d/D 日期  
	// hh/HH/h/H 时间  
	// mm/m 分钟  
	// ss/SS/s/S 秒  
	//alert(DateFormat('YYYY-MM-dd hh:mm 星期w'));
	//---------------------------------------------------  
	function DateFormat(mDate, formatStr) {


		var myDate = new Date(mDate); //正确

		//alert(date.getFullYear());
		var str = formatStr;
		var Week = ['日', '一', '二', '三', '四', '五', '六'];

		str = str.replace(/yyyy|YYYY/, myDate.getFullYear());
		str = str.replace(/yy|YY/, (myDate.getYear() % 100) > 9 ? (myDate.getYear() % 100).toString() : '0' + (myDate.getYear() % 100));

		str = str.replace(/MM/, parseInt(myDate.getMonth()) + 1 > 9 ? (parseInt(myDate.getMonth()) + 1).toString() : '0' + (parseInt(myDate.getMonth()) + 1));
		str = str.replace(/M/g, parseInt(myDate.getMonth()) + 1);

		str = str.replace(/w|W/g, Week[myDate.getDay()]);

		str = str.replace(/dd|DD/, myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate());
		str = str.replace(/d|D/g, myDate.getDate());

		str = str.replace(/hh|HH/, myDate.getHours() > 9 ? myDate.getHours().toString() : '0' + myDate.getHours());
		str = str.replace(/h|H/g, myDate.getHours());
		str = str.replace(/mm/, myDate.getMinutes() > 9 ? myDate.getMinutes().toString() : '0' + myDate.getMinutes());
		str = str.replace(/m/g, myDate.getMinutes());

		str = str.replace(/ss|SS/, myDate.getSeconds() > 9 ? myDate.getSeconds().toString() : '0' + myDate.getSeconds());
		str = str.replace(/s|S/g, myDate.getSeconds());

		return str;
	}

	function strformatdata(str) {
		str = str.replace(/-/g, "/");
		var date = new Date(str);
		return date;
	}
});