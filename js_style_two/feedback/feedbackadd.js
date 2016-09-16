//var aniHide = "pop-out"; //fade-out,zoom-in,slide-out-right,pop-out
//var aniSecond = "250";
mui.init();
mui.plusReady(function() {
	common.click('btnSubmit', function() {
		common.showWaiting();
		var feedback = document.getElementById("feedback").value;
		if (feedback != '') {
			var data = {
				contexts: feedback,
			};
			common.postApi('FeedbackManage', data, function(response) {
				if (response.data == "success") {
					common.closeWaiting();
					common.alert('提交成功');
					common.currentWebviewHide();
				}
			}, 'json');
		}
	});
	common.backOfHideCurrentWebview();
});