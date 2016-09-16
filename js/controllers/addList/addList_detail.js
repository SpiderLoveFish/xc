mui.init({
	//	gestureConfig: {
	//		tap: true, //默认为true
	//		longtap: true //长按事件 默认为false
	//	}
});
mui.plusReady(function() {
	mui.previewImage();
	//	mui('.mine_container_body').on('longtap', '.flexItem', function() {
	//		alert(this.innerText);
	//	});
	id = common.getQueryString("id");
	document.getElementById("sendMessage").addEventListener('tap', function() {
		currentWebViewHide();
		var template = common.getTemplate('page2', 'im_chat.html?id=' + id);
	});
	//window.addEventListener('dataInit', function(event) {
	//获取从父页面传过来的数据
	//id = event.detail.id;

	common.showWaiting(true);
	var data = {
		selectkey: id,
		uType: 'GetUserDetialByString',
		statrCount: '0',
		showCount: '10'
	};
	common.postApi('GetUsersBySelectKey', data, function(response) {
		dataArray = eval(response.data);
		var trace={
			"html":'',
			"js":'addlist_all_list',
			"url":'GetUsersBySelectKey',
			"urldata":JSON.stringify(data),
			"returndata":JSON.stringify(response.data)
		}
		 common.postTraceApi(trace);
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			document.getElementById("Avatar").src = obj.Avatar;
			document.getElementById("UserName").innerText = obj.UserName;
			document.getElementById("mobeil").innerText = obj.Mobile;
			//document.getElementById("Remarks").innerText = obj.Remarks == null ? "备注：" : "备注：" + obj.Remarks;
			document.getElementById("DepartmentName").innerText = obj.DepartmentName;
			document.getElementById("Position").innerText = obj.Position;
			document.getElementById("Email").innerText = obj.Email;
			document.getElementById("Address").innerText = obj.Address;
			document.getElementById("WeixinId").innerText = obj.WeixinId;
			userName = obj.UserName;
			Avatar = obj.Avatar;
		}
		common.closeWaiting();
	}, 'json');

	//}); 
	//	var sendmsg = document.getElementById("sendmsg");
	//	sendmsg.addEventListener("tap", function() {
	//		common.toast("此功能正在研发,敬请等待..");
	//	});
	mui.back = function() {
		currentWebViewHide();
	}

	function currentWebViewHide() {
		var fatherView = plus.webview.currentWebview().opener(); //父页面
		//closeMenu 是C页面自定义事件的名称
		mui.fire(fatherView, 'hideDetailPage', {
			//					id: id
		});
	}
});