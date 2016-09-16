mui.init();
var commitLock = true;
var id; //主鍵
var creator;
var isLastApprover;
var approveOpinion = ''; //审批意见
var status; //审批结果状态
var leaveObj;
mui.plusReady(function() {
	//后退键隐藏层
	mui.back = function() {
			currentViewHide();
		}
		// dataInit，由其他页面通过 mui.fire 触发
		// transDataHandler 是处理自定义事件的函数名称 ，名字自己随便写
		//window.addEventListener('dataInit', function(event) {
		//获取从父页面传过来的数据
		//id = event.detail.id;
	id = common.getQueryString("id");
	common.showWaiting(true);
	var jsn = {
		ID: id,
		type: 'getWork_Model',
		startIndex: '',
		endIndex: ''
	};
	common.postApi('GetApprove', jsn, function(response) {
		var s = eval(response.data);
		var dataArray = s[0];
		var obj = leaveObj = dataArray[0];
		//业务数据
		$('#project').text(obj.DictionaryName);
		$('#wookType').text(obj.wookType);
		$('#WorkDate').text(obj.WorkDate + ' ' + obj.WorkStartTime + '~' + obj.WorkEndTime);
		$('#WorkSumHour').text(obj.WorkSumHour + '小时');
		$('#WorkContent').text(obj.WorkContent);
		$('#IsFeed').text(obj.IsFeed ? obj.IsFeed + '次' : '无');
		$('#IsTraffic').text(obj.IsTraffic == '1' ? '有' : '无');
		//$('#Other').text(obj.Other ? obj.Other : '无');
		$('#Mark').text(obj.Remark ? obj.Remark : '无');
		$('#avatar').attr('src', obj.Avatar);
		$('#userName').text(obj.UserName);
		$('#ReleaseTime').text(obj.ReleaseTime);
		if (obj.SendState == '2') {
			$('#approveState').addClass('approve_pass');
			$('#approveState').text('审批通过');
		} else if (obj.SendState == '3') {
			$('#approveState').addClass('approve_notpass');
			$('#approveState').text('未通过');
		} else {
			$('#approveState').addClass('approve_wait');
			$('#approveState').text('等待审批');
		}
		//负责人
		var toObj = s[1];
		//		var leaderHtml = ''; //负责人字符串
		//		for (var i = 0; i < toObj.length; i++) {
		//			var to = toObj[i];
		//			leaderHtml += to.UserName + ' ';
		//		}
		//		$('#workToUser').text(leaderHtml);
		//document.getElementById("leaveToUser").value = leaderHtml; //负责人
		//相关人
		var ccObj = s[2];
		var relatedHtml = ''; //相关人字符串
		if (ccObj.length > 0) {
			for (var i = 0; i < ccObj.length; i++) {
				var cc = ccObj[i];
				relatedHtml += cc.UserName + ' ';
			}
			$('#workCcUser').text(relatedHtml);
		}
		//document.getElementById("leaveCcUser").value = relatedHtml; //相关人

		var jsn = common.getApproveOrderBussiness(obj, toObj, ccObj);
		//alert(JSON.stringify(jsn));
		creator = jsn.creator;

		isLastApprover = jsn.isLastApprover;
		document.getElementById("approveProcess").innerHTML = jsn.approveProcessHtml; //审批过程字符串
		if (jsn.creator == "0") {
			//发起人
			if (toObj[0].ApproveFlag == "0") {
				//第一个审批人没有审批,允许作废单据
				$('.approve_footer').removeClass('h');
				$('#btnBreak').removeClass('h');
			}
		} else if (jsn.creator == "1") {
			//负责人
			if (jsn.canApprove) {
				$('.approve_footer').removeClass('h');
				$('#btnState').removeClass('h');
				$('#btnNopass').removeClass('h');
			}
		}
		common.closeWaiting();
	}, 'json');

	//单据作废
	var btnBreak = document.getElementById("btnBreak");
	btnBreak.addEventListener("tap", function(e) {
		var btnArray = ['是', '否'];
		mui.confirm('单据作废后不可恢复,确认删除?', '确认操作', btnArray, function(e) {
			if (e.index == 0) {
				//确认
				status = "Delete";
				approve();
			} else {
				return;
			}
		});
	});


	var btnState = document.getElementById("btnState");
	//审批通过
	btnState.addEventListener("tap", function(e) {
		if (isLastApprover) {
			//是最后审批人
			status = "AllPass";
		} else {
			status = 'Pass';
		}
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		mui.prompt('请输入你的审批意见：', '同意!', '审批意见', btnArray, function(e) {
			if (e.index == 0) {
				if (e.value) {
					approveOpinion = '审批意见:' + e.value;
				} else {
					approveOpinion = '审批意见:同意!';
				}
				approve();
			}

		});
	});
	var btnNopass = document.getElementById("btnNopass");
	//审批不通过
	btnNopass.addEventListener("tap", function(e) {
		status = 'NoPass';
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['确定', '取消'];
		mui.prompt('请输入你的审批意见：', '不同意!', '审批意见', btnArray, function(e) {
			if (e.index == 0) {
				if (e.value) {
					approveOpinion = '审批意见:' + e.value;
				} else {
					approveOpinion = '审批意见:不同意!';
				}
				approve();
			}
		});
	});
	//审批
	function approve() {
		if (!commitLock) {
			return;
		}
		var argu;
		var pushTitle, pushContent;
		if (status == "Pass") {
			//流转到下一个审批人,点击消息跳转该我审批
			argu = "{'vid':'work','pid':'1'}";
			pushTitle = getUserInfo().UserName + "申请了加班:" + leaveObj.wookType;
			pushContent = leaveObj.WorkContent;
		} else {
			//点击消息跳转我发起的
			argu = "{'vid':'work','pid':'0'}";
			pushTitle = "你申请的加班:" + leaveObj.wookType;
			pushContent = approveOpinion;
		}

		var data = {
			id: id,
			type: 'UpdateAudit',
			status: status,
			approveOrder: 0,
			ImageList: '',
			workType: leaveObj.wookType, //workType, //类型
			workProject: '', //workProject, //项目
			workContent: approveOpinion, //workContent, //加班内容
			pushTitle: pushTitle,
			pushContent: pushContent,
			pickDateBtn: '', //pickDateBtn, //加班日期
			pickTimeBtn: '', //pickTimeBtn, //开始时间
			pickTimeBtnEnd: '', //pickTimeBtnEnd, //截止时间
			workHour: '', //workHour, //请假小时数
			isFeed: '', //isFeed,
			isTraffic: '', //isTraffic,
			other: '', //other,
			remark1: '', //remark,
			hidToUser: '', //负责人
			hidCcUser: '', //相关人
		};
		commitLock = false;
		common.showWaiting();
		common.postApi('WorkManage', data, function(response) {
			if (response.data == "success") {
				//currentViewHide();
				common.toast("提交成功");
				var fatherView = plus.webview.currentWebview().opener(); //父页面
				//closeMenu 是C页面自定义事件的名称
				mui.fire(fatherView, 'reloadfun', {});
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}
	//隐藏当前页面

	function currentViewHide() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		//closeMenu 是C页面自定义事件的名称
		mui.fire(fatherView, 'hideDetailPage', {});
	}

});