mui.plusReady(function() {
	common.backOfHideCurrentWebview();
	var btnSubmit = document.getElementById("btnSubmit");
	btnSubmit.addEventListener("tap", function() {
		var context = document.getElementById("context").value;
		alert(context);
		var data = {
			contexts: context
		};
		common.postApi('FeedbackManage', data, function(response) {
			dataArray = eval(response.data);
			alert(JSON.stringify(response.data));
		}, 'json');
	});

});