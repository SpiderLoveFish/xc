//var list = document.getElementById("list");
var listApprove = document.getElementById("listApprove");
var statrCount = 0;
var showCount = 10;
var type = 'getMyApproveList_No';
var yesOrNo = false;
var littleType = false; //是否点击了筛选
$(function() {
	$('.news_title>ul>li').each(function(i, n) {
		$(n).click(function() {
			$(this).addClass('read_active').siblings().removeClass('read_active');
			$('.pulldown_menu').html('全部');
			$('.drop_menu').css('display', 'none');
			$('.container .tab').each(function(x, y) {
				if (i == 0) {
					statrCount = 0;
					showCount = 1000;
					if (!yesOrNo) {
						return;
					}
					yesOrNo = false;
					type = 'getMyApproveList_No';
				} else {
					statrCount = 0;
					showCount = 10;
					if (yesOrNo) {
						return;
					}
					yesOrNo = true;
					type = 'getMyApproveList_Yes';
				}
				listApprove.innerHTML = '';
				setTimeout(function() {
					mui('#pullrefresh').pullRefresh().refresh(true);
					mui('#pullrefresh').pullRefresh().pullupLoading();
				}, 50);
			});
		})
	});
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
			//yesOrNo = $('#list').hasClass('h');
			approveInit(yesOrNo, listtype);
		});
	});
});
//筛选后数据初始化
function approveInit(yesOrNo, listType) {
	listApprove.innerHTML = '';
	if (listType == 'leave') {
		if (yesOrNo) {
			//已审批
			statrCount = 0;
			showCount = 10;
			type = 'getMyLeaveList_Yes';
		} else {
			//未审批
			type = 'getMyLeaveList_No';
		}
		littleType = true;
	} else if (listType == 'work') {
		if (yesOrNo) {
			//已审批
			statrCount = 0;
			showCount = 10;
			type = 'getMyWorkList_Yes';
		} else {
			//未审批
			type = 'getMyWorkList_No';

		}
		littleType = true;
	} else if (listType == 'projecthour') {
		if (yesOrNo) {
			statrCount = 0;
			showCount = 10;
			type = 'getMyprojecthourList_Yes';
			//已审批
		} else {
			//未审批
			type = 'getMyprojecthourList_No';
		}
		littleType = true;
	} else if (listType == 'generalapprove') {
		//已审批
		if (yesOrNo) {
			statrCount = 0;
			showCount = 10;
			type = 'getMygeneralapproveList_Yes';
		} else {
			//未审批
			type = 'getMygeneralapproveList_No';
		}
		littleType = true;
	} else if (listType == 'all') {
		if (yesOrNo) {
			//已审批
			statrCount = 0;
			showCount = 10;
			type = 'getMyApproveList_Yes';
		} else {
			//未审批
			type = 'getMyApproveList_No';
		}
		littleType = false;
	}
	//重置上拉加载
	mui('#pullrefresh').pullRefresh().refresh(true);
	mui('#pullrefresh').pullRefresh().pullupLoading();
}

function getListTypeName(listType) {
	if (listType == 'leave') {
		return '请假';
	} else if (listType == 'work') {
		return '加班';
	} else if (listType == 'projecthour') {
		return '工时';
	} else if (listType == 'generalapprove') {
		return '其他申请';
	}
}

function getData(type) {
	list.innerHTML = '';
	var temp = '<a href="javascript:;" id="@id" listtype="@listtype" class="sc_cell mb10 mui-table-view-cell"><div class="sc_cell_hd"><img src="@avatar"></div><div class="sc_cell_bd sc_cell_primary"><p><i class="overtime_name">@title</p><p class="label_describe">@content</p></div><div class="sc_cell_data">@UTime</div></a>';
	var data = {
		ID: "",
		type: type ? type : 'getMyApproveList_No',
		starIndex: statrCount,
		endIndex: showCount
	};
	common.postApi('GetApprove', data, function(response) {
		var s = eval(response.data);
		var dataArray = s[0];
		if (dataArray.length > 0) {
			$('.news_hint').text(dataArray.length); //数字角标
			$('.news_hint').show();
		} else {
			$('.news_hint').hide();
		}

		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			list.innerHTML += temp.replace('@id', obj.ID).replace('@listtype', obj.ListType).replace('@avatar', obj.Avatar).replace('@title', obj.UserName + '</i>的' + getListTypeName(obj.ListType)).replace('@content', substringAddPoint(obj.Title, 10)).replace('@UTime', subReplaceDateString(obj.ReleaseTime));
		}
		//		statrCount = statrCount + 10;
		//		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
	}, 'json');
}

function pullupRefresh() {
	setTimeout(function() {
		//已审批
		getDataApprove();

	}, 50);
}

function getDataApprove() {
	if (yesOrNo) {
		//已审批
		var temp = '<a id=@id listtype=@listtype href="javascript:;" class="sc_cell mb10 mui-table-view-cell"><div class="approve_left"><div class="sc_cell_hd"><img src="@avatar"></div><div class="sc_cell_bd sc_cell_primary"><p><i class="overtime_name">@title</p><p class="label_describe">@UTime</p></div></div><div class="approve_right"><div class="@approveclass">@approvestate</div></div></a>';
		var data = {
			ID: "",
			type: type,
			starIndex: statrCount,
			endIndex: showCount
		};
		common.postApi('GetApprove', data, function(response) {
			var s = eval(response.data);
			var dataArray = s[0];
			for (var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				listApprove.innerHTML += temp.replace('@id', obj.ID).replace('@listtype', obj.ListType).replace('@avatar', obj.Avatar).replace('@title', obj.UserName + '</i>的' + getListTypeName(obj.ListType)).replace('@approvestate', obj.ApproveState == '2' ? '审批通过' : obj.ApproveState == '3' ? '未通过' : '等待审批').replace('@approveclass', obj.ApproveState == '2' ? 'approve_pass' : obj.ApproveState == '3' ? 'approve_notpass' : 'approve_wait').replace('@UTime', subReplaceDateString(obj.ReleaseTime));
			}
			statrCount = statrCount + 10;
			mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
		}, 'json');
	} else {
		//未审批
		var temp = '<a href="javascript:;" id="@id" listtype="@listtype" class="sc_cell mb10 mui-table-view-cell"><div class="sc_cell_hd"><img src="@avatar"></div><div class="sc_cell_bd sc_cell_primary"><p><i class="overtime_name">@title</p><p class="label_describe">@content</p></div><div class="sc_cell_data">@UTime</div></a>';
		var data = {
			ID: "",
			type: type,
			starIndex: statrCount,
			endIndex: showCount
		};
		common.postApi('GetApprove', data, function(response) {
			var s = eval(response.data);
			var dataArray = s[0];
			if (dataArray.length > 0) {
				$('.news_hint').text(dataArray.length); //数字角标
				$('.news_hint').show();
			} else {
				$('.news_hint').hide();
			}

			for (var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				listApprove.innerHTML += temp.replace('@id', obj.ID).replace('@listtype', obj.ListType).replace('@avatar', obj.Avatar).replace('@title', obj.UserName + '</i>的' + getListTypeName(obj.ListType)).replace('@content', substringAddPoint(obj.Title, 10)).replace('@UTime', subReplaceDateString(obj.ReleaseTime));
			}
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			//		statrCount = statrCount + 10;
			//		mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray.length < 10)); //参数为true代表没有更多数据了。
		}, 'json');
	}

}

(function($, doc) {
	$.plusReady(function() {
		//		getData();
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
			//监听详情页面 列表初始化
			window.addEventListener('reloadfun', function() {
				//document.getElementById("list").innerHTML = "";
				document.getElementById("listApprove").innerHTML = "";
				statrCount = 0;
				_closeMenu();
				mask.close();
				getDataApprove();
			});
		});


		//		mui('.drop_menu').on('tap', 'li', function() {
		//			var listtype = this.getAttribute('listtype');
		//			alert(listtype);
		//			if (listType == 'leave') {
		//				return '请假';
		//			} else if (listType == 'work') {
		//				return '加班';
		//			} else if (listType == 'projecthour') {
		//				return '工时';
		//			} else if (listType == 'generalapprove') {
		//				return '其他申请';
		//			}
		//		});

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

		//		//语音识别完成事件
		//		search.addEventListener('recognized', function(e) {
		//			this.value = e.detail.value.replace(/。/g, '').replace(/,。/g, '。');
		//		});
		//		search.addEventListener('change', function(event) {
		//			statrCount = 0;
		//			list.innerHTML = '';
		//			getDataApprove();
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
		common.backOfHideCurrentWebview(function() {
			common.initMessage();
		});
	});
}(mui, document));