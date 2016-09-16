var list = document.getElementById("list");
var statrCount = 0;
var showCount = 10;
$(function() {
	//筛选
	$('.pulldown_menu').click(function() {
		$('.drop_menu').toggle();
	});

	$('.drop_menu li').each(function(i, n) {
		$(n).click(function() {
			var txt = $(this).text();
			$('.drop_menu').css('display', 'none');
			$('.pulldown_menu').html(txt);
			var listtype = $(this).attr('listtype');
			approveInit(listtype);
		});
	});
});
//筛选后数据初始化
function approveInit(listType) {
	statrCount = 0;
	showCount = 10;
	list.innerHTML = '';
	if (listType == 'leave') {
		getData('getMyLeaveList_ChaoSong');
	} else if (listType == 'work') {
		getData('getMyWorkList_ChaoSong');
	} else if (listType == 'projecthour') {
		getData('getMyprojecthourList_ChaoSong');
	} else if (listType == 'generalapprove') {
		getData('getMygeneralapproveList_ChaoSong');
	} else if (listType == 'all') {
		getData('getMyApproveList_ChaoSong');
	}
	//重置上拉加载
	mui('#pullrefresh').pullRefresh().refresh(true);
}

function pullupRefresh() {
	setTimeout(function() {
		getData();
	}, 50);
}

function getListTypeName(listType) {
	if (listType == 'leave') {
		return '请假';
	} else if (listType == 'work') {
		return '加班';
	} else if (listType == 'projecthour') {
		return '工时';
	} else if (listType == 'generalapprove') {
		return '通用';
	}
}

function getData(type) {
	var temp = '<a id=@id listtype=@listtype href="javascript:;" class="sc_cell mb10 mui-table-view-cell"><div class="approve_left"><div class="sc_cell_hd"><img src="@avatar"></div><div class="sc_cell_bd sc_cell_primary"><p><i class="overtime_name">@title</p><p class="label_describe">@UTime</p></div></div><div class="approve_right"><div class="@approveclass">@approvestate</div></div></a>';
	//	var temp = '<li id=@id listtype=@listtype class="mui-table-view-cell mui-media">' + '<a class="mui-navigate-right">' + '<img class="mui-media-object mui-pull-left" src="@avatar">' + '<div class="mui-media-body">@title<p class="mui-ellipsis">@content</p><span class="time">@UTime</span>' + '</div>' + '</a>' + '</li>';
	var data = {
		ID: "",
		type: type ? type : 'getMyApproveList_ChaoSong',
		starIndex: statrCount,
		endIndex: showCount
	};

	common.postApi('GetApprove', data, function(response) {
		var s = eval(response.data);
		var dataArray = s[0];
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			list.innerHTML += temp.replace('@id', obj.ID).replace('@listtype', obj.ListType).replace('@avatar', obj.Avatar).replace('@title', obj.UserName + '</i>的' + getListTypeName(obj.ListType)).replace('@approvestate', obj.ApproveState == '2' ? '审批通过' : obj.ApproveState == '3' ? '未通过' : '等待审批').replace('@approveclass', obj.ApproveState == '2' ? 'approve_pass' : obj.ApproveState == '3' ? 'approve_notpass' : 'approve_wait').replace('@UTime', subReplaceDateString(obj.ReleaseTime));
		}
		statrCount = statrCount + 10;
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
	}, 'json');
}

(function($, doc) {
	$.plusReady(function() {
		var mask = mui.createMask(_closeMenu);
		var isApprove = false; //是否可以审批
		var detailPageId = 'detail.html';
		var detailPage = null;
		mui.plusReady(function() {

			//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
			setTimeout(function() {
				detailPage = common.getWebviewDetailById(detailPageId);
			}, 150);
			//监听详情页面请求关闭
			window.addEventListener('hideDetailPage', function() {
				_closeMenu();
				mask.close();
			});
			//监听详情页面请求关闭
			window.addEventListener('reloadfun', function() {
				document.getElementById("list").innerHTML = "";
				statrCount = 0;
				getData();
			});
		});

		//添加列表项的点击事件
		mui('.container').on('tap', 'a', function(e) {
			//移除焦点,为了隐藏软键盘
			document.getElementById('drop_menu').style.display = 'none';
			//document.getElementById("search").blur();
			if (!detailPage) {
				detailPage = common.getWebviewDetailById(detailPageId);
				detailPage.setStyle({
					left: '100%',
					zindex: 9999
				});
			}
			var id = this.getAttribute('id');
			var listType = this.getAttribute('listtype');
			if (listType == 'leave') {
				detailPage.loadURL('../leave/leave_detail.html?id=' + id);;
			} else if (listType == 'work') {
				detailPage.loadURL('../work/work_detail.html?id=' + id);;
			} else if (listType == 'projecthour') {
				detailPage.loadURL('../projecthour/projecthour_detail.html?id=' + id);;
			} else if (listType == 'generalapprove') {
				detailPage.loadURL('../generalapprove/generalapprove_detail.html?id=' + id);;
			}

			openMenu();

		});
		/*
		 * 显示菜单菜单
		 */
		function openMenu() {
			//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
			if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
				document.querySelector("header.mui-bar").style.position = "static";
				//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
				document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
			}
			//侧滑菜单处于隐藏状态，则立即显示出来；
			//显示完毕后，根据不同动画效果移动窗体；
			setTimeout(function() {
				detailPage.show('none', 0, function() {
					detailPage.setStyle({
						left: '15%',
						transition: {
							duration: 150
						}
					});
				});
				mask.show(); //遮罩
			}, 350);
		}
		/**
		 * 关闭侧滑菜单(业务部分)
		 */

		function _closeMenu() {
			//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
			if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
				document.querySelector("header.mui-bar").style.position = "fixed";
				//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
				document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
			}
			//主窗体开始侧滑；
			detailPage.setStyle({
				left: '100%',
				transition: {
					duration: 150
				}
			});
			//等窗体动画结束后，隐藏菜单webview，节省资源；
			setTimeout(function() {
				detailPage.hide();
			}, 300);
		}

		var count = 0;
		if (plus.os.name != "Android") {
			var pullrefresh = document.getElementById("pullrefresh");
			pullrefresh.style.marginTop = CommonTop;
		}

		//语音识别完成事件
		//		search.addEventListener('recognized', function(e) {
		//			this.value = e.detail.value.replace(/。/g, '').replace(/,。/g, '。');
		//		});
		//		search.addEventListener('change', function(event) {
		//			statrCount = 0;
		//			list.innerHTML = '';
		//			getData();
		//			mui('#pullrefresh').pullRefresh().refresh(true);
		//		}, false);
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				up: {
					contentrefresh: '正在加载...',
					callback: pullupRefresh
				}
			}
		});
		if (mui.os.plus) {
			mui.plusReady(function() {
				setTimeout(function() {
					mui('#pullrefresh').pullRefresh().pullupLoading();
				}, 50);
			});
		} else {
			mui.ready(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
			});
		}
		//返回
		common.backOfHideCurrentWebview();
	});
}(mui, document));