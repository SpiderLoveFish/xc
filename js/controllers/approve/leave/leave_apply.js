mui.init();
mui.plusReady(function() {
	mui.previewImage();
	var id;
	var showMenu = false;
	var isToUser = true; //是否点击的负责人,false为相关人
	var toUserArray; //负责人userid列表
	var ccUserArray; //相关人userid列表
	var toUserList; //负责人对象列表
	var ccUserList; //相关人对象列表
	var menu = null;

	mask = mui.createMask(_closeMenu);
	//plusReady事件后，自动创建menu窗口；
	document.getElementById("icon-toUser").addEventListener('tap', function() {
		userListInit(toUserArray);
		openMenu();
		isToUser = true;
	});
	document.getElementById("icon-ccUser").addEventListener('tap', function() {
		userListInit(ccUserArray);
		openMenu();
		isToUser = false;
	});
	//自定义事件 传入用户userid集合到UserList页面
	function userListInit(userList) {
		mui.fire(menu, 'userListInit', {
			userList: userList
		});
	}
	/**
	 * 显示菜单菜单
	 */

	function openMenu() {
		if (!showMenu) {
			//侧滑菜单处于隐藏状态，则立即显示出来；
			//显示完毕后，根据不同动画效果移动窗体；
			menu.show('none', 0, function() {
				menu.setStyle({
					left: '0%',
					transition: {
						duration: 150
					}
				});
			});
			//显示遮罩
			mask.show();
			showMenu = true;
		}
	}
	/**
	 * 关闭侧滑菜单（业务部分）
	 */

	function _closeMenu() {
		if (showMenu) {
			//关闭遮罩；
			//主窗体开始侧滑；
			menu.setStyle({
				left: '100%',
				transition: {
					duration: 150
				}
			});
			setTimeout(function() {
				menu.hide();
			}, 200);
			//改变标志位
			showMenu = false;
		}
	}
	mui.plusReady(function() {
		//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
		setTimeout(function() {
			//侧滑菜单默认隐藏，这样可以节省内存；
			menu = mui.preload({
				id: 'user_list',
				url: '/view/common/user_list.html',
				styles: {
					left: '0%',
					width: '100%',
					zindex: 9997
				}
			});
		}, 300);
		// transData是自定义事件的名称，由其他页面通过 mui.fire 触发
		// transDataHandler 是处理自定义事件的函数名称 ，名字自己随便写
		window.addEventListener('transData', transDataHandler);
		//自定义事件处理逻辑 event参数不能少 
		function transDataHandler(event) {
			//获取从B页面传过来的数据
			mask.close();
			var tableview = eval(event.detail.tableview);
			var template = "<i>@name</i>";
			var toUser = document.getElementById("toUser");
			var ccUser = document.getElementById("ccUser");
			if (isToUser) {
				toUserArray = new Array();
				toUserList = new Array(); //负责人对象列表
				toUser.innerHTML = "";
				//选择的负责人
				for (var i = 0; i < tableview.length; i++) {
					var obj = tableview[i];
					toUserArray.push(obj.UserId);
					toUser.innerHTML += template.replace("@name", obj.UserName + ' ');
					toUserList.push(obj.UserId + "|" + obj.UserName);
				}
			} else {
				ccUserArray = new Array();
				ccUserList = new Array(); //相关人对象列表
				ccUser.innerHTML = "";
				//选择的相关人
				for (var i = 0; i < tableview.length; i++) {
					var obj = tableview[i];
					ccUserArray.push(obj.UserId);
					ccUser.innerHTML += template.replace("@name", obj.UserName + ' ');
					ccUserList.push(obj.UserId + "|" + obj.UserName);
				}
			}
		}
		//自定义事件 关闭menu层
		window.addEventListener('closeMenu', closeMenuHandler);

		function closeMenuHandler(event) {
			//获取从B页面传过来的数据
			mask.close();
		}
	});

	var startDate, startTime, endDate, endTime;
	(function(mui) {
		common.showWaiting(true);
		//mui初始化
		mui.init({
			swipeBack: true //启用右滑关闭功能
		});
		//绑定下拉列表
		common.setDropdownList("sltType", "1");
		//下拉列表选择事件
		var select = document.getElementById("sltType");
		select.addEventListener("change", function(e) {
			//请假单名称
			leaveTitle.value = getUserInfo().UserName + '-' + select.options[select.selectedIndex].text + '-' + noneToStr(new Date());
		});


		//请假时间 开始
		var pickStart = document.getElementById("pickStart");
		pickStart.addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				//开始日期
				var d = e.date;
				startDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
				//开始时间
				startTimeChoose(function(time) {
					startTime = time;
					$('#pickStart').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + startTime);
				});
			}, function(e) {

			}, {
				title: "开始日期"
			});
		});
		//请假时间 结束
		var pickEnd = document.getElementById("pickEnd");
		pickEnd.addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				//开始日期
				var d = e.date;
				endDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
				//截止时间
				endTimeChoose(function(time) {
					endTime = time;
					$('#pickEnd').text((d.getMonth() + 1) + "-" + d.getDate() + ' ' + endTime);
				});
			}, function(e) {

			}, {
				title: "截止日期"
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
				title: "截止时间",
				is24Hour: true,
				time: dTime
			});
		}
		common.click("uploadFile", function() {
			galleryImg();
		});

//		bar.style.width = "100%";
//		setTimeout(function() {
//			window.clearTimeout(timeout);
//			barDisplay();
//		}, 500);
	})(mui);
	var commitLock = true;
	var status = "0";
	//提交
	common.click("btnSubmit", function() {
		status = "1";
		insertLeave();
	});

	function insertLeave() {
		if (!commitLock) {
			return;
		}

		var leaveType = common.textValiAlert(document.getElementById("sltType").value, "请选择请假类型");
		if (!leaveType) {
			return;
		}
		var leaveTitle = common.textValiAlert(document.getElementById("leaveTitle").value, "请填写请假单名称");
		if (!leaveTitle) {
			return;
		}
		var leaveContent = common.textValiAlert(document.getElementById("leaveContent").value, "请填写请假事由");
		if (!leaveContent) {
			return;
		}
		var pickStart = document.getElementById("pickStart").innerHTML;
		if (pickStart == "开始时间") {
			alert("请填写开始时间");
			return;
		}
		var pickEnd = document.getElementById("pickEnd").innerHTML;
		if (pickEnd == "截止时间") {
			alert("请填写截止时间");
			return;
		}
		var leaveDay = common.numValiAlert(document.getElementById("leaveDay").value, "请假天数不符合规范");
		if (!leaveDay) {
			return;
		}
		var leaveHour = common.floatValiAlert(document.getElementById("leaveHour").value, "请假小时数不符合规范");
		if (!leaveHour) {
			return;
		}
		//负责人逻辑判断
		if (!toUserArray || toUserArray.length <= 0) {
			alert("请选择负责人..");
			return;
		}
		if (ccUserArray) {
			for (var i = 0; i < ccUserArray.length; i++) {
				var userId = ccUserArray[i];
				if (toUserArray.indexOf(userId) >= 0) {
					alert("负责人和相关人不能为同一个人..");
					return;
				}
			}
		}
		if (toUserArray.indexOf(getUserInfo().UserId) >= 0) {
			alert("你不能为负责人..");
			return;
		}

		var strToUser = "[";
		var strCcUser = "[";
		for (var i = 0; i < toUserList.length; i++) {
			strToUser += "\"" + toUserList[i] + "\",";
		}
		strToUser = strToUser.substring(0, strToUser.length - 1);
		if (ccUserList) {
			for (var n = 0; n < ccUserList.length; n++) {
				strCcUser += "\"" + ccUserList[n] + "\",";
			}
			strCcUser = strCcUser.substring(0, strCcUser.length - 1);
		}
		strToUser += "]";
		strCcUser += "]";
		var type = "insert";
		//推送消息后跳转 参与未审批
		var argu = "{'vid':'leave','pid':'1'}"; //推送接收参数
		var pushTitle = getUserInfo().UserName + "申请了请假:" + '李长皓_请假';
		//图片上传
		var tempobj_ImageStr = $("#imglist").find("input[name='optionImages']");
		var ImageModelSql = "";
		if (tempobj_ImageStr) {
			for (var j = 0; j < tempobj_ImageStr.length; j++) {
				ImageModelSql = ImageModelSql + $(tempobj_ImageStr[j]).val() + ",";
			}
		}
		var data = {
			id: '',
			type: type,
			status: "1",
			approveOrder: 0,
			ImageList: ImageModelSql,
			leaveType: leaveType, //类型
			leaveTitle: leaveTitle, //请假单名称
			leaveContent: leaveContent, //请假事由
			pickDateBtn: startDate, //开始日期
			pickTimeBtn: startTime, //开始时间
			pickDateBtnEnd: endDate, //截止日期
			pickTimeBtnEnd: endTime, //截止时间
			leaveDay: leaveDay, //请假天数
			leaveHour: leaveHour, //请假小时数
			hidToUser: strToUser, //负责人
			hidCcUser: strCcUser, //相关人
			pushTitle: pushTitle,
			pushContent: leaveContent,
			param: argu
		};
		commitLock = false;
		common.showWaiting();
		common.postApi("LeaveManage", data, function(response) {
			if (response.data == "success") {
				common.toast("提交成功，自动跳转到列表界面..");
				go();
			} else {
				common.toast("服务器异常，请稍候重试..");
			}
			commitLock = true;
			common.closeWaiting();
		}, 'json');
	}

	function go() {
		var listWebview = plus.webview.currentWebview();
		listWebview.loadURL('../list/list_launched.html');

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
		var array = response.responseText.split('|');
		if (array[0] == '0') {

			var template = '<input type="hidden" name="optionImages" value="' + array[1] + '"><img src="' + array[1] + '" data-preview-src="' + array[1] + '" data-preview-group="1">';
			$("#imglist").append(template);
		}

	}

	//------------------------------图片上传结束---------------------------------------------

	/************************************************拍照start***********************************************/
	// 拍照
	//	function getImage() {
	//		var cmr = plus.camera.getCamera();
	//		cmr.captureImage(function(p) {
	//			alert(p);
	//			uploadImg(p);
	//			plus.io.resolveLocalFileSystemURL(p, function(entry) {
	//				createItem(entry); //图片路径
	//			}, function(e) {
	//				alert(e.message);
	//			});
	//		}, function(e) {}, {
	//			filename: "_doc/camera/",
	//			index: 1
	//		});
	//	}
	//	//上传图片
	//	function uploadImg(img) {
	//		var url = img;
	//		var src = img;
	//		var token = qiao.qiniu.uptoken(src);
	//		var filename = qiao.qiniu.file;
	//		setTimeout(function() {
	//			qiao.h.upload({
	//				url: 'http://upload.qiniu.com/',
	//				filepath: src,
	//				datas: [{
	//					key: 'key',
	//					value: filename
	//				}, {
	//					key: 'token',
	//					value: token
	//				}],
	//				success: function() {
	//					url = qiao.qiniu.url();
	//					alert(url);
	//					console.log(url);
	//				},
	//				fail: function(s) {
	//					alert('上传文件失败：' + s);
	//				}
	//			});
	//		}, 1500);
	//	}
	//	// 添加播放项
	//	function createItem(entry) {
	//		var hi = document.getElementById("history");
	//		var le = document.getElementById("empty");
	//		var li = document.createElement("li");
	//		li.className = "ditem";
	//		li.innerHTML = '<span class="iplay"><font class="aname"></font><br/><font class="ainf"></font></span>';
	//		li.setAttribute("onclick", "displayFile(this);");
	//		hi.insertBefore(li, le.nextSibling);
	//		li.querySelector(".aname").innerText = entry.name;
	//		li.querySelector(".ainf").innerText = "...";
	//		li.entry = entry;
	//		updateInformation(li);
	//		// 设置空项不可见
	//		le.style.display = "none";
	//	}
	//	// 获取录音文件信息
	//	function updateInformation(li) {
	//		if (!li || !li.entry) {
	//			return;
	//		}
	//		var entry = li.entry;
	//		entry.getMetadata(function(metadata) {
	//			li.querySelector(".ainf").innerText = dateToStr(metadata.modificationTime);
	//		}, function(e) {
	//			outLine("获取文件\"" + entry.name + "\"信息失败：" + e.message);
	//		});
	//	}
	//	var w = null;
	//	// 显示文件
	//	function displayFile(li) {
	//		if (!li || !li.entry) {
	//			ouSet("无效的媒体文件");
	//			return;
	//		}
	//		var name = li.entry.name;
	//		var suffix = name.substr(name.lastIndexOf('.'));
	//		var url = "";
	//		if (suffix == ".mov" || suffix == ".3gp" || suffix == ".mp4" || suffix == ".avi") {
	//			return;
	//		} else {
	//			url = "/views/common/camera_image.html";
	//		}
	//		w = plus.webview.create(url, url, {
	//			hardwareAccelerated: true,
	//			scrollIndicator: 'none',
	//			scalable: true,
	//			bounce: "all"
	//		});
	//		w.addEventListener("loaded", function() {
	//			w.evalJS("loadMedia('" + li.entry.toLocalURL() + "')");
	//		}, false);
	//		w.addEventListener("close", function() {
	//			w = null;
	//		}, false);
	//		w.show("pop-in");
	//	}
	//	/************************************************拍照end***********************************************/
	//
	//	/*********************************************相册选取start********************************************/
	//	function galleryImg() {
	//		// 从相册中选择图片
	//		plus.gallery.pick(function(path) {
	//			plus.io.resolveLocalFileSystemURL(path, function(entry) {
	//				createItem(entry); //图片路径
	//				appendFile(entry)
	//			}, function(e) {
	//				alert(e.message);
	//			});
	//		}, function(e) {
	//
	//		}, {
	//			filter: "image"
	//		});
	//	}
	//	/*********************************************相册选取end********************************************/
	//
	//	var f1 = null;
	//
	//	function appendFile(path) {
	//		var task = plus.uploader.createUpload('http://192.168.10.13:81/Handler.ashx', {
	//				method: "POST",
	//				blocksize: 204800,
	//				priority: 100
	//			},
	//			function(t, status) {
	//				if (status == 200) {
	//					if (success) success(t);
	//				} else {
	//					if (fail) fail(status);
	//				}
	//			}
	//		);
	//		task.addFile(filepath, {
	//			key: 'file'
	//		});
	//		if (datas && datas.length) {
	//			for (var i = 0; i < datas.length; i++) {
	//				var data = datas[i];
	//				task.addData(data.key, data.value);
	//			}
	//		}
	//		task.start();
	//	}
	//
	//	//照片点击
	//	common.click("picture-btn", function() {
	//		var btnArray = [{
	//			title: "拍照"
	//		}, {
	//			title: "相册选取"
	//		}];
	//		plus.nativeUI.actionSheet({
	//			cancel: "取消",
	//			buttons: btnArray
	//		}, function(e) {
	//			var index = e.index;
	//			if (index == 1) {
	//				getImage();
	//				//拍照
	//			} else if (index == 2) {
	//				//相册
	//				galleryImg();
	//			}
	//		});
	//	});

	function alert(alertMsg) {
		mui.alert(alertMsg, "提示");
	};
	//返回
	common.backOfHideCurrentWebview();
});