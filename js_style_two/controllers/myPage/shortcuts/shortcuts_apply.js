mui.plusReady(function() {
	common.backOfHideCurrentWebview();
	var type = common.getQueryString("type"); //获取用户ID
	/**
	 * 
	 * @param {保存名称} setName
	 */
	function getShortcuts(setName) {
		//获取快捷键
		var shortcuts = JSON.parse(localStorage.getItem(setName) || "[]");
		return shortcuts;
	}
	/**
	 * 
	 * @param {名称} setName
	 * @param {对象} shortcuts_Name
	 */
	function setShortcuts(setName, shortcuts_Name) {
		//设置快捷键
		localStorage.setItem(setName, JSON.stringify(shortcuts_Name));
	}
	//var name = common.getQueryString("name"); //获取用户name
	mui('.mui-content').on("tap", 'li', function() {
		//跳转页面
		getShortcuts()
		var name = this.querySelector('span').innerText;
		var openUrl = this.querySelector('input').value;
		var imgUrl = this.querySelector('input').getAttribute("imgUrl");
		var shortcuts = new Object();
		shortcuts.Name = name;
		shortcuts.imgUrl = imgUrl;
		shortcuts.openUrl = openUrl;
		switch (type) {
			case "shortcuts1":
				if (shortcuts.Name == getShortcuts("$shortcuts_two").Name || shortcuts.Name == getShortcuts("$shortcuts_three").Name || shortcuts.Name == getShortcuts("$shortcuts_four").Name) {
					common.alert("无法选择相同的快捷键,请选择其他的快捷键.......","提示");
					return;
				}
				setShortcuts("$shortcuts_one", shortcuts);
				plus.webview.currentWebview().hide(aniHide, aniSecond);
				var fatherView = plus.webview.currentWebview().opener(); //父页面
				//closeMenu 是C页面自定义事件的名称
				mui.fire(fatherView, 'reloadfun', {});
				break;
			case "shortcuts2":
				if (shortcuts.Name == getShortcuts("$shortcuts_one").Name || shortcuts.Name == getShortcuts("$shortcuts_three").Name || shortcuts.Name == getShortcuts("$shortcuts_four").Name) {
					common.alert("无法选择相同的快捷键,请选择其他的快捷键.......","提示");
					return;
				}
				setShortcuts("$shortcuts_two", shortcuts);
				plus.webview.currentWebview().hide(aniHide, aniSecond);
				var fatherView = plus.webview.currentWebview().opener(); //父页面
				//closeMenu 是C页面自定义事件的名称
				mui.fire(fatherView, 'reloadfun', {});
				break;
			case "shortcuts3":
				if (shortcuts.Name == getShortcuts("$shortcuts_one").Name || shortcuts.Name == getShortcuts("$shortcuts_two").Name || shortcuts.Name == getShortcuts("$shortcuts_four").Name) {
					common.alert("无法选择相同的快捷键,请选择其他的快捷键.......","提示");
					return;
				}
				setShortcuts("$shortcuts_three", shortcuts);
				plus.webview.currentWebview().hide(aniHide, aniSecond);
				var fatherView = plus.webview.currentWebview().opener(); //父页面
				//closeMenu 是C页面自定义事件的名称
				mui.fire(fatherView, 'reloadfun', {});
				break;
			case "shortcuts4":
				if (shortcuts.Name == getShortcuts("$shortcuts_one").Name || shortcuts.Name == getShortcuts("$shortcuts_two").Name || shortcuts.Name == getShortcuts("$shortcuts_three").Name) {
					common.alert("无法选择相同的快捷键,请选择其他的快捷键.......","提示");
					return;
				}
				setShortcuts("$shortcuts_four", shortcuts);
				plus.webview.currentWebview().hide(aniHide, aniSecond);
				var fatherView = plus.webview.currentWebview().opener(); //父页面
				//closeMenu 是C页面自定义事件的名称
				mui.fire(fatherView, 'reloadfun', {});
				break;
			default:
				break;
		}
	});
});