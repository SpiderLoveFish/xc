mui.plusReady(function() {
	common.backOfHideCurrentWebview();
	var showMenu = false;
	var UserArray; //负责人userid列表
	var UserList = "";
	var menu = null;
	var ID = common.getQueryString("id"); //获取用户ID
	var selectType = "";
	UserArray = new Array();

	var templateAdd = '<li class="alapply_name" id="btnAdd" > <img  src="../../../images/ScApp/mypage/addUser.png"><label class="add_usergroup">添加</label></li>';
	var template = '<li class="alapply_name"> <img src="../../../images/ScApp/icon/Fuze.png"> <label>@name</label> </li>';
	showUser();

	function showUser() {

		if (ID == null || ID == undefined || ID == '') {
			ID = "";
			selectType = "Insert";
			document.getElementById("toUser").innerHTML += templateAdd;
			document.getElementById("btnAdd").addEventListener('tap', function() {
				document.getElementById("txtGroupName").blur();
				userListInit(UserArray);
				openMenu();
			});
		} else {
			getUser();
		}
	}

	function getUser() {
		
		var data = {
			ID: ID,
			type: 'getGroupList_ByID',
			strWhere: '',
			starIndex: '',
			endIndex: ''
		};
		common.showWaiting(true);

		common.postApi('GetUsergroup', data, function(response) {
			dataArray = eval(response.data);
			var User = document.getElementById("toUser");
			User.innerHTML = '';
			document.getElementById("txtGroupName").value = dataArray[0][0].GroupName;
			for (var i = 0; i < dataArray[1].length; i++) {
				var obj = dataArray[1][i];
				User.innerHTML += template.replace("@name", obj.UserName);
				UserArray.push(obj.UserId);
				UserList += obj.UserId + ",";
			}
			User.innerHTML += templateAdd;
			document.getElementById("btnAdd").addEventListener('tap', function() {
				document.getElementById("txtGroupName").blur();
				userListInit(UserArray);
				openMenu();
			});
			common.closeWaiting();
		}, 'json');
	}
	common.click("btnSubmit", function() {
		
		
		document.getElementById("txtGroupName").blur();
		if(UserList == ''){
			common.alert("请选择用户");
			return;
		}
		var groupname = document.getElementById("txtGroupName").value;

		if (groupname == null || groupname == '') {
			common.alert('请输入群组名称');
			return;
		} else if (groupname.length > 10) {
			common.alert('群组名称不能超过10个字');
			return;
		} else {
			var data = {
				id: ID,
				groupname: groupname,
				type: 'Insert',
				ChooseHeadList: UserList
			};
			common.showWaiting();
			common.postApi('UsergroupManage', data, function(response) {
				if (response.data == "success") {
					common.toast("提交成功..");
					mui.back();
					common.initUserList();
				} else {
					common.toast("服务器异常，请稍候重试..");
				}
				common.closeWaiting();
				common.backOfHideCurrentWebview();
			}, 'json');
		}

	});
	mui.back = function() {
		document.getElementById("txtGroupName").blur();
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		mui.fire(fatherView, 'refresh1', {});
		common.currentWebviewHide();
	};

	//------------------------------处理选人操作--------------------------------------
	mask = mui.createMask(_closeMenu);
	//plusReady事件后，自动创建menu窗口；
	//	document.getElementById("icon-toUser").addEventListener('tap', function() {
	//		alert(123);
	//		userListInit(UserArray);
	//		openMenu();
	//	});

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
	setTimeout(function() {
		//侧滑菜单默认隐藏，这样可以节省内存；
		menu = mui.preload({
			id: 'user_list',
			url: '../../common/user_list.html',
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
		var User = document.getElementById("toUser");
		UserArray = new Array();
		User.innerHTML = '';
		UserList = '';
		//选择的负责人
		for (var i = 0; i < tableview.length; i++) {
			var obj = tableview[i];
			UserArray.push(obj.UserId);
			User.innerHTML += template.replace("@name", obj.UserName);
			UserList += obj.UserId + ",";
		}

		User.innerHTML += templateAdd;
		document.getElementById("btnAdd").addEventListener('tap', function() {
			document.getElementById("txtGroupName").blur();
			userListInit(UserArray);
			openMenu();
		});
	}
	//自定义事件 关闭menu层
	window.addEventListener('closeMenu', closeMenuHandler);

	function closeMenuHandler(event) {
		//获取从B页面传过来的数据
		mask.close();
	}
	//------------------------------处理完成--------------------------------------


})