mui.init();
mui.plusReady(function() {
	var chooseRemind = true;
	var id = common.getQueryString('id'); //'ea981030-da93-11e5-8b52-efe3c4edf501'; //
	if (id) {
		var data = {
			ID: id,
			type: 'getScheduleList_Detail',
			StartDate: '',
			EndDate: ''
		}
		common.showWaiting(true);
		common.postApi('GetSchedule', data, function(response) {
			var s = eval(response.data);
			var dataArray = s[0];
			for (var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				document.getElementById("Remark").value = obj.Remark;
				document.getElementById("sltType").value = obj.EventStatus;
				if (obj.IsAllDay == '1') {
					mui("#toggleAllDay").switch().toggle();
				}
				document.getElementById("pickStart").innerText = startDate = obj.StartDate;
				document.getElementById("pickEnd").innerText = endDate = obj.EndDate;
				if (obj.IsOpen == '1') {
					mui("#toggleOpen").switch().toggle();
				}
				if (obj.IsCopy == '1') {
					mui("#isCopy").switch().toggle();
					//抄送人
					var dataArrayCopy = s[1];
					var template = "<i>@name</i>";
					var ccUser = document.getElementById("ccUser");
					ccUserArray = new Array();
					ccUserList = new Array(); //相关人对象列表
					ccUser.innerHTML = "";
					//选择的相关人
					for (var i = 0; i < dataArrayCopy.length; i++) {
						var ob = dataArrayCopy[i];
						ccUserArray.push(ob.CopyUserId);
						ccUser.innerHTML += template.replace("@name", ob.UserName + ' ');
						ccUserList.push(ob.CopyUserId + "|" + ob.UserName);
					}
				}
				if (obj.IsRemind == '1') {
					chooseRemind = false;
					mui("#toggleRemind").switch().toggle();

				}
				//提醒日期
				document.getElementById("pickDateBtn").innerText = remindDate = obj.RemindDate ? obj.RemindDate : '请开启提醒';

			}
			common.closeWaiting();
		}, 'json');
	} else {
		id = '';
	}
	//是否全天
	var isAllDay = '0';
	//是否抄送
	var isCopy = '0';
	//是否公开
	var isOpen = '0';
	//是否提醒
	var isRemind = '0';
	mui('.mui-content #toggleAllDay').each(function() {
		/**
		 * toggle 事件监听
		 */
		this.addEventListener('toggle', function(event) {
			var p = document.getElementById("pickStart").innerText;
			var p2 = document.getElementById("pickEnd").innerText;
			//保存选中状态
			if (event.detail.isActive) {
				isAllDay = '1';
				document.getElementById("pickStart").innerText = startDate = p.substring(0, 9);
				document.getElementById("pickEnd").innerText = endDate = p2.substring(0, 9);
			} else {
				isAllDay = '0';
			}
		});
	});

	mui('.mui-content #toggleOpen').each(function() {
		/**
		 * toggle 事件监听
		 */
		this.addEventListener('toggle', function(event) {
			//保存选中状态
			if (event.detail.isActive) {
				isOpen = '1';
			} else {
				isOpen = '0';
			}
		});
	});

	if (isCopy == '1') {
		document.getElementById("icon-ccUser").classList.remove('h');
	} else {
		document.getElementById("icon-ccUser").classList.add('h');
	}

	mui('.mui-content #isCopy').each(function() {
		/**
		 * toggle 事件监听
		 */
		this.addEventListener('toggle', function(event) {
			//保存选中状态
			if (event.detail.isActive) {
				isCopy = '1';
				document.getElementById("icon-ccUser").classList.remove('h');
			} else {
				isCopy = '0';
				document.getElementById("icon-ccUser").classList.add('h');
			}
		});
	});

	mui('.mui-content #toggleRemind').each(function() {
		/**
		 * toggle 事件监听
		 */
		this.addEventListener('toggle', function(event) {
			//保存选中状态
			if (event.detail.isActive) {
				isRemind = '1';
				if (chooseRemind) {
					//选择提醒日期
					plus.nativeUI.pickDate(function(e) {
						//日期
						var d = e.date;
						remindDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
						//时间
						startTimeChoose(function(time) {
							remindDate += ' ' + time;
							document.getElementById("pickDateBtn").innerText = remindDate;
						}, function() {
							mui("#toggleRemind").switch().toggle();
						});

					}, function(e) {
						mui("#toggleRemind").switch().toggle();
					}, {
						title: "提醒日期"
					});
				}
			} else {
				isRemind = '0';
				document.getElementById("pickDateBtn").innerText = '请开启提醒';
				chooseRemind = true;
			}
		});
	});

	document.getElementById("icon-ccUser").addEventListener('tap', function() {
		userListInit(ccUserArray);
		openMenu();
	});
	var menu = null;
	var showMenu = false;
	var ccUserArray; //相关人userid列表
	mask = mui.createMask(_closeMenu);
	setTimeout(function() {
		//侧滑菜单默认隐藏，这样可以节省内存；
		menu = mui.preload({
			id: 'user_list',
			url: '/view_style_two/common/user_list.html',
			styles: {
				left: '0%',
				width: '100%',
				zindex: 9997
			}
		});
	}, 300);
	var ccUserList = null;
	window.addEventListener('transData', transDataHandler);
	//自定义事件处理逻辑 event参数不能少 
	function transDataHandler(event) {
		//获取从B页面传过来的数据
		mask.close();
		var tableview = eval(event.detail.tableview);
		var template = "<i>@name</i>";
		var ccUser = document.getElementById("ccUser");
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
	//自定义事件 关闭menu层
	window.addEventListener('closeMenu', closeMenuHandler);

	function closeMenuHandler(event) {
		//获取从B页面传过来的数据
		mask.close();
	}

	//自定义事件 传入用户userid集合到UserList页面
	function userListInit(userList) {
		mui.fire(menu, 'userListInit', {
			userList: userList
		});
	}

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


	var startDate, endDate, remindDate = '';
	//请假时间 开始
	var pickStart = document.getElementById("pickStart");
	document.getElementById("pickStartP").addEventListener('tap', function() {
		plus.nativeUI.pickDate(function(e) {
			//开始日期
			var d = e.date;
			startDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			document.getElementById("pickStart").innerText = startDate;
			if (isAllDay == '0') {
				//开始时间
				startTimeChoose(function(time) {
					startDate += ' ' + time;
					document.getElementById("pickStart").innerText = startDate;
				});
			}

		}, function(e) {

		}, {
			title: "开始日期"
		});
	});
	//请假时间 结束
	var pickEnd = document.getElementById("pickEnd");
	document.getElementById("pickEndP").addEventListener('tap', function() {
		plus.nativeUI.pickDate(function(e) {
			//开始日期
			var d = e.date;
			endDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			document.getElementById("pickEnd").innerText = endDate;
			if (isAllDay == '0') {
				//截止时间
				endTimeChoose(function(time) {
					endDate += ' ' + time;
					document.getElementById("pickEnd").innerText = endDate;
				});
			}
		}, function(e) {

		}, {
			title: "截止日期"
		});
	});

	function startTimeChoose(success, error) {
		var dTime = new Date();
		dTime.setHours(9, 0);
		plus.nativeUI.pickTime(function(e) {
			var d = e.date;
			var minute;
			if (d.getMinutes() < 10) {
				minute = "0" + d.getMinutes();
			} else {
				minute = d.getMinutes();
			}
			//成功回调
			success(d.getHours() + ":" + minute);
		}, function(e) {
			if (error) {
				error();
			}
		}, {
			title: "开始时间",
			is24Hour: true,
			time: dTime
		});
	}

	//截止时间选择
	function endTimeChoose(success) {
		var dTime = new Date();
		dTime.setHours(18, 0);
		plus.nativeUI.pickTime(function(e) {
			var d = e.date;
			var minute;
			if (d.getMinutes() < 10) {
				minute = "0" + d.getMinutes();
			} else {
				minute = d.getMinutes();
			}
			success(d.getHours() + ":" + minute);
		}, function(e) {
			//pickTimeBtnEnd.innerText = "请选择时间"
		}, {
			title: "截止时间",
			is24Hour: true,
			time: dTime
		});
	}

	var commitLock = true;
	//提交
	common.click("btnSubmit", function() {
		insertLeave();
	});

	function insertLeave() {
		if (!commitLock) {
			return;
		}
		var EventStatus = document.getElementById("sltType").value;

		var Remark = common.textValiAlert(document.getElementById("Remark").value, "请填写日程备注");
		if (!Remark) {
			return;
		}
		var pickStart = document.getElementById("pickStart").innerHTML;
		if (pickStart == "开始时间") {
			common.alert("请填写开始时间");
			return;
		}
		var pickEnd = document.getElementById("pickEnd").innerHTML;
		if (pickEnd == "结束时间") {
			common.alert("请填写结束时间");
			return;
		}
		if (new Date(endDate) < new Date(startDate)) {
			common.alert("结束时间必须大于开始时间");
			return;
		}
		if (isCopy == '1') {
			if (!ccUserList || ccUserList.length <= 0) {
				common.alert('请选择抄送人');
				return;
			}
		}

		var strCcUser = "[";
		//抄送 isCopy是
		if (ccUserList && isCopy == '1') {
			for (var n = 0; n < ccUserList.length; n++) {
				strCcUser += "\"" + ccUserList[n] + "\",";
			}
			strCcUser = strCcUser.substring(0, strCcUser.length - 1);
		}
		strCcUser += "]";
		var type = "insert";
		var pushTitle = '日程提醒:' + startDate + '-' + endDate;
		var argu = "{'vid':'calendar','pid':'1'}"; //推送接收参数
		var data = {
			id: id,
			type: type,
			Remark: Remark, //日程备注
			EventStatus: EventStatus, //状态
			IsAllDay: isAllDay, //是否全天
			StartDate: startDate, //开始日期
			EndDate: endDate, //结束日期
			IsCopy: isCopy, //是否抄送
			IsOpen: isOpen, //是否公开
			IsRemind: isRemind, //是否提醒
			RemindDate: remindDate, //提醒日期
			hidCcUser: strCcUser, //相关人
			pushTitle: pushTitle,
			pushContent: Remark,
			param: argu
		};
		commitLock = false;
		common.showWaiting();
		common.postApi("ScheduleManage", data, function(response) {
			if (response.data == "success") {
				common.toast("保存成功");
				go();
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}

	function go() {
		common.getTemplate('page2', 'calendar_list.html');
		//common.loadUrl('calendar_list.html');
		setTimeout(function() {
			plus.webview.currentWebview().hide();
		}, 300);
		//		var listWebview = plus.webview.currentWebview();
		//		listWebview.loadURL('calendar_list.html');

	}
	common.backOfHideCurrentWebview();
});