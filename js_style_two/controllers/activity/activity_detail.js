var commitLock = true;
var commitPinglunLock = true; //评论锁
var atUserList; //@人员列表
var obj;
var CommstartIndex = 0;
var CommentPageCount = 10;
//删除评论
function deleteComment(id) {
	var btnArray = ['是', '否'];
	mui.confirm('确认删除此评论?', '确认操作', btnArray, function(e) {
		if (e.index == 0) {
			//确认
			if (!commitPinglunLock) {
				return;
			}
			commitPinglunLock = false;
			var url = 'InsertAComment';
			var param = {
				ID: id,
				masterID: "",
				commentFirst: '',
				commentType: '6',
				type: "delete"
			};
			common.postApi(url, param, function(msg) {
				if (msg.data == "success") {
					$("#P" + id).html("该条评论已删除");
					$("#delete" + id).remove();
				}
				commitPinglunLock = true;
			}, 'json');
		} else {
			return;
		}
	});

}
//$("#cancel").hide();
//$("#gameOver").hide();
mui.plusReady(function() {

	mui.back = function() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	};
	var count = 0;
	mui.previewImage();
	//common.showWaiting();
	var ID = common.getQueryString("id");
	common.showWaiting(true);
	showMsg();

	function showMsg() {

		var html = '<li class="alapply_name" name="alapply_name">' + '<img src="@Avatar"/>' + '<label>@UserName</label>' + '</li>';
		//		var htmlHide = '<li class="alapply_name h" name="alapply_name">' + '<img src="@Avatar"/>' + '<label>@UserName</label>' + '</li>';
		var data = {
			ID: ID,
			type: 'getActivityDetital',
			strWhere: '',
			starIndex: '',
			endIndex: '',
		};
		document.getElementById("UserList").innerHTML = '';
		document.getElementById("AContext").innerHTML = '';
		common.postApi('GetActivity', data, function(response) {
			dataArray = eval(response.data);
			var isEnd = false; //是否结束活动
			var isMe = false; //是否自己发布
			var issign = false; //是否报名
			var redCount = 0;
			var BMUserCount = 0;
			var BMUserAllCount = 0;
			var conText = '';
			var BMUser = '';

			for (var i = 0; i < dataArray[0].length; i++) {
				var obj = dataArray[0][i];
				document.getElementById("ReleaseDateTime").innerText = DateFormat(getDateTimeStamp(obj.ReleaseDateTime.substring(0, 19)), 'yyyy-MM-dd 星期W HH:mm');
				document.getElementById("Start_end_Time").innerText = obj.StartTime + '~' + obj.EndTime;
				document.getElementById("ReleaseName").innerText = obj.ReleaseName;
				document.getElementById("ATheme").innerText = obj.ATheme;
				conText = obj.AContext;
				document.getElementById("SignUpEndTime").innerText = '报名截至：' + obj.SignUpEndTime.substring(0, 10);
				document.getElementById("AAdress").innerText = obj.AAdress;
				BMUserAllCount = parseInt(obj.ASum);
				if (obj.ReleaseName == getUserInfo().UserName) {
					isMe = true;
				}
				if (obj.ISEnd == '1') {
					isEnd = true;
				}
			}
			count = dataArray[1].length;
			for (var n = 0; n < dataArray[1].length; n++) {
				var obj = dataArray[1][n];
				//				if (n < 4) {
				document.getElementById("UserList").innerHTML += html.replace('@Avatar', obj.Avatar).replace('@UserName', obj.UserName);
				//				} else {
				//					document.getElementById("UserList").innerHTML += htmlHide.replace('@Avatar', obj.Avatar).replace('@UserName', obj.UserName);
				//				}
				if (obj.UserId == getUserInfo().UserId) {
					issign = true;
				}
			}
			for (var t = 0; t < dataArray[2].length; t++) {
				var obj = dataArray[2][t];
				document.getElementById("AContext").innerHTML += '<img src="' + obj.PicURL + '" data-preview-src="" data-preview-group="1"/>';
			}
			redCount = dataArray[3].length;
			document.getElementById("AContext").innerHTML += conText;
			BMUserCount = dataArray[1].length;

			//--判断开始
			//			if(判断是否结束){
			//				//结束逻辑
			//			}else{
			//				//未结束逻辑
			//				if（判断是否是本人）{
			//					//是本人发布,显示结束按钮
			//				}
			//				if(当前人是否报名了){
			//					//已经报名，显示取消报名按钮
			//				}else{
			//					//未报名 开始逻辑
			//					if(当前报名人数是否达到了上线){
			//						//已经满了，显示已达上线
			//					}else{
			//						//显示报名按钮
			//					}
			//				}
			//			}
			//			//--判断结束
			//			

			//活动是否结束
			if (isEnd) {
				$("#cancel").hide();
				$("#signUp").hide();
				$("#gameOver").show();
			} else {
				if (isMe) {
					$("#cancel").show();
				}
				if (issign) {
					$("#signUp").show();
					document.getElementById("signUp").innerText = '取消报名';
				} else {
					if (BMUserAllCount == 0) {
						$("#signUp").show();
						document.getElementById("signUp").innerText = '我要报名';
					} else if (BMUserCount >= BMUserAllCount) {
						$("#gameOver").show();
						document.getElementById("gameOver").innerText = '已达上限';
					} else {
						$("#signUp").show();
						document.getElementById("signUp").innerText = '我要报名';
					}
				}

				//				if (BMUserAllCount == 0) {
				//					//是否是自己发布的
				//					if (isMe) {
				//						$("#cancel").show();
				//						$("#signUp").show();
				//						$("#gameOver").hide();
				//					} else {
				//						$("#cancel").hide();
				//						$("#signUp").show();
				//						$("#gameOver").hide();
				//					}
				//					//alert(issign);
				//					//是否报名
				//					if (issign) {
				//						document.getElementById("signUp").innerText = '取消报名';
				//					} else {
				//						document.getElementById("signUp").innerText = '我要报名';
				//					}
				//				} else {
				//					if (BMUserCount >= BMUserAllCount) {
				//						$("#cancel").hide();
				//						$("#signUp").hide();
				//						$("#gameOver").show();
				//						document.getElementById("gameOver").innerText = '已达上限';
				//					} else {
				//						//是否是自己发布的
				//						if (isMe) {
				//							$("#cancel").show();
				//							$("#signUp").show();
				//							$("#gameOver").hide();
				//						} else {
				//							$("#cancel").hide();
				//							$("#signUp").show();
				//							$("#gameOver").hide();
				//						}
				//						//是否报名
				//						if (issign) {
				//							document.getElementById("signUp").innerText = '取消报名';
				//						} else {
				//							document.getElementById("signUp").innerText = '我要报名';
				//						}
				//					}
				//				}
			}
			document.getElementById("ReadCount").innerText = '已阅读' + redCount + '次';
			document.getElementById("userCount").innerText = '活动已报名(' + dataArray[1].length + '人)';
			common.closeWaiting();
			document.getElementById("comments").innerHTML = '';
			CommstartIndex = 0;
			CommentPageCount = 10;
			FetPinglunList();
		}, 'json');
	}
	mui(".active_apply_btn").on("tap", '.btn_woapply', function() {
		common.showWaiting(true);
		var sigup = document.getElementById("signUp").innerText;
		var status = '';
		switch (sigup) {
			case "我要报名":
				status = 'BaoMing';
				break;
			case "取消报名":
				status = 'QuXiaoBaoMing';
				break;
			default:
				break;
		}
		signUp(status);
	});
	mui(".active_apply_btn").on("tap", '.btn_cnacelpub', function() {
		var btnArray = ['是', '否'];
		mui.confirm('是否结束活动？', '活动报名', btnArray, function(e) {
			if (e.index == 0) {
				signUp('JieShu');
				//document.getElementById("signUp").off("tap");
				mui(".active_apply_btn").off("tap", '.btn_woapply');
			} else {
				return;
			}
		})
	});
	//	var isShow = true;
	//	mui(".activ_apply").on("tap", ".activ_apply_list", function() {
	//		if (isShow) {
	//			var row = 0;
	//			var rowcount = 0;
	//			var rowHeight = 0;
	//			if (count > 4) {
	//				row = count % 4;
	//				rowcount = row * 4;
	//				if (count > rowcount) {
	//					row = row + 1;
	//				}
	//			}
	//			rowHeight = row * 75;
	//			//document.getElementById("UserHeight").style.height = rowHeight;
	//			$("#UserHeight").css('height', rowHeight);
	//			var alapply_name = document.getElementsByName("alapply_name");
	//			if (alapply_name) {
	//				for (var j = 0; j < alapply_name.length; j++) {
	//					alapply_name[j].className = "alapply_name";
	//				}
	//			}
	//			isShow = false;
	//		}else{
	//			$("#UserHeight").css('height', 75);
	//			var alapply_name = document.getElementsByName("alapply_name");
	//			if (alapply_name) {
	//				for (var j = 4; j < alapply_name.length; j++) {
	//					alapply_name[j].className = "alapply_name h";
	//				}
	//			}
	//			isShow = true;
	//		}

	//alert("总数:"+count);
	//	});
	//***************************************************评论*****************************************************
	common.click("fabiao", function() {
		document.getElementById("CommentText").blur();
		commitComment_BtnPinglUN('6');
	});
	var CommtempHtml = '<li class="comment_list">' +
		'<img class="comment_head" src="@headImage" alt="" />' +
		'<div class="comment_name">@commentUser</div>' +
		'<div class="comment_time">@commentTime</div>' +
		'<i class="comment_reply" style="display: none;">回复</i>' +
		'<p class="comment_container">@commentContent</p>' +
		'</li>';
	var currentUserId = getUserInfo().UserId; //当前人 
	//提交评论
	function commitComment_BtnPinglUN(commenttype) {
		if (!commitPinglunLock) {
			return;
		}
		var CommentText = document.getElementById("CommentText").value;
		if (CommentText.trim() == "") {
			return;
		}

		var param = {
			ID: "",
			masterID: ID,
			commentFirst: CommentText,
			commentType: commenttype, //6：活动报名
			type: "insert"
		};
		commitPinglunLock = false;
		common.showWaiting(true);
		common.postApi('InsertAComment', param, function(msg) {
			if (msg.data == "success") {
				commitPinglunLock = true;
				CommstartIndex = 0;
				document.getElementById("comments").innerHTML = "";
				document.getElementById("CommentText").value = "";
				FetPinglunList();
			} else {
				commitPinglunLock = true;
			}
		}, "json");
	}

	//获取评论列表
	function FetPinglunList() {

		if (!commitPinglunLock) {
			return;
		}
		commitPinglunLock = false;
		var param = {
			startIndex: CommstartIndex,
			endIndex: CommentPageCount,
			commentType: "6",
			masterID: ID
		};

		common.postApi('GetAComment', param, function(response) {
			var data = eval(response.data)[0];
			if (data[0]) {
				//document.getElementsByClassName('pub_comment')[0].style.display = 'block';
				allCount = data[0].TotalCount;
				document.getElementsByClassName('comment_title')[0].innerHTML = '评论 (' + allCount + '条)';
				var oddCount = allCount - (CommstartIndex + 10); //没显示的评论数
				if (oddCount > 0) {
					document.getElementById("comment_hint").style.display = 'block';
					document.getElementById("comment_hint").innerHTML = '默认加载10条，其余隐藏<i>显示更多(' + oddCount + '条)';
				} else {
					document.getElementById("comment_hint").style.display = 'none';
				}
			} else {
				//document.getElementsByClassName('pub_comment')[0].style.display = 'none';
				document.getElementById("comment_hint").innerHTML = '暂无评论';
			}

			//输出列表
			for (var i = 0; i < data.length; i++) {
				var temp = CommtempHtml;
				var titleimg = data[i].Avatar;
				if (titleimg == '') {
					titleimg = '../images/testImg.png';
				}

				temp = temp.replace("@headImage", titleimg);
				temp = temp.replace("@commentUser", data[i].UserName);
				temp = temp.replace("@commentTime", getDateDiff(getDateTimeStamp(data[i].CommentTime)));
				temp = temp.replace("@commentContent", data[i].CommentFirst);

				document.getElementById("comments").innerHTML += temp;
			}
			//判断 更多 
			if (oddCount > 0) {
				common.click('comment_hint', FetPinglunList);
				CommstartIndex += 10;
			}
			common.closeWaiting();
			commitPinglunLock = true;
			//emojify.run($('.comment_list')[0]);
		}, 'json');

	}
	var signUpLock = true;

	function signUp(status) {
		if (!signUpLock) {
			return;
		}
		var data = {
			id: common.getQueryString("id"),
			title: '',
			context: '',
			SignUpEndTime: '',
			StartTime: '',
			EndTime: '',
			AAdress: '',
			ImageList: '',
			ASum: '',
			IsHost: '',
			IsHostPic: '',
			userName: '',
			type: 'UpdateBaoMing',
			status: status
		};
		signUpLock = false;
		common.postApi('ActivityManage', data, function(response) {
			if (response.data == "success") {
				showMsg();
				signUpLock = true;
			}
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
	//隐藏表情选择界面
	//	function hideEmojify() {
	//		var plus_btns = $("#plus_btns"),
	//			emoji_list = $("#emoji_list");
	//		plus_btns.hide();
	//		emoji_list.hide();
	//	}
	//***************************************************评论结束*****************************************************

	//返回
	//	common.backOfHideCurrentWebview();
});