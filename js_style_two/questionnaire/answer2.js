var list = document.getElementById("list");
var QuestionID = '';
var iSAnonymityType = '';
var html = '<i class="ques_tag">单选题</i>@QuestionDescription@urllist';
var 图片 = '<img src="@url" data-preview-src="" data-preview-group="1"/>';
var template = '' +
	'<div class="ques_result_answer">' +
	'	<div class="ques_option">@index.@Answer@urllist<i class="choose_peop_num">(@count人选择)</i><i id="@ID"></i></div>' +
	'	<div class="ques_option_per">' +
	'		<ul>@templateUser</ul>' +
	'	</div>' +
	'</div>';
var templateUser = '' +
	'<li class="alapply_name">' +
	'	<img src="@Avatar">' +
	'	<label>@UserName</label>' +
	'</li>';


var UserCount = new Array();
mui.init();
mui.plusReady(function() {
	mui.previewImage();
	common.showWaiting(true);
	QuestionID = common.getQueryString("id");
	iSAnonymityType = common.getQueryString('iSAnonymityType');
	var pic_template = '';
	common.postApi('GetSurveys', {
		ID: QuestionID,
		strWhere: '',
		starIndex: '0',
		endIndex: '10',
		type: 'getAnwer_Result_XuanZeTi',
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
		dataArray3 = resultData[3]; //选项图片详情
		dataArray4 = resultData[4]; //选择人员详情

		for (var i = 0; i < dataArray2.length; i++) {
			var obj = dataArray2[i];
			var QuestionImgList = '';
			var QuestionUserList = '';
			var QuestionUserCount = 0;
			var ItemList = template.replace('@index', i + 1).replace('@Answer', obj.Answer).replace('@ID', obj.ID);
			for (var j = 0; j < dataArray3.length; j++) {
				var obj3 = dataArray3[j];
				if (obj3.MasterID == obj.ID) {
					QuestionImgList += 图片.replace('@url', obj3.PicURL);
				}
			}
			ItemList = ItemList.replace('@urllist', QuestionImgList);

			//实名调查:显示人信息
			if (iSAnonymityType == '0') {
				for (var j = 0; j < dataArray4.length; j++) {
					var obj4 = dataArray4[j];
					if (obj4.QuestionItemsID == obj.ID) {
						QuestionUserList += templateUser.replace('@Avatar', obj4.Avatar).replace('@UserName', obj4.UserName);
						QuestionUserCount++;
					}
				}
			} else {
				for (var j = 0; j < dataArray4.length; j++) {
					var obj4 = dataArray4[j];
					if (obj4.QuestionItemsID == obj.ID) {
						QuestionUserCount++;
					}
				}
			}


			var UserModel = new Object();
			UserModel.ID = obj.ID;
			UserModel.Count = QuestionUserCount;
			UserCount.push(UserModel);


			ItemList = ItemList.replace('@count', QuestionUserCount).replace('@templateUser', QuestionUserList);
			list.innerHTML += ItemList;
		}
		var MaxCount = 0;
		var MaxID = '';
		for (var j = 0; j < UserCount.length; j++) {
			var obj = UserCount[j];
			if (obj.Count > MaxCount) {
				MaxCount = obj.Count;
				MaxID = obj.ID;
			}
		}
		if (MaxID) {
			document.getElementById(MaxID).className = "theMore";
			document.getElementById(MaxID).innerHTML = '最多';
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
});