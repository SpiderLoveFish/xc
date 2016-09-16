//拓展功能
mui.init({
	gestureConfig: {
		tap: true, //默认为true
		longtap: true //长按事件 默认为false
	}
});
//var popoverTemplate = '<div id="middlePopover" class="mui-popover"><div class="mui-popover-arrow"></div><div class="mui-scroll-wrapper"><div class="mui-scroll"><ul class="mui-table-view"><li class="mui-table-view-cell"><a href="#">Item1</a></li><li class="mui-table-view-cell"><a href="javascript:;">保存至本地</a></li></ul></div></div></div>';
mui.plusReady(function() {
	//保存图片至本地
	mui('body').on('longtap', 'img', function() {
		var path = this.src;
		var btnArray = [{
			title: "保存至本地"
		}];
		plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			if (index == 1) {
				createDownload(path);
			}
		});
	});

	// 创建下载任务
	function createDownload(url, success, error) {
		//下载完成后会存到app所在目录下
		var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
			
			// 下载完成
			if (status == 200) {
				plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
						var localPath = entry.fullPath; //本地绝对路径
						//保存至相册
						plus.gallery.save(localPath, function() {
							common.toast('保存成功');
							//删除原文件(app所在目录下) 只保留相冊文件
							entry.remove();
						}, function(error) {
							common.toast('保存失败:' + error.message);
							//删除原文件(app所在目录下) 只保留相冊文件
							entry.remove();
						});

					},
					function(e) {
						common.toast('保存失败:' + e.message);
					});
			} else {
				common.toast('保存失败,服务器端异常');
			}
		});
		dtask.start();

	}
});