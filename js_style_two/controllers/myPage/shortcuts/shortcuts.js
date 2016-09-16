mui('.container .mui-switch').each(function() { //循环所有toggle
	var isShortcuts = localStorage.getItem('$shortcuts_switch');
	if (isShortcuts == "true") {
		this.className = 'mui-switch mui-switch-mini mui-active ';
		document.getElementById("isSwitch").innerText = "已开启";
	} else {
		this.className = 'mui-switch mui-switch-mini';
		document.getElementById("isSwitch").innerText = "已关闭";

	}
	/**
	 * toggle 事件监听
	 */
	this.addEventListener('toggle', function(event) {
		//保存选中状态
		localStorage.setItem('$shortcuts_switch', event.detail.isActive);
		if (event.detail.isActive) {
			document.getElementById("isSwitch").innerText = "已开启";
		} else {
			document.getElementById("isSwitch").innerText = "已关闭";

		}
	});
});
mui.plusReady(function() {

	showShortcuts();
	/**
	 * 
	 * @param {保存名称} setName
	 */
	function getShortcuts(setName) {
		//获取快捷键
		var shortcuts = JSON.parse(localStorage.getItem(setName) || "[]");
		return shortcuts;
	}

	function showShortcuts() {
		var shortcuts_one = getShortcuts("$shortcuts_one");
		var shortcuts_two = getShortcuts("$shortcuts_two");
		var shortcuts_three = getShortcuts("$shortcuts_three");
		var shortcuts_four = getShortcuts("$shortcuts_four");
		if (shortcuts_one == '' || shortcuts_one == undefined || shortcuts_one == 'undefined' || shortcuts_one == null) {
			document.getElementById("shortcutsText1").innerText = "无";
		} else {
			document.getElementById("shortcutsText1").innerText = shortcuts_one.Name;
		}
		if (shortcuts_two == '' || shortcuts_two == undefined || shortcuts_two == 'undefined' || shortcuts_two == null) {
			document.getElementById("shortcutsText2").innerText = "无";
		} else {
			document.getElementById("shortcutsText2").innerText = shortcuts_two.Name;
		}
		if (shortcuts_three == '' || shortcuts_three == undefined || shortcuts_three == 'undefined' || shortcuts_three == null) {
			document.getElementById("shortcutsText3").innerText = "无";
		} else {
			document.getElementById("shortcutsText3").innerText = shortcuts_three.Name;
		}
		if (shortcuts_four == '' || shortcuts_four == undefined || shortcuts_four == 'undefined' || shortcuts_four == null) {
			document.getElementById("shortcutsText4").innerText = "无";
		} else {
			document.getElementById("shortcutsText4").innerText = shortcuts_four.Name;
		}
	}
	window.addEventListener('reloadfun', function() {
		showShortcuts();
	});
	mui('.ullist').on("tap", 'li', function() {
		//跳转页面
		var name = this.querySelector('span').innerText;
		var id = this.getAttribute("id");
		common.getTemplate('page2', 'shortcuts_apply.html?type=' + id);
	});
		//返回
	common.backOfHideCurrentWebview(function() {
		common.initshowButton();
	});
});