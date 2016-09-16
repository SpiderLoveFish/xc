mui.init();
mui.plusReady(function() {
	var id;
	var showMenu = false;
	var isToUser = true; //是否点击的负责人,false为相关人
	var toUserArray; //负责人userid列表
	var ccUserArray; //相关人userid列表
	var toUserList; //负责人对象列表
	var ccUserList; //相关人对象列表
	var menu = null;

	mask = mui.createMask(_closeMenu);
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
	mui.plusReady(function() {
		var d = new Date();
		document.getElementById("pickDateBtn").innerHTML = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
			//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
		setTimeout(function() {
			//侧滑菜单默认隐藏，这样可以节省内存；
			menu = mui.preload({
				id: 'user_list',
				url: '/view/common/user_list.html',
				styles: {
					left: '0%',
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
	});
	(function(mui) {
		common.showWaiting(true);
		//mui初始化
		mui.init({
			swipeBack: true //启用右滑关闭功能
		});
		//绑定下拉列表
		common.setDropdownList("sltType", "3");

		//开始时间 日期
		var pickDateBtn = document.getElementById("pickDateBtn");
		pickDateBtn.addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				var d = e.date;
				pickDateBtn.innerText = pickDateBtn.value = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			}, function(e) {
				//pickDateBtn.innerText = "请选择日期";
			}, {
				title: "请选择日期"
			});
		});
	})(mui);
	var commitLock = true;
	var status = "0";
	//提交
	common.click("btnSubmit", function() {
		status = "1";
		insertProjectHour();
	});

	function insertProjectHour() {
		if (!commitLock) {
			return;
		}
		var ProjectCode = common.textValiAlert(document.getElementById("sltType").value, "请选择项目");
		if (!ProjectCode) {
			return;
		}
		var WorkDate = common.textValiAlert(document.getElementById("pickDateBtn").innerHTML, "请填写工作日期");
		if (!WorkDate) {
			return;
		}
		var WorkContent = common.textValiAlert(document.getElementById("WorkContent").value, "请填写工作内容");
		if (!WorkContent) {
			return;
		}
		var WorkHour = common.numValiAlert(document.getElementById("WorkHour").value, "基本工时不符合规范");
		if (!WorkHour) {
			return;
		}
		if (WorkHour != 8) {
			common.alert("基本工时必须为8小时");
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
		var pushTitle = getUserInfo().UserName + ":工时填报";
		//推送消息后跳转 参与未审批
		var argu = "{'vid':'projecthour','pid':'1'}"; //推送接收参数
		var data = {
			ProjectCode: ProjectCode,
			WorkHour: WorkHour,
			WorkContent: WorkContent,
			UserName: getUserInfo().UserName,
			WorkDate: WorkDate,
			SendState: '',
			hidToUser: strToUser,
			hidCcUser: strCcUser,
			AddOrUpdate: type,
			id: '',
			pushTitle: pushTitle,
			pushContent: WorkContent,
			param: argu
		};
		commitLock = false;
		common.showWaiting();
		common.postApi("ProjectHourManage", data, function(response) {
			if (response.data == "success") {
				common.toast("提交成功，自动跳转到列表界面..");
				go();
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}

	function go() {
		var listWebview = plus.webview.currentWebview();
		listWebview.loadURL('../list/list_launched.html');

	}

	function alert(alertMsg) {
		mui.alert(alertMsg, "提示");
	};
	//返回
	common.backOfHideCurrentWebview();
});