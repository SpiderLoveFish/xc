var list = document.getElementById("list");
var starIndex = 0;
var endIndex = 1000;
var selecttype = 'getNewsList_No';
var news_hint = document.getElementsByClassName("news_hint");
$(function() {
	//	新闻公告
	$('.news_title>ul>li').each(function(i, n) {
		$(n).click(function() {
			$(this).addClass('read_active').siblings().removeClass('read_active');
			$('.container .sc_cells_access').each(function(x, y) {

				if (i == 0) {
					starIndex = 0;
					endIndex = 1000;
					if (selecttype != "getNewsList_No") {
						list.innerHTML = "";
					} else {
						return;
					}
					selecttype = 'getNewsList_No';
				} else {
					starIndex = 0;
					endIndex = 10;
					if (selecttype != "getNewsList_Yes") {
						list.innerHTML = "";
					} else {
						return;
					}
					selecttype = 'getNewsList_Yes';
				}
				setTimeout(function() {
					mui('#pullrefresh').pullRefresh().refresh(true);
					mui('#pullrefresh').pullRefresh().pullupLoading();
				}, 50);
			});
		})
	});

	news_hint[0].style.display = "none";
});

function pullupRefresh() {
	setTimeout(function() {
		getnewlist();
	}, 50);
}

function getnewlist() {
	var html = '<a id="@id" href="javascript:;" class="sc_cell sc_padding  mui-table-view-cell onclickdetail">' +
		'	<div class="sc_cell_hd sc_pic_txt"><img src="@IsHostPic"></div>' +
		'	<div class="sc_cell_bd sc_cell_primary">' +
		'		<p>@Title</p>' +
		'		<p class="label_describe_2">@Description</p>' +
		'		<span class="sc_comment">@uTime</span>' +
		'	</div>' +
		'</a>';

	var data = {
		nid: '',
		strWhere: '',
		starIndex: starIndex,
		endIndex: endIndex,
		type: selecttype,
	};
	common.postApi('GetNews', data, function(response) {

		dataArray = eval(response.data);

		for (var i = 0; i < dataArray[0].length; i++) {
			var obj = dataArray[0][i];
			list.innerHTML += html.replace('@id', obj.ID).replace('@IsHostPic', obj.PicUrl).replace('@Title', substringAddPoint(obj.Title)).replace('@Description', obj.Description).replace('@uTime', obj.U_Time.substring(0, 10));
		}

		starIndex = starIndex + 10;
		if (selecttype == "getNewsList_No") {

			if (dataArray[0].length > 0) {
				news_hint[0].style.display = "block";
				news_hint[0].innerText = dataArray[0].length;
			} else {
				news_hint[0].style.display = "none";
			}
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		} else {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh((dataArray[0].length < 10)); //参数为true代表没有更多数据了。
		}
	}, 'json');
}
(function($, doc) {
	$.plusReady(function() {
		var detailPageId = 'detail.html';
		var detailPage = null;
		mui.plusReady(function() {
			//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
			setTimeout(function() {
				detailPage = common.getWebviewDetailById(detailPageId);
			}, 150);
		});

		mui('#list').on('tap', '.onclickdetail', function(e) {
			var id = this.getAttribute('id');
			var webview = common.getTemplate('page2');
			webview.loadURL('newdetail.html?id=' + id);
		});
		if (plus.os.name != "Android") {
			var pullrefresh = document.getElementById("pullrefresh");
			pullrefresh.style.marginTop = CommonTop;
		}

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
		window.addEventListener('refresh1', function() {
			if (selecttype == "getNewsList_No") {
				list.innerHTML = "";
				starIndex = 0;
				endIndex = 1000;
				getnewlist();
			}

		});
		//返回
		common.backOfHideCurrentWebview(function() {
			common.initMessage();
		});
	});
}(mui, document));