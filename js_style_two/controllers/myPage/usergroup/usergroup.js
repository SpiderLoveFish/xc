var statrCount = 0;
var showCount = 10;
mui.plusReady(function() {
	common.backOfHideCurrentWebview();
	var UserList; //对象列表
	var toUserArray; //userid列表
	var menu = null;
	document.getElementById("btnAdd").addEventListener("tap", function() {
		var template = common.getTemplate('page2', 'usergroup_apply.html');
	});
	mui("#divTem").on("tap", ".usergroup_edit", function(e) {
		var id = this.parentNode.parentNode.getAttribute("id");
		var template = common.getTemplate('page2', 'usergroup_apply.html?id=' + id);
	});
	mui("#divTem").on("tap", ".usergroup_delete", function(e) {
		var id = this.parentNode.parentNode.getAttribute("id");
		var btnArray = ['是', '否'];
		mui.confirm('是否删除常用群组？', '确认操作', btnArray, function(e) {
			if (e.index == 0) {
				//执行删除操作
				var data = {
					id: id,
					groupname: '',
					type: 'Delete',
					ChooseHeadList: ''
				};
				common.showWaiting();
				common.postApi("UsergroupManage", data, function(response) {
					if (response.data == "success") {
						common.toast("删除成功");
						common.initUserList();
						getUserGroup();
					} else {
						common.toast("服务器异常，请稍候重试..");
					}
					common.closeWaiting();
				}, 'json');
			} else {
				return;
			}
		})
	});
	getUserGroup();

	function getUserGroup() {
		var templet = '<div class="common_usergroup" id="@id">' + '<div class="common_usergroup_title">' + '<label>@GroupName</label>' + '<i class="usergroup_edit" ></i>' + '<i class="usergroup_delete" ></i>' + '</div>' + '<div class="group_person commongroup_person">' + '<div class="ques_option_per">' + '<ul  class="UsersList">' + '</ul>' + '</div>' + '</div>' + '</div>';
		var templet1 = '<li class="alapply_name">' + '<img src="@Avatar">' + '<label>@UserName</label>' + '</li>';
		var data = {
			ID: '',
			type: 'getGroupList_All',
			strWhere: '',
			starIndex: statrCount,
			endIndex: showCount
		};
		common.showWaiting(true);
		document.getElementById("divTem").innerHTML = '';
		common.postApi('GetUsergroup', data, function(response) {
			dataArray = eval(response.data);
			for (var i = 0; i < dataArray[0].length; i++) {
				var obj = dataArray[0][i];
				document.getElementById("divTem").innerHTML += templet.replace('@id', obj.ID).replace('@GroupName', obj.GroupName);
				//添加一个组
				for (var n = 0; n < dataArray[1].length; n++) {
					var obj1 = dataArray[1][n];
					if (obj.ID == obj1.GroupID) {
						document.getElementById(obj.ID).childNodes[1].childNodes[0].childNodes[0].innerHTML += templet1.replace('@UserName', obj1.UserName).replace('@Avatar', obj1.Avatar);
						//						$(obj.ID).find("ul").html() += templet1.replace('@UserName', obj1.UserName).replace('@Avatar', obj1.Avatar);
						//document.getElementById("UsersList").innerHTML += templet1.replace('@UserName', obj1.UserName).replace('@Avatar', obj1.Avatar);
					}
				}
			}
			common.closeWaiting();
		}, 'json');
	};
	window.addEventListener('refresh1', function() {
		getUserGroup();
	});
});