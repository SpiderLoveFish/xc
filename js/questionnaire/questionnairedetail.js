var masterid = '';
var iSAnonymityType = '';
var list = document.getElementById("list");
var QuestionList = new Array();
mui.init();
mui.plusReady(function() {
	mui.back = function() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	};
	masterid = common.getQueryString("id");
	document.getElementById("selectquestionlist").addEventListener('tap', function() {
		var webview = common.getTemplate('page2');
		webview.loadURL('questionlist.html?id=' + masterid + '&iSAnonymityType=' + iSAnonymityType);
	});
	document.getElementById("commit").addEventListener('tap', function() {
		common.showWaiting();
		var TB_SurveysUser_AnwerList = new Array();

		for (var i = 0; i < QuestionList.length; i++) {
			var Question_Model = QuestionList[i];
			if (Question_Model.Type_String == "3") {
				if ($("textarea[name='" + Question_Model.ID + "']").val().trim() == "") {
					window.location.href = "#" + Question_Model.ID;
					common.closeWaiting();
					return;
				}
				var TB_SurveysUser_Anwer = new Object();
				TB_SurveysUser_Anwer.SurveysID = masterid;
				TB_SurveysUser_Anwer.QuestionMasterID = Question_Model.ID;
				TB_SurveysUser_Anwer.QuestionItemsID = 0;
				TB_SurveysUser_Anwer.QuestionDaAN = $("textarea[name='" + Question_Model.ID + "']").val();
				TB_SurveysUser_AnwerList.push(TB_SurveysUser_Anwer);
			} else if (Question_Model.Type_String == "1") {
				var itemid = $("input[name='" + Question_Model.ID + "']:checked").val();
				if (itemid == "" || itemid == null || itemid == "undefined") {
					window.location.href = "#" + Question_Model.ID;
					common.closeWaiting();
					return;
				}
				var TB_SurveysUser_Anwer = new Object();
				TB_SurveysUser_Anwer.SurveysID = masterid;
				TB_SurveysUser_Anwer.QuestionMasterID = Question_Model.ID;
				TB_SurveysUser_Anwer.QuestionItemsID = itemid;
				TB_SurveysUser_Anwer.QuestionDaAN = "";
				TB_SurveysUser_AnwerList.push(TB_SurveysUser_Anwer);

			} else if (Question_Model.Type_String == "2") {
				var checkboxList = $("input[name='" + Question_Model.ID + "']:checked");

				if (checkboxList.length == 0) {
					window.location.href = "#" + Question_Model.ID;
					common.closeWaiting();
					return;
				}
				for (var a = 0; a < checkboxList.length; a++) {
					var TB_SurveysUser_Anwer = new Object();
					TB_SurveysUser_Anwer.SurveysID = masterid;
					TB_SurveysUser_Anwer.QuestionMasterID = Question_Model.ID;
					TB_SurveysUser_Anwer.QuestionItemsID = $($(checkboxList[a])).val();
					TB_SurveysUser_Anwer.QuestionDaAN = "";
					TB_SurveysUser_AnwerList.push(TB_SurveysUser_Anwer);
				}
			}

		}

		common.postApi('SurveysManage', {
			surveysJson: JSON.stringify(TB_SurveysUser_AnwerList),
		}, function(response) {
			if (response.data == "success") {
				common.toast('提交成功');
				var fatherView = plus.webview.currentWebview().opener(); //父页面
				mui.fire(fatherView, 'refresh1', {});
				common.currentWebviewHide();
			} else {
				common.toast('服务器异常，请稍候重试..');
			}
			common.closeWaiting();
		}, 'json');
	});
	mui.previewImage();

	common.showWaiting(true);
	common.postApi('GetSurveys', {
		ID: masterid,
		strWhere: '',
		starIndex: '',
		endIndex: '',
		type: 'getSurveysDetital',
	}, function(response) {
		resultData = eval(response.data);
		dataArray = resultData[0];
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			document.getElementById("ReleaseTime").innerHTML = DateFormat(getDateTimeStamp(obj.ReleaseTime), 'yyyy-MM-dd 星期W HH:mm');
			document.getElementById("STheme").innerHTML = obj.STheme;
			document.getElementById("EndTime").innerHTML = '参与截至:' + obj.EndTime;
			document.getElementById("ReleaseName").innerHTML = obj.ReleaseName;
			document.getElementById("SContext").innerHTML = obj.SContext;
			document.getElementById("surveyscount").innerHTML = resultData[3].length;
			document.getElementById("ISAnonymityType").innerHTML = obj.ISAnonymityType == '0' ? '实名调查' : '匿名调查';
			iSAnonymityType = obj.ISAnonymityType;
			document.getElementById("SendType").innerHTML = obj.SendType == '0' ? '全公司' : '特定对象';
			document.getElementById("ISLookOverTpye").innerHTML = obj.ISLookOverTpye == '0' ? '仅发布者' : '参与人可查看';
			document.getElementById("canyusum").innerHTML = '已参与人数:' + resultData[2].length + '/' + resultData[1].length + '次';
			if (obj.ISLookOverTpye == '0') {
				document.getElementById("selectquestionlist").style.display = "none";
			} else {
				document.getElementById("selectquestionlist").style.display = "block";
			}

		}
		if (dataArray[0].ISEnd == '1') {
			common.closeWaiting();
			return;
		}
		for (var i = 0; i < resultData[2].length; i++) {
			var obj = resultData[2][i];
			if (obj.UserId == getUserInfo().UserId) {
				common.closeWaiting();
				return;
			}
		}
		document.getElementsByClassName("ques_detail")[0].style.display = "block";
		getsurveysquestion_master();
	}, 'json');
});
var 问答题 = '<div class="ques_detail_wenda"  id="@QuestionID">' +
	'	<p>' +
	'		@index.<i class="ques_tag">问答题</i>@QuestionDescription@urllist' +
	'	</p>' +
	'	<textarea name="@QuestionID" rows="" cols="" placeholder="在此输入您的回答"></textarea>' +
	'</div>';

var 单选题 = '<div class="ques_detail_radio"  id="@QuestionID">' +
	'	<p>' +
	'		@index.<i class="ques_tag">单选题</i>@QuestionDescription@urllist' +
	'	</p>' +
	'@option' +
	'</div>';

var 单选选项 = '<div class="mui-input-row mui-radio mui-left">' +
	'<input name="@QuestionID" type="radio" value="@optionId" id="@optionId"/>' +
	'<label>@optionName@urllist</label>' +
	'</div>';

var 多选题 = '<div class="ques_detail_checkbox" id="@QuestionID">' +
	'	<p>' +
	'		@index.<i class="ques_tag">多选题</i>@QuestionDescription@urllist' +
	'	</p>' +
	'@option' +
	'</div>';

var 多选选项 = '<div class="mui-input-row mui-checkbox mui-left" >' +
	'<input name="@QuestionID" value="@optionId" type="checkbox"  id="@optionId"/>' +
	'<label>@optionName@urllist</label>' +
	'</div>';



var 图片 = '<img src="@url" data-preview-src="" data-preview-group="1"/>';



function getsurveysquestion_master() {
	common.postApi('GetSurveys', {
		ID: masterid,
		strWhere: '',
		starIndex: '',
		endIndex: '',
		type: 'getSurveysQuestion_List',
	}, function(response) {

		resultData = eval(response.data);
		dataArray = resultData[0];
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			var QuestionID = obj.QuestionID;

			var Question_Model = new Object();
			Question_Model.ID = QuestionID;
			Question_Model.Type_String = obj.QuestionType;
			QuestionList.push(Question_Model);

			if (obj.QuestionType == '1') {
				var html = 单选题.replaceAll('@QuestionID', obj.QuestionID).replaceAll('@index', i + 1).replaceAll('@QuestionDescription', obj.QuestionDescription);
				var optionList = "";
				var Question_Img_List = '';
				for (var j = 0; j < resultData[1].length; j++) {
					var items = resultData[1][j];
					var Option_Img_List = '';
					if (QuestionID == items.QuestionID) {
						optionList += 单选选项.replaceAll('@optionId', items.ID).replaceAll('@QuestionID', QuestionID).replaceAll('@optionName', items.Answer);
					}
					for (var k = 0; k < resultData[2].length; k++) {
						var items1 = resultData[2][k];
						if (items.ID == items1.MasterID) {
							Option_Img_List += 图片.replaceAll('@url', items1.PicURL);
						}
					}
					optionList = optionList.replaceAll('@urllist', Option_Img_List);
				}
				for (var j = 0; j < resultData[2].length; j++) {
					var items = resultData[2][j];
					if (items.MasterID == QuestionID) {
						Question_Img_List += 图片.replaceAll('@url', items.PicURL);
					}
				}
				html = html.replaceAll('@urllist', Question_Img_List).replaceAll('@option', optionList);
				list.innerHTML += html;
			} else if (obj.QuestionType == '2') {
				var html = 多选题.replaceAll('@QuestionID', obj.QuestionID).replaceAll('@index', i + 1).replaceAll('@QuestionDescription', obj.QuestionDescription);
				var optionList = "";
				var Question_Img_List = '';
				for (var j = 0; j < resultData[1].length; j++) {
					var items = resultData[1][j];
					var Option_Img_List = '';
					if (QuestionID == items.QuestionID) {
						optionList += 多选选项.replaceAll('@optionId', items.ID).replaceAll('@QuestionID', QuestionID).replaceAll('@optionName', items.Answer);
					}
					for (var k = 0; k < resultData[2].length; k++) {
						var items1 = resultData[2][k];
						if (items.ID == items1.MasterID) {
							Option_Img_List += 图片.replaceAll('@url', items1.PicURL);
						}
					}
					optionList = optionList.replaceAll('@urllist', Option_Img_List);
				}
				for (var j = 0; j < resultData[2].length; j++) {
					var items = resultData[2][j];
					if (items.MasterID == QuestionID) {
						Question_Img_List += 图片.replaceAll('@url', items.PicURL);
					}
				}
				html = html.replaceAll('@urllist', Question_Img_List).replaceAll('@option', optionList);
				list.innerHTML += html;
			} else {
				var Question_Img_List = '';
				for (var j = 0; j < resultData[2].length; j++) {
					var items = resultData[2][j];
					if (items.MasterID == QuestionID) {
						Question_Img_List += 图片.replaceAll('@url', items.PicURL);
					}
				}
				list.innerHTML += 问答题.replaceAll('@QuestionID', obj.QuestionID).replaceAll('@index', i + 1).replaceAll('@QuestionDescription', obj.QuestionDescription).replaceAll('@urllist', Question_Img_List);


			}
		}
		common.closeWaiting();
	}, 'json');
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