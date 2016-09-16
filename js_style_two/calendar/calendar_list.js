mui.init();
var list = document.getElementById("list");
var Item = '<a href="javascript:;" class="sc_cell sc_cal_event"  id="@ID" data-CopyShow="@CopyShow">' +
	'		<div class="sc_cell_bd sc_cell_primary sc_calevent_p">' +
	'			<p  class="label_describe_2">@Remark</p>' +
	'			<span class="sc_cal_state" style="color:@color">@EventStatus</span>' +
	'		</div>' +
	'	</a>';


function GetCheckInDetail(datevalue) {
	 
	list.innerHTML = '';
	common.showWaiting(true);
	common.postApi('GetSchedule', {
		StartDate: datevalue,
		EndDate: datevalue,
		type: 'getScheduleList_Day',
	}, function(response) {
		dataArray = eval(response.data);
		for (var i = 0; i < dataArray[0].length; i++) {
			var obj = dataArray[0][i];
			var itemobj = Item.replace('@ID', obj.ID).replace('@Remark', (obj.UserName == '' ? '' : obj.UserName + ':') + obj.Remark).replace('@CopyShow', obj.CopyShow);

			if (obj.EventStatus == "0") {
				itemobj = itemobj.replace('@EventStatus', '待办').replace('@color', '#F1F111');
			} else if (obj.EventStatus == "1") {
				itemobj = itemobj.replace('@EventStatus', '紧急').replace('@color', 'red');
			} else {
				itemobj = itemobj.replace('@EventStatus', '已完成').replace('@color', '#4CD964');
			}
			list.innerHTML += itemobj
		}
		common.closeWaiting();
	}, 'json');

}
mui.plusReady(function() {
	document.getElementById("done").addEventListener('tap', function() {
		var webview = common.getTemplate('page2');
		webview.loadURL('calendar_edit.html');
	});

	mui('#list').on('tap', '.sc_cell', function(e) {
		var CopyShow = this.getAttribute('data-CopyShow');
		var id = this.getAttribute('id');
		if (CopyShow == '0') {
			var webview = common.getTemplate('page2');
			webview.loadURL('calendar_edit.html?id=' + id);
		}

	});

	var options = '';
	var isToday = true; //是否为今天默认为是	
	var date = new Date(); //获得时间对象
	var nowYear = date.getFullYear(); //获得当前年份
	var nowMonth = date.getMonth() + 1; //获得当前月份
	var today = date.getDate(); //获得当前天数

	var nowWeek = new Date(nowYear, nowMonth - 1, 1).getDay(); //获得当前星期
	GetCheckInDetail(nowYear, nowMonth, today);
	var nowLastday = getMonthNum(nowMonth, nowYear); //获得最后一天
	manhuaDate({
		Event: "click", //可选				       
		Left: 0, //弹出时间停靠的左边位置
		Top: -16, //弹出时间停靠的顶部边位置
		fuhao: "-", //日期连接符默认为-
		isTime: false, //是否开启时间值默认为false
		beginY: 2010, //年份的开始默认为1949
		endY: 2100 //年份的结束默认为2049
	});


	function manhuaDate(options) {

		var defaults = {
			Event: "click", //插件绑定的响应事件
			Left: 0, //弹出时间停靠的左边位置
			Top: 22, //弹出时间停靠的上边位置
			fuhao: "-", //日期之间的连接符号
			isTime: false, //是否开启时间值默认为false
			beginY: 2010, //年份的开始默认为1949
			endY: 2049 //年份的结束默认为2049
		};

		options = $.extend(defaults, options);
		var $mhInput = $(this);

		//年、月 的初始化

		$("#year").html(nowYear);
		$("#month").html(nowMonth);

		ManhuaDate(nowYear, nowMonth, nowWeek, nowLastday); //初始化为当前日期	
	}
	//上一月绑定点击事件
	$("#preMonth").click(function() {
		isToday = false;
		var year = parseInt($("#year").html());
		var month = parseInt($("#month").html());
		month = month - 1;
		if (month < 1) {
			month = 12;
			year = year - 1;
		}
		if (nowYear == year && nowMonth == month) {
			isToday = true;
		}
		var week = new Date(year, month - 1, 1).getDay();
		var lastday = getMonthNum(month, year);
		ManhuaDate(year, month, week, lastday);
	});
	//下一个月的点击事件
	$("#nextMonth").click(function() {
		isToday = false;
		var year = parseInt($("#year").html());
		var month = parseInt($("#month").html());

		month = parseInt(month) + 1;
		if (parseInt(month) > 12) {
			month = 1;
			year = parseInt(year) + 1;
		}
		if (nowYear == year && nowMonth == month) {
			isToday = true;
		}
		var week = new Date(year, month - 1, 1).getDay();
		var lastday = getMonthNum(month, year);
		ManhuaDate(year, month, week, lastday);
	});

	//初始化日历
	function ManhuaDate(year, month, week, lastday) {

		var yearMonth = year + '-' + (parseInt(month) > 9 ? month : '0' + month);

		var preMonth = month - 1;
		var nextMonth = month + 1;
		var preyearMonth;
		var nextyearMonth;
		if (preMonth == 0) {
			preyearMonth = (year - 1) + '-' + '12';
		} else {
			preyearMonth = year + '-' + (parseInt(preMonth) > 9 ? preMonth : '0' + preMonth);
		}
		if (nextMonth == 13) {
			nextyearMonth = (year + 1) + '-' + '01';
		} else {
			nextyearMonth = year + '-' + (parseInt(nextMonth) > 9 ? nextMonth : '0' + (nextMonth))
		}


		$("#year").html(year);
		$("#month").html(month);
		var table = document.getElementById("calender");
		for (var i = 1; i < 7; i++) {
			for (j = 0; j < 7; j++) {
				table.rows[i].cells[j].innerHTML = "&nbsp"
				table.rows[i].cells[j].className = "";
			}
		}
		var n = 1;
		var m = 1;
		var mm = getMonthNum(month - 1 == 0 ? 12 : month - 1, year);
		common.showWaiting(true);

		common.postApi('GetSchedule', {
			StartDate: preyearMonth,
			EndDate: nextyearMonth,
			type: 'getScheduleList_Month',
		}, function(response) {
			resultData = eval(response.data);

			dataArray0 = resultData[0]; //问题详情

			for (var i = week - 1; i > -1; i--) {
				table.rows[1].cells[i].className = "event displaynone";
				table.rows[1].cells[i].innerHTML = "<span>" + mm + "</span>" + '<ul class="ultest"><li class="liremove"></li></ul>';
				$(table.rows[1].cells[i]).attr("data-date", preyearMonth + '-' + (mm > 9 ? mm : '0' + mm));
				for (var k = 0; k < dataArray0.length; k++) {
					var obj = dataArray0[k];
					var StartDate = common.DateFormat(getDateTimeStamp(obj.StartDate), 'YYYY-MM-dd'); //2016-1-24
					var EndDate = common.DateFormat(getDateTimeStamp(obj.EndDate), 'YYYY-MM-dd'); //2016-3-26
					// 2016-03-m
					if ((preyearMonth + '-' + (mm > 9 ? mm : '0' + mm)) >= StartDate && (preyearMonth + '-' + (mm > 9 ? mm : '0' + mm)) <= EndDate) {
						if ((preyearMonth + '-' + (mm > 9 ? mm : '0' + mm)) < nowYear + '-' + (nowMonth > 9 ? nowMonth : '0' + nowMonth) + '-' + (today > 9 ? today : '0' + today)) {
							table.rows[1].cells[i].innerHTML = "<span>" + mm + "</span>" + '<ul><li class="firstpoint"></li></ul>';
						} else {
							$(table.rows[1].cells[i]).children(".ultest").children(".liremove").remove();
							if (obj.EventStatus == '0') {
								if ($(table.rows[1].cells[i]).children(".ultest").children(".secondpoint").length == 0) {
									$(table.rows[1].cells[i]).children(".ultest").append('<li class="secondpoint"></li>');
								}
							} else if (obj.EventStatus == '1') {
								if ($(table.rows[1].cells[i]).children(".ultest").children(".thirdpoint").length == 0) {
									$(table.rows[1].cells[i]).children(".ultest").append('<li class="thirdpoint"></li>');
								}
							} else if (obj.EventStatus == '2') {
								if ($(table.rows[1].cells[i]).children(".ultest").children(".fourpoint").length == 0) {
									$(table.rows[1].cells[i]).children(".ultest").append('<li class="fourpoint"></li>');
								}
							}
						}
					}
				}
				mm--;
			}
			for (var j = week; j < 7; j++) {
				if (n == today && isToday) {
					table.rows[1].cells[j].className = "tdtoday";
				} else {
					table.rows[1].cells[j].className = "event";
				}
				table.rows[1].cells[j].innerHTML = "<span>" + n + "</span>" + '<ul class="ultest"><li class="liremove"></li></ul>';
				$(table.rows[1].cells[j]).attr("data-date", yearMonth + '-' + (n > 9 ? n : '0' + n));
				for (var k = 0; k < dataArray0.length; k++) {
					var obj = dataArray0[k];
					var StartDate = common.DateFormat(getDateTimeStamp(obj.StartDate), 'YYYY-MM-dd');
					var EndDate = common.DateFormat(getDateTimeStamp(obj.EndDate), 'YYYY-MM-dd');
					if ((yearMonth + '-' + (n > 9 ? n : '0' + n)) >= StartDate && (yearMonth + '-' + (n > 9 ? n : '0' + n)) <= EndDate) {
						if ((yearMonth + '-' + (n > 9 ? n : '0' + n)) < nowYear + '-' + (nowMonth > 9 ? nowMonth : '0' + nowMonth) + '-' + (today > 9 ? today : '0' + today)) {
							table.rows[1].cells[j].innerHTML = "<span>" + n + "</span>" + '<ul><li class="firstpoint"></li></ul>';
						} else {
							$(table.rows[1].cells[j]).children(".ultest").children(".liremove").remove();
							if (obj.EventStatus == '0') {
								if ($(table.rows[1].cells[j]).children(".ultest").children(".secondpoint").length == 0) {
									$(table.rows[1].cells[j]).children(".ultest").append('<li class="secondpoint"></li>');
								}
							} else if (obj.EventStatus == '1') {
								if ($(table.rows[1].cells[j]).children(".ultest").children(".thirdpoint").length == 0) {
									$(table.rows[1].cells[j]).children(".ultest").append('<li class="thirdpoint"></li>');
								}
							} else if (obj.EventStatus == '2') {
								if ($(table.rows[1].cells[j]).children(".ultest").children(".fourpoint").length == 0) {
									$(table.rows[1].cells[j]).children(".ultest").append('<li class="fourpoint"></li>');
								}
							}
						}
					}
				}
				n++;
			}
			for (var i = 2; i < 7; i++) {
				for (j = 0; j < 7; j++) {
					if (n > lastday) {

						table.rows[i].cells[j].className = "event displaynone";
						table.rows[i].cells[j].innerHTML = "<span>" + m + "</span>" + '<ul class="ultest"><li class="liremove"></li></ul>';
						$(table.rows[i].cells[j]).attr("data-date", nextyearMonth + '-' + (m > 9 ? m : '0' + m));
						for (var k = 0; k < dataArray0.length; k++) {
							var obj = dataArray0[k];
							var StartDate = common.DateFormat(getDateTimeStamp(obj.StartDate), 'YYYY-MM-dd'); //2016-1-24
							var EndDate = common.DateFormat(getDateTimeStamp(obj.EndDate), 'YYYY-MM-dd'); //2016-3-26
							// 2016-03-m
							if ((nextyearMonth + '-' + (m > 9 ? m : '0' + m)) >= StartDate && (nextyearMonth + '-' + (m > 9 ? m : '0' + m)) <= EndDate) {
								if ((nextyearMonth + '-' + (m > 9 ? m : '0' + m)) < nowYear + '-' + (nowMonth > 9 ? nowMonth : '0' + nowMonth) + '-' + (today > 9 ? today : '0' + today)) {
									table.rows[i].cells[j].innerHTML = "<span>" + m + "</span>" + '<ul><li class="firstpoint"></li></ul>';
								} else {
									$(table.rows[i].cells[j]).children(".ultest").children(".liremove").remove();
									if (obj.EventStatus == '0') {
										if ($(table.rows[i].cells[j]).children(".ultest").children(".secondpoint").length == 0) {
											$(table.rows[i].cells[j]).children(".ultest").append('<li class="secondpoint"></li>');
										}
									} else if (obj.EventStatus == '1') {
										if ($(table.rows[i].cells[j]).children(".ultest").children(".thirdpoint").length == 0) {
											$(table.rows[i].cells[j]).children(".ultest").append('<li class="thirdpoint"></li>');
										}
									} else if (obj.EventStatus == '2') {
										if ($(table.rows[i].cells[j]).children(".ultest").children(".fourpoint").length == 0) {
											$(table.rows[i].cells[j]).children(".ultest").append('<li class="fourpoint"></li>');
										}
									}
								}
							}
						}



						m++;
					} else {

						if (n == today && isToday) {
							table.rows[i].cells[j].className = "tdtoday";
						} else {
							table.rows[i].cells[j].className = "event";
						}
						table.rows[i].cells[j].innerHTML = "<span>" + n + "</span>" + '<ul class="ultest"><li class="liremove"></li></ul>';
						$(table.rows[i].cells[j]).attr("data-date", yearMonth + '-' + (n > 9 ? n : '0' + n));
						for (var k = 0; k < dataArray0.length; k++) {
							var obj = dataArray0[k];
							var StartDate = common.DateFormat(getDateTimeStamp(obj.StartDate), 'YYYY-MM-dd'); //2016-1-24
							var EndDate = common.DateFormat(getDateTimeStamp(obj.EndDate), 'YYYY-MM-dd'); //2016-3-26


							if ((yearMonth + '-' + (n > 9 ? n : '0' + n)) >= StartDate && (yearMonth + '-' + (n > 9 ? n : '0' + n)) <= EndDate) {

								if ((yearMonth + '-' + (n > 9 ? n : '0' + n)) < nowYear + '-' + (nowMonth > 9 ? nowMonth : '0' + nowMonth) + '-' + (today > 9 ? today : '0' + today)) {
									table.rows[i].cells[j].innerHTML = "<span>" + n + "</span>" + '<ul><li class="firstpoint"></li></ul>';
								} else {
									$(table.rows[i].cells[j]).children(".ultest").children(".liremove").remove();
									if (obj.EventStatus == '0') {
										if ($(table.rows[i].cells[j]).children(".ultest").children(".secondpoint").length == 0) {
											$(table.rows[i].cells[j]).children(".ultest").append('<li class="secondpoint"></li>');
										}
									} else if (obj.EventStatus == '1') {
										if ($(table.rows[i].cells[j]).children(".ultest").children(".thirdpoint").length == 0) {
											$(table.rows[i].cells[j]).children(".ultest").append('<li class="thirdpoint"></li>');
										}
									} else if (obj.EventStatus == '2') {
										if ($(table.rows[i].cells[j]).children(".ultest").children(".fourpoint").length == 0) {
											$(table.rows[i].cells[j]).children(".ultest").append('<li class="fourpoint"></li>');
										}
									}
								}
							}
						}
						n++;
					}
				}
			}
			$(".calender").show();
			common.closeWaiting();
		}, 'json');
	}

	//获得月份的天数
	function getMonthNum(month, year) {
		month = month - 1;
		var LeapYear = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true : false;
		var monthNum;
		switch (parseInt(month)) {
			case 0:
			case 2:
			case 4:
			case 6:
			case 7:
			case 9:
			case 11:
				monthNum = 31;
				break;
			case 3:
			case 5:
			case 8:
			case 10:
				monthNum = 30;
				break;
			case 1:
				monthNum = LeapYear ? 29 : 28;
		}
		return monthNum;
	}
	//每一列的悬挂事件改变当前样式
	$("#calender td:not(.tdtoday)").hover(function() {
		$(this).addClass("hover")
	}, function() {
		$(this).removeClass("hover");
	});
	//点击时间列表事件
	$("#calender td").die().live("click", function() {
		var dv = $(this).attr("data-date");
		if (dv != "&nbsp;") {
			$('.clickcss').removeClass('clickcss');
			$(this).addClass('clickcss');


			GetCheckInDetail($(this).attr("data-date"));
		} else {
			$('.clickcss').removeClass('clickcss');
		}
	});

	common.backOfHideCurrentWebview();
})