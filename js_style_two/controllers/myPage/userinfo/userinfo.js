var Avatar = document.getElementById("Avatar");
mui.plusReady(function() {
	common.backOfHideCurrentWebview();
	mui.previewImage();
	getuser();
	document.getElementById("updateImg").addEventListener('tap', function() {
		galleryImg();
	});
	//	common.click('updateImg', function() {
	//		
	//	});
	//-----------------------------------图片上传开始----------------------------------------------------
	var f1 = null;

	function galleryImg() {
		// 从相册中选择图片
		plus.gallery.pick(function(path) {
			common.showWaiting('正在上传');

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
				uploadimg(array[1]);
			}
		}
		//------------------------------图片上传结束---------------------------------------------
});

function uploadimg(imgurl) {
	var data = {
		imgurl: imgurl
	};
	common.postApi('UpdateUserAvatar', data, function(response) {
		if (response.data == "success") {
			common.closeWaiting();
			Avatar.src = imgurl;
			common.initMine();
			common.initAddList();
			common.alert('修改成功');
		}
	}, 'json');
}

function getuser() {
	common.showWaiting(true);
	var userid = getUserInfo().UserId;
	var data = {
		selectkey: userid,
		uType: 'GetUserDetialByString',
		statrCount: '',
		showCount: ''
	};

	var username = document.getElementById("username");
	var mobile = document.getElementById("mobile");
	var DepartmentName = document.getElementById("DepartmentName");
	var Position = document.getElementById("Position");
	var Email = document.getElementById("Email");
	var Address = document.getElementById("Address");
	common.postApi('GetUsersBySelectKey', data, function(response) {

		dataArray = eval(response.data);
		//alert(dataArray.length)
		for (var i = 0; i < dataArray.length; i++) {
			var obj = dataArray[i];
			Avatar.src = obj.Avatar;
			username.innerText = obj.UserName;
			mobile.innerText = obj.Mobile;
			DepartmentName.innerText = obj.DepartmentName;
			Position.innerText = obj.Position;
			Email.innerText = obj.Email;
			Address.innerText = obj.Address;
		}
		common.closeWaiting();
	}, 'json');
}