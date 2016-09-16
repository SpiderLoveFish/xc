mui.plusReady(function() {
	//应用资源版本号
	var wgtinfoVersion = null;
	plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
		//wgtinfoVersion = wgtinfo.version;
		//alert(wgtinfo.version);    

		common.postApi('GetAppVersion', {
			version: wgtinfo.version
		}, function(response) {
			var updateUrl = response.data; 
			if (updateUrl != 'no') {
				//获取到更新地址  
				var btnArray = ['是', '否'];
				mui.confirm('检测到新版本,是否立即更新？', '提示', btnArray, function(e) {
					if (e.index == 0) {
						common.loadUrl('view_style_two/common/progress.html?url=' + updateUrl);
						//downWgt(updateUrl);
					} else {
						return;
					}
				});
			}
		});
	});

});