var id;
var showMenu = false;
var isToUser = true; //是否点击的负责人,false为相关人
var toUserArray; //负责人userid列表
var ccUserArray; //相关人userid列表
var toUserList; //负责人对象列表
var ccUserList; //相关人对象列表
var isEdit = false;

//$(function() {
//	//弹窗
//	$(".btn-agree").click(function() {
//		$("#diolog_shade").show();
//		$("#diolog_agree").show();
//	});
//	$(".btn-refuse").click(function() {
//		$("#diolog_shade").show();
//		$("#diolog_refuse").show();
//	});
//	$(".choose_other_allow").click(function() {
//		$("#diolog_shade").show();
//		$("#other_diolog").show();
//	});
//	$(".choose_eat_allow").click(function() {
//		$("#diolog_shade").show();
//		$("#eat_diolog").show();
//	});
//
//	function oClose() {
//		$("#diolog_shade").hide();
//		$("#diolog_agree").hide();
//		$("#diolog_refuse").hide();
//		$("#other_diolog").hide();
//		$("#eat_diolog").hide();
//	});
//})



mask = mui.createMask(_closeMenu);
mui.init();
//plusReady事件后，自动创建menu窗口；
document.getElementById("icon-toUser").addEventListener('tap', function() {
	userListInit(toUserArray);
	openMenu();
	isToUser = true;
});
document.getElementById("icon-ccUser").addEventListener('tap', function() {
	userListInit(ccUserArray);
	openMenu();
	isToUser = false;
});
//自定义事件 传入用户userid集合到UserList页面
function userListInit(userList) {
	mui.fire(menu, 'userListInit', {
		userList: userList
	});
}
/**
 * 显示菜单菜单
 */

function openMenu() {
	if (!showMenu) {
		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		menu.show('none', 0, function() {
			menu.setStyle({
				left: '0%',
				transition: {
					duration: 150
				}
			});
		});
		//显示遮罩
		mask.show();
		showMenu = true;
	}
}
/**
 * 关闭侧滑菜单（业务部分）
 */

function _closeMenu() {
	if (showMenu) {
		//关闭遮罩；
		//主窗体开始侧滑；
		menu.setStyle({
			left: '100%',
			transition: {
				duration: 150
			}
		});
		setTimeout(function() {
			menu.hide();
		}, 200);
		//改变标志位
		showMenu = false;
	}
}

//**************************************用户列表切换及数据交换start*************************************
mui.plusReady(function() {
	common.showWaiting(true);
	main = plus.webview.currentWebview();
	//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
	setTimeout(function() {
		//侧滑菜单默认隐藏，这样可以节省内存；
		menu = mui.preload({
			id: 'user_list',
			url: '/view/common/user_list.html',
			styles: {
				left: 0,
				width: '100%',
				zindex: 9997
			}
		});
	}, 300);
	// transData是自定义事件的名称，由其他页面通过 mui.fire 触发
	// transDataHandler 是处理自定义事件的函数名称 ，名字自己随便写
	window.addEventListener('transData', transDataHandler);
	//自定义事件处理逻辑 event参数不能少 
	function transDataHandler(event) {
		//获取从B页面传过来的数据
		mask.close();
		var tableview = eval(event.detail.tableview);
		var template = "<i>@name</i>";
		var toUser = document.getElementById("toUser");
		var ccUser = document.getElementById("ccUser");
		if (isToUser) {
			toUserArray = new Array();
			toUserList = new Array(); //负责人对象列表
			toUser.innerHTML = "";
			//选择的负责人
			for (var i = 0; i < tableview.length; i++) {
				var obj = tableview[i];
				toUserArray.push(obj.UserId);
				toUser.innerHTML += template.replace("@name", obj.UserName + ' ');
				toUserList.push(obj.UserId + "|" + obj.UserName);
			}
		} else {
			ccUserArray = new Array();
			ccUserList = new Array(); //相关人对象列表
			ccUser.innerHTML = "";
			//选择的相关人
			for (var i = 0; i < tableview.length; i++) {
				var obj = tableview[i];
				ccUserArray.push(obj.UserId);
				ccUser.innerHTML += template.replace("@name", obj.UserName + ' ');
				ccUserList.push(obj.UserId + "|" + obj.UserName);
			}
		}
	}
	//自定义事件 关闭menu层
	window.addEventListener('closeMenu', closeMenuHandler);

	function closeMenuHandler(event) {
		//获取从B页面传过来的数据
		mask.close();
	}
	//返回
	common.backOfHideCurrentWebview();

	//**************************************用户列表切换及数据交换end*************************************

	var commitLock = true;
	var status;
	//提交
	common.click("btnSubmit", function() {
		status = "1";
		insertWork();
	});
	var isFeed = '1'; //餐补
	var isTraffic = '0'; //交补
	var other = ''; //其他补
	var remark = ''; //备注
	//*********************************************页面初始化start*********************************************

	//绑定下拉列表
	common.setDropdownList("sltProject", "3");
	//加班日期
	var pickDateBtnClick = document.getElementById("pickDateBtnClick");
	var pickDateBtn = document.getElementById("pickDateBtn");
	pickDateBtnClick.addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				var d = e.date;
				pickDateBtn.innerText = pickDateBtn.value = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			}, function(e) {
				//pickDateBtn.innerText = "请选择日期";
			}, {
				title: "请选择日期"
			});
		})
		//开始时间 时间
	var pickTimeBtn = document.getElementById("pickTimeBtn");
	pickTimeBtn.addEventListener('tap', function() {
		var dTime = new Date();
		dTime.setHours(19, 0);
		plus.nativeUI.pickTime(function(e) {
			var d = e.date;
			var minute;
			if (d.getMinutes() < 10) {
				minute = "0" + d.getMinutes();
			} else {
				minute = d.getMinutes();
			}
			pickTimeBtn.innerText = pickTimeBtn.value = d.getHours() + ":" + minute;
		}, function(e) {
			//pickTimeBtn.innerText = "请选择时间"
		}, {
			title: "请选择时间",
			is24Hour: true,
			time: dTime
		});
	});
	var pickTimeBtnEnd = document.getElementById("pickTimeBtnEnd");
	pickTimeBtnEnd.addEventListener('tap', function() {
		var dTime = new Date();
		dTime.setHours(21, 0);
		plus.nativeUI.pickTime(function(e) {
			var d = e.date;
			var minute;
			if (d.getMinutes() < 10) {
				minute = "0" + d.getMinutes();
			} else {
				minute = d.getMinutes();
			}
			pickTimeBtnEnd.innerText = pickTimeBtnEnd.value = d.getHours() + ":" + minute;
		}, function(e) {
			//pickTimeBtnEnd.innerText = "请选择时间"
		}, {
			title: "请选择时间",
			is24Hour: true,
			time: dTime
		});

	});
	//获取填写小时焦点
	function getHourFocus() {
		if (pickTimeBtnEnd.innerText && pickTimeBtn.innerText) {
			document.getElementById("workHour").focus();
		}
	}

	//	$(".choose_other_allow").click(function() {
	//		$("#diolog_shade").show();
	//		$("#other_diolog").show();
	//	})
	$(".choose_eat_allow").click(function() {
		$("#diolog_shade").show();
		$("#eat_diolog").show();
	})
	$('.oClose').click(function() {
		oClose();
	})

	function oClose() {
		$("#diolog_shade").hide();
		$("#diolog_agree").hide();
		$("#diolog_refuse").hide();
		//$("#other_diolog").hide();
		$("#eat_diolog").hide();
	}

	//用餐补助点击
	var pNone = document.getElementById("pNone");
	var pOne = document.getElementById("pOne");
	var pTwo = document.getElementById("pTwo");
	$("#pNone").click(function() {
		isFeed = '0';
		pNone.className = 'choose_eattime';
		pOne.className = '';
		pTwo.className = '';
		$('#iEat').attr('class', '');
		oClose();
	});
	$("#pOne").click(function() {
		isFeed = '1';
		pNone.className = '';
		pOne.className = 'choose_eattime';
		pTwo.className = '';
		$('#iEat').attr('class', 'selective');
		$('#iEat').html('1');
		oClose();
	});
	$('#pTwo').click(function() {
		isFeed = '2';
		pNone.className = '';
		pOne.className = '';
		pTwo.className = 'choose_eattime';
		$('#iEat').attr('class', 'selective');
		$('#iEat').html('2');
		oClose();
	});
	//交通补助
	var divTraffic = document.getElementById("divTraffic");
	divTraffic.addEventListener('tap', function() {
		if ($('#iTraffic').attr('class') == 'selective') {
			isTraffic = '0';
			$('#iTraffic').attr("class", '');
			$('#iTraffic').html('');
		} else {
			isTraffic = '1';
			$('#iTraffic').attr("class", 'selective');
			$('#iTraffic').html('✔');
		}
	});
	//其他补助 确认
	//	$('#divConfirm').click(function() {
	//		other = $('#otherRmb').val();
	//		//		if (other) {
	//		//			var pattern = /^[0-9]*[1-9][0-9]*$/;
	//		//			var flag = pattern.test(other);
	//		//
	//		//			if (!flag) {
	//		//				common.alert('补助金额不符合规范');
	//		//				return;
	//		//			}
	//		//		}
	//		remark = $('#remark').val();
	//		if ($('#otherRmb').val() || $('#remark').val()) {
	//			$('#iOther').attr('class', 'selective');
	//			$('#iOther').html('✔');
	//		} else {
	//			$('#iOther').attr('class', '');
	//			$('#iOther').html('');
	//		}
	//		oClose();
	//	});
	//*********************************************页面初始化end*********************************************

	//***********************************************新增入库start*******************************************
	function insertWork() {
		if (!commitLock) {
			return;
		}
		remark = $('#remark').val();
		var workProject = common.textValiAlert(document.getElementById("sltProject").value, "请选择项目");
		if (!workProject) {
			return;
		}
		var workType = common.textValiAlert(document.getElementById("sltWorkType").value, "请选择加班类型");
		if (!workType) {
			return;
		}
		var workContent = common.textValiAlert(document.getElementById("workContent").value, "请输入加班内容");
		if (!workContent) {
			return;
		}
		var pickDateBtn = document.getElementById("pickDateBtn").innerHTML;
		if (pickDateBtn == "请选择日期") {
			alert("请选择加班日期");
			return;
		}
		var pickTimeBtn = document.getElementById("pickTimeBtn").innerHTML;
		if (pickTimeBtn == "开始时间") {
			alert("请填写开始时间");
			return;
		}
		var pickTimeBtnEnd = document.getElementById("pickTimeBtnEnd").innerHTML;
		if (pickTimeBtnEnd == "结束时间") {
			alert("请填写结束时间");
			return;
		}
		var workHour = common.floatValiAlert(document.getElementById("workHour").value, "加班小时数不符合规范");
		if (!workHour) {
			return;
		}
		//负责人逻辑判断
		if (!toUserArray || toUserArray.length <= 0) {
			alert("请选择负责人..");
			return;
		}
		if (ccUserArray) {
			for (var i = 0; i < ccUserArray.length; i++) {
				var userId = ccUserArray[i];
				if (toUserArray.indexOf(userId) >= 0) {
					alert("负责人和相关人不能为同一个人..");
					return;
				}
			}
		}
		if (toUserArray.indexOf(getUserInfo().UserId) >= 0) {
			alert("你不能为负责人..");
			return;
		}

		var strToUser = "[";
		var strCcUser = "[";
		for (var i = 0; i < toUserList.length; i++) {
			strToUser += "\"" + toUserList[i] + "\",";
		}
		strToUser = strToUser.substring(0, strToUser.length - 1);
		if (ccUserList) {
			for (var n = 0; n < ccUserList.length; n++) {
				strCcUser += "\"" + ccUserList[n] + "\",";
			}
			strCcUser = strCcUser.substring(0, strCcUser.length - 1);
		}
		strToUser += "]";
		strCcUser += "]";
		var type = "insert";
		//推送消息后跳转 参与未审批
		var argu = "{'vid':'work','pid':'1'}"; //推送接收参数
		var pushTitle = getUserInfo().UserName + "申请了加班:" + '平日加班';
		//sltProject.options[sltProject.selectedIndex].text
		var data = {
			id: id,
			type: type,
			status: status,
			approveOrder: 0,
			ImageList: '',
			workType: workType, //workType, //类型
			workProject: workProject, //workProject, //项目
			workContent: workContent, //workContent, //加班内容
			pickDateBtn: pickDateBtn, //pickDateBtn, //加班日期
			pickTimeBtn: pickTimeBtn, //pickTimeBtn, //开始时间
			pickTimeBtnEnd: pickTimeBtnEnd, //pickTimeBtnEnd, //截止时间
			workHour: workHour, //workHour, //请假小时数
			isFeed: isFeed, //isFeed,
			isTraffic: isTraffic, //isTraffic,
			other: other, //other, 
			remark1: remark, //remark,s
			hidToUser: strToUser, //负责人
			hidCcUser: strCcUser, //相关人
			pushTitle: pushTitle,
			pushContent: workContent,
			param: argu
		};
		commitLock = false;
		common.showWaiting();
		common.postApi("WorkManage", data, function(response) {
			if (response.data == "success") {
				common.toast("提交成功，自动跳转到列表界面..");
				go('getWorkList', status);
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}

	function go(type, status) {
		var listWebview = plus.webview.currentWebview();
		listWebview.loadURL('../list/list_launched.html');
	}

	//***********************************************新增入库end*******************************************
	function alert(alertMsg) {
		mui.alert(alertMsg, "提示");
	};
});