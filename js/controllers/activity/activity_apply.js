mui.plusReady(function() {
	mui.previewImage();
	//获取日期
	var startDate, startTime, endDate, endTime, overDate, overTime;

	var pickDateBtn = document.getElementById("pickDateBtn");
	pickDateBtn.addEventListener('tap', function() {
		plus.nativeUI.pickDate(function(e) {
			//开始日期
			var d = e.date;
			overDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

			startTimeChoose(function(time) {
				overTime = time;
				$('#pickDateBtn').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + overTime);
			});
		}, function(e) {

		}, {
			title: "报名截止日期"
		});
	});

	////////////////////////




	var pickStart = document.getElementById("starDate");
	pickStart.addEventListener('tap', function() {
		plus.nativeUI.pickDate(function(e) {
			//开始日期
			var d = e.date;
			startDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			//开始时间
			startTimeChoose(function(time) {
				startTime = time;
				$('#starDate').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + startTime);
			});
		}, function(e) {

		}, {
			title: "开始日期"
		});
	});
	var pickEnd = document.getElementById("endDate");
	pickEnd.addEventListener('tap', function() {
		plus.nativeUI.pickDate(function(e) {
			//开始日期
			var d = e.date;
			endDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
			//截止时间
			endTimeChoose(function(time) {
				endTime = time;
				$('#endDate').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + endTime);
			});
		}, function(e) {

		}, {
			title: "结束日期"
		});
	});

	function startTimeChoose(success) {
		var dTime = new Date();
		dTime.setHours(9, 0);
		plus.nativeUI.pickTime(function(e) {
			var d = e.date;
			var minute;
			if (d.getMinutes() < 10) {
				minute = "0" + d.getMinutes();
			} else {
				minute = d.getMinutes();
			}
			//成功回调
			success(d.getHours() + ":" + minute);
		}, function(e) {
			//pickTimeBtn.innerText = "请选择时间"
		}, {
			title: "开始时间",
			is24Hour: true,
			time: dTime
		});
	}

	//截止时间选择
	function endTimeChoose(success) {
		var dTime = new Date();
		dTime.setHours(18, 0);
		plus.nativeUI.pickTime(function(e) {
			var d = e.date;
			var minute;
			if (d.getMinutes() < 10) {
				minute = "0" + d.getMinutes();
			} else {
				minute = d.getMinutes();
			}
			success(d.getHours() + ":" + minute);
		}, function(e) {
			//pickTimeBtnEnd.innerText = "请选择时间"
		}, {
			title: "结束时间",
			is24Hour: true,
			time: dTime
		});
	}

	//***********************处理开关事件*****************************************
	var IsHost = '0';
	mui('.mui-content .mui-switch').each(function() { //循环所有toggle
		/**
		 * toggle 事件监听
		 */
		this.addEventListener('toggle', function(event) {
			//保存选中状态
			if (event.detail.isActive) {
				IsHost = '1';
			} else {
				IsHost = '0';
			}
		});
	});
	//***********************处理开关事件结束*****************************************
	common.click("uploadFile", function() {
		galleryImg();
	});
	var commitLock = true;
	common.click("btnSubmit", function() {
		if (!commitLock) {
			return;
		}
		var AThemeType = common.textValiAlert(document.getElementById("ATheme").value, "请填写活动标题");
		if (!AThemeType) {
			return;
		}
		var AContextType = common.textValiAlert(document.getElementById("AContext").value, "请填写活动内容");
		if (!AContextType) {
			return;
		}
		var AddressType = common.textValiAlert(document.getElementById("Address").value, "请填写活动地址");
		if (!AddressType) {
			return;
		}
		var userCountType = common.textValiAlert(document.getElementById("userCount").value, "请填写人数限制");
		if (!userCountType) {
			return;
		}
		var userCountNumType = common.numValiAlert(document.getElementById("userCount").value, "人数限制不符合规范");
		if (!userCountNumType) {
			return;
		}

		//*******************************时间验证开始********************************************
		var starDateHtml = document.getElementById("starDate").innerHTML;
		if (starDateHtml == "开始时间") {
			alert("请填写开始时间");
			return;
		}
		var endDateHtml = document.getElementById("endDate").innerHTML;
		if (endDateHtml == "结束时间") {
			alert("请填写结束时间");
			return;
		}
		var pickDateBtnHtml = document.getElementById("pickDateBtn").innerHTML;
		if (pickDateBtnHtml == "请选择日期时间") {
			alert("请填写报名截至时间");
			return;
		}

		var jiezhi = overDate + ' ' + overTime;
		var kaishi = startDate + ' ' + startTime;
		var jieshu = endDate + ' ' + endTime;
		if (new Date(jiezhi) < new Date()) {
			alert("报名截止时间不能小于当前时间！");
			return;
		}
		if (new Date(kaishi) < new Date()) {
			alert("活动开始时间不能小于当前时间！");
			return;
		}
		if (new Date(jieshu) < new Date(kaishi)) {
			alert("活动结束时间必须大于开始时间！");
			return;
		}
		if (new Date(jiezhi) > new Date(kaishi)) {
			alert("报名截止时间应该小于活动开始时间！");
			return;
		}
		//*******************************时间验证结束********************************************
		var title = document.getElementById("ATheme").value;
		var context = document.getElementById("AContext").value;
		var AAdress = document.getElementById("Address").value;
		var userCount = document.getElementById("userCount").value;
		//获取图片
		var tempobj_ImageStr = $("#imglist").find("input[name='optionImages']");
		var ImageModelSql = "";
		var IsHostPic = '';
		if (tempobj_ImageStr) {
			for (var j = 0; j < tempobj_ImageStr.length; j++) {
				IsHostPic = $(tempobj_ImageStr[0]).val();
				ImageModelSql = ImageModelSql + $(tempobj_ImageStr[j]).val() + ",";
			}
		}
		if (!ImageModelSql) {
			common.alert("请上传图片");
			return;
		}
		var data = {
			id: '',
			title: title,
			context: context,
			SignUpEndTime: overDate + " " + overTime,
			StartTime: startDate + " " + startTime,
			EndTime: endDate + " " + endTime,
			AAdress: AAdress,
			ImageList: ImageModelSql,
			ASum: userCount,
			IsHost: IsHost,
			IsHostPic: IsHostPic,
			type: 'insert',
			status: ''
		};
		commitLock = false;
		common.showWaiting();
		//						alert(JSON.stringify(data));
		common.postApi("ActivityManage", data, function(response) {
			if (response.data == "success") {
				mui.toast("提交成功，自动跳转到列表界面..");
				go();
			} else {
				mui.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	});

	function go() {
		var listWebview = plus.webview.currentWebview();
		listWebview.loadURL('../activity/activity_list.html');
	}
	//-----------------------------------图片上传开始----------------------------------------------------
	var f1 = null;

	function galleryImg() {
		// 从相册中选择图片
		plus.gallery.pick(function(path) {
			common.showWaiting();
			GetBase64(path);
		}, function(e) {

		}, {
			filter: "image"
		});
	}

	function GetBase64(url) {
		// 兼容以“file:”开头的情况
		if (0 != url.toString().indexOf("file://")) {
			url = "file://" + url;
		}
		var _img_ = new Image();
		_img_.src = url; // 传过来的图片路径在这里用。
		_img_.onload = function() {
			var tmph = _img_.height;
			var tmpw = _img_.width;
			var isHengTu = tmpw > tmph;
			var max = Math.max(tmpw, tmph);
			var min = Math.min(tmpw, tmph);
			var bili = min / max;
			if (max > 1200) {
				max = 1200;
				min = Math.floor(bili * max);
			}
			tmph = isHengTu ? min : max;
			tmpw = isHengTu ? max : min;
			_img_.style.border = "1px solid rgb(200,199,204)";
			_img_.style.margin = "10px";
			_img_.style.width = "150px";
			_img_.style.height = "150px";
			_img_.onload = null;
			plus.io.resolveLocalFileSystemURL(url, function(entry) {
					entry.file(function(file) {
						canvasResize(file, {
							width: tmpw,
							height: tmph,
							crop: false,
							quality: 50, //压缩质量
							rotate: 0,
							format: 'jpg',
							callback: function(data, width, height) {
								f1 = data;
								upload();
							}
						});
					});
				},
				function(e) {
					common.closeWaiting();
				});
		};
	};

	function upload(path) {
		var task = plus.uploader.createUpload(UploadImageUrl, {
				method: "POST",
				blocksize: 204800,
				priority: 1000
			},
			function(t, status) {
				if (status == 200) {
					if (success) success(t);
				} else {
					if (fail) fail(status);
				}
				common.closeWaiting();
			}
		);
		task.addFile(path, {
			key: 'file'
		});
		task.addData('base64', f1);
		task.start();
	}
	//成功响应的回调函数
	var success = function(response) {
			plus.nativeUI.closeWaiting();
			var array = response.responseText.split('|');
			if (array[0] == '0') {
				var template = '<img src="' + array[1] + '" data-preview-src="' + array[1] + '" data-preview-group="1"/><input type="hidden" name="optionImages" value="' + array[1] + '" />';
				$("#imglist").append(template);
			}
		}
		//------------------------------图片上传结束---------------------------------------------
	common.backOfHideCurrentWebview();
});