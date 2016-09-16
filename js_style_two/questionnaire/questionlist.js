var list = document.getElementById("list");
var masterid = '';
var iSAnonymityType = '';
mui.plusReady(function() {
	var showMenu = false;
	var mask = mui.createMask(_closeMenu);
	var webview = null;
	masterid = common.getQueryString("id");
	iSAnonymityType = common.getQueryString('iSAnonymityType');
	common.showWaiting(true);
	//var html = '<div id="@QuestionID"  data-type="@type" class="news_list oh bb_eee">@index、  【@type】 @QuestionDescription</div>';
	var html = '<li class="join_object mui-table-view-cell"  data-type="@type" id="@QuestionID">' +
		'	@index.<i class="ques_tag">@typeName</i>@QuestionDescription' +
		'</li>';
	common.postApi('GetSurveys', {
		ID: masterid,
		strWhere: '',
		starIndex: '',
		endIndex: '',
		type: 'getSurveysResultQuestion_List',
	}, function(response) {
		resultData = eval(response.data);
		dataArray = resultData[0];
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			var type = '';
			if (obj.QuestionType == '1') {
				type = '单选题';
			} else if (obj.QuestionType == '2') {
				type = '多选题';
			} else {
				type = '问答题';
			}
			var item = html.replace('@type', obj.QuestionType).replace('@QuestionID', obj.QuestionID).replace('@index', i + 1).replace('@typeName', type).replace('@QuestionDescription', obj.QuestionDescription);
			list.innerHTML += item;
		}
		common.closeWaiting();
	}, 'json');

	mui('#list').on('tap', '.join_object', function(e) {
		var id = this.getAttribute('id');
		var type = this.getAttribute('data-type');
		webview = common.getWebviewDetailById('page3');
		webview.setStyle({
			left: '100%',
			zindex: 9999
		});
		if (type == '3') {
			webview.loadURL('answer1.html?id=' + id + '&iSAnonymityType=' + iSAnonymityType);
		} else if (type == '1') {
			webview.loadURL('answer2.html?id=' + id + '&iSAnonymityType=' + iSAnonymityType);
		} else {
			webview.loadURL('answer3.html?id=' + id + '&iSAnonymityType=' + iSAnonymityType);
		}
		setTimeout(function() {
			openMenu();
		}, 300);
	});
	/*
	 * 显示菜单菜单
	 */
	function openMenu() {
		if (!showMenu) {
			//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
			if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
				document.querySelector("header.mui-bar").style.position = "static";
				//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
				document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
			}
			webview.show('none', 0, function() {
				webview.setStyle({
					left: '20%',
					transition: {
						duration: 150
					}
				});
			});
			//显示主窗体遮罩
			mask.show();
			showMenu = true;
		}
	}

	function closeMenu() {
		//窗体移动
		_closeMenu();
		//关闭遮罩
		mask.close();
	}

	/**
	 * 关闭侧滑菜单(业务部分)
	 */
	function _closeMenu() {
		if (showMenu) {
			//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
			if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
				document.querySelector("header.mui-bar").style.position = "fixed";
				//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
				document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
			}
			//主窗体开始侧滑；
			webview.setStyle({
				left: '100%',
				transition: {
					duration: 150
				}
			});
			//等窗体动画结束后，隐藏菜单webview，节省资源；
			setTimeout(function() {
				webview.hide();

			}, 300);
			showMenu = false;
		}
	}
	//监听详情页面请求关闭
	window.addEventListener('hideDetailPage', function() {
		_closeMenu();
		mask.close();
	});
	common.backOfHideCurrentWebview();
});