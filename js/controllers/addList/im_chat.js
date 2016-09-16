// 初始化。
mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: true, //默认为false，不监听
		release: true //默认为false，不监听
	}
});
RongIMClient.init("tdrvipksrbrq5");
RongIMLib.RongIMEmoji.init();
common.backOfHideCurrentWebview();
var friendhtml = '<div class="msg-item" msg-type="text">' + '<img class="msg-user-img" src="@Avatar" alt="" />' + '<div class="msg-content">' + '<div class="msg-content-inner text">@text</div>' + '<div class="msg-content-arrow"></div>' + '</div>' + '<div class="mui-item-clear"></div>' + '</div>';
var friendImghtml = '<div class="msg-item" msg-type="Img">' + '<img class="msg-user-img" src="@Avatar" alt="" />' + '<div class="msg-content">' + '<div class="msg-content-inner img"><img src="@text" data-preview-src="@text1" data-preview-group="1" style="max-width: 100px;"/></div>' + '<div class="msg-content-arrow"></div>' + '</div>' + '<div class="mui-item-clear"></div>' + '</div>';
var friendSoundhtml = '<div class="msg-item" msg-type="Sound" msg-content="@123">' + '<img class="msg-user-img" src="@Avatar" alt="" />' + '<div class="msg-content">' + '<div class="msg-content-inner sound" ><span class="mui-icon" style="font-size: 18px;font-weight: bold;padding: 0;"></span><span class="play-state">点击播放</span><audio class="play-audio" controls src="@text" style="display: none;"/></div>' + '<div class="msg-content-arrow"></div>' + '</div>' + '<div class="mui-item-clear"></div>' + '</div>';
var myhtml = '<div class="msg-item msg-item-self" msg-type="text">' + '<img class="msg-user" src="@Avatar" alt="" />' + '<div class="msg-content">' + '<div class="msg-content-inner text">@text</div>' + '<div class="msg-content-arrow"></div>' + '</div>' + '<div class="mui-item-clear"></div>' + '</div>';
var myImghtml = '<div class="msg-item msg-item-self" msg-type="Img">' + '<img class="msg-user" src="@Avatar" alt="" />' + '<div class="msg-content">' + '<div class="msg-content-inner img"><img src="@text" data-preview-src="@text1" data-preview-group="1" style="max-width: 100px;"/></div>' + '<div class="msg-content-arrow"></div>' + '</div>' + '<div class="mui-item-clear"></div>' + '</div>';
var mySoundhtml = '<div class="msg-item msg-item-self" msg-type="Sound" msg-content="@123">' + '<img class="msg-user" src="@Avatar" alt="" />' + '<div class="msg-content">' + '<div class="msg-content-inner sound"><span class="mui-icon" style="font-size: 18px;font-weight: bold;padding: 0;"></span><span class="play-state">点击播放</span><audio class="play-audio" controls src="@text" style="display: none;"/></div>' + '<div class="msg-content-arrow"></div>' + '</div>' + '<div class="mui-item-clear"></div>' + '</div>';

var token = ''; //'+ls/Q7icDjmyg0+Bhmu9hvJdfR7EiYUK7R1518i20jnWaR2zmsCmKstF80NX2bGm9+cXfBqL9UulGGiQkcTE2PYsJYPjam5u'; //李东奎
var ID = common.getQueryString("id");
var MIN_SOUND_TIME = 800;
var userName = '';
var Avatar = '';
var userData = {
	selectkey: ID,
	uType: 'GetUserDetialByString',
	statrCount: '0',
	showCount: '10'
};
common.postApi('GetUsersBySelectKey', userData, function(response) {
	dataArray = eval(response.data);
	var trace={
			"html":'',
			"js":'im_chat',
			"url":'GetUsersBySelectKey',
			"urldata":JSON.stringify(userData),
			"returndata":JSON.stringify(response.data)
		}
		 common.postTraceApi(trace);
		 	 alert(JSON.stringify(response.data))
	for (var i = 0; i < dataArray.length; i++) {
		var obj = dataArray[i];
		userName = obj.UserName;
		Avatar = obj.Avatar;
	}
}, 'json');
var tokenData = {
	userid: getUserInfo().UserId,
	username: getUserInfo().UserName,
	portraitUri: getUserInfo().Avatar
};
common.postApi("GetRongToken", tokenData, function(response) {
	token = response.data.token;
	//var tokens = '+ls/Q7icDjmyg0+Bhmu9hvJdfR7EiYUK7R1518i20jnWaR2zmsCmKstF80NX2bGm9+cXfBqL9UulGGiQkcTE2PYsJYPjam5u';//李东奎
	//var tokens = 'lZQTshWhyuWMpWzCtFO50/JdfR7EiYUK7R1518i20jnWaR2zmsCmKpC+Gcc+BdkapCXUz96CdVCkWtN6/XS/bxVNctobUzxZ'; //周景龙
	// 连接融云服务器。
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			// 此处处理连接成功。
		},
		onError: function(errorCode) {
			// 此处处理连接错误。
			var info = '';
			switch (errorCode) {
				case RongIMClient.callback.ErrorCode.TIMEOUT:
					info = '超时';
					break;
				case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
					info = '未知错误';
					break;
				case RongIMClient.ConnectErrorStatus.UNACCEPTABLE_PROTOCOL_VERSION:
					info = '不可接受的协议版本';
					break;
				case RongIMClient.ConnectErrorStatus.IDENTIFIER_REJECTED:
					info = 'appkey不正确';
					break;
				case RongIMClient.ConnectErrorStatus.SERVER_UNAVAILABLE:
					info = '服务器不可用';
					break;
				case RongIMClient.ConnectErrorStatus.TOKEN_INCORRECT:
					info = 'token无效';
					break;
				case RongIMClient.ConnectErrorStatus.NOT_AUTHORIZED:
					info = '未认证';
					break;
				case RongIMClient.ConnectErrorStatus.REDIRECT:
					info = '重新获取导航';
					break;
				case RongIMClient.ConnectErrorStatus.PACKAGE_ERROR:
					info = '包名错误';
					break;
				case RongIMClient.ConnectErrorStatus.APP_BLOCK_OR_DELETE:
					info = '应用已被封禁或已被删除';
					break;
				case RongIMClient.ConnectErrorStatus.BLOCK:
					info = '用户被封禁';
					break;
				case RongIMClient.ConnectErrorStatus.TOKEN_EXPIRE:
					info = 'token已过期';
					break;
				case RongIMClient.ConnectErrorStatus.DEVICE_ERROR:
					info = '设备号错误';
					break;
			}
			common.toast("失败:" + info);
		}
	});
}, 'json');

// 消息监听器
RongIMClient.getInstance().setOnReceiveMessageListener({
	// 接收到的消息
	onReceived: function(data) {
		//设置会话名称
		if (data.getTargetId() == ID) {
			addHistoryMessages(data, 'friend');
		}
	}
});
RongIMClient.setConnectionStatusListener({
	onChanged: function(status) {
		switch (status) {
			//链接成功
			case RongIMClient.ConnectionStatus.CONNECTED:
				common.toast('链接成功');
				break;
				//正在链接
			case RongIMClient.ConnectionStatus.CONNECTING:
				//common.toast('正在链接');
				break;
				//重新链接
			case RongIMClient.ConnectionStatus.RECONNECT:
				//common.toast('重新链接');
				break;
				//其他设备登陆
			case RongIMClient.ConnectionStatus.OTHER_DEVICE_LOGIN:
				//连接关闭
			case RongIMClient.ConnectionStatus.CLOSURE:
				//未知错误
			case RongIMClient.ConnectionStatus.UNKNOWN_ERROR:
				//登出
			case RongIMClient.ConnectionStatus.LOGOUT:
				//用户已被封禁
			case RongIMClient.ConnectionStatus.BLOCK:
				break;
		}
	}
});
//渲染历史记录
function addHistoryMessages(item, type) {
	//如果接收的消息为通知类型或者状态类型的消息，什么都不执行
	//	if (item instanceof RongIMClient.NotificationMessage || item instanceof RongIMClient.StatusMessage) {
	//		return;
	//	}
	//	alert(RongIMClient.getInstance().getUnreadMessageCount());
	if (type == 'my') {
		switch (item.getMessageType()) {
			case RongIMClient.MessageType.TextMessage:
				document.getElementById("msg-list").innerHTML += myhtml.replace('@Avatar', getUserInfo().Avatar).replace('@text', item.getContent());
				break;
			case RongIMClient.MessageType.ImageMessage:
				document.getElementById("msg-list").innerHTML += myImghtml.replace('@Avatar', getUserInfo().Avatar).replace('@text', item.getContent()).replace('@text1', item.getContent());
				break;
			case RongIMClient.MessageType.VoiceMessage:
				// 格式为 AMR 格式的 base64 码。
				//var base64 = item.getContent();
				document.getElementById("msg-list").innerHTML += mySoundhtml.replace('@Avatar', getUserInfo().Avatar).replace('@text', item.getContent());
				break;
			default:
				break;
		}
	} else {
		switch (item.getMessageType()) {
			case RongIMClient.MessageType.TextMessage:
				document.getElementById("msg-list").innerHTML += friendhtml.replace('@Avatar', Avatar).replace('@text', RongIMLib.RongIMEmoji.symbolToHTML(item.getContent()));
				break;
			case RongIMClient.MessageType.ImageMessage:
				document.getElementById("msg-list").innerHTML += friendImghtml.replace('@Avatar', Avatar).replace('@text', item.getContent()).replace('@text1', item.getContent());
				break;
			case RongIMClient.MessageType.VoiceMessage:
				// 格式为 AMR 格式的 base64 码。
				document.getElementById("msg-list").innerHTML += friendSoundhtml.replace('@Avatar', Avatar).replace('@text', item.getContent());
				break;
			default:
				break;
		}
	}
	//	RongIMClient.getInstance().clearMessagesUnreadStatus(RongIMClient.ConversationType.PRIVATE, item.getTargetId());
	document.getElementById("msg-text").value = '';
}
sendMessage = function(msgType) {
	//发送消息
	var conver = RongIMClient.ConversationType.PRIVATE; // 私聊
	if (msgType == 'text') {
		var text = document.getElementById("msg-text").value;
		if ($.trim(text) == '') {
			return;
		}
		var content = new RongIMClient.MessageContent(RongIMClient.TextMessage.obtain(text));
	} else if (msgType == 'img') {
		var content = new RongIMClient.MessageContent(RongIMClient.ImageMessage.obtain(imgUrl, imgUrl));
	} else if (msgType == 'Sound') {
		var content = new RongIMClient.MessageContent(RongIMClient.VoiceMessage.obtain(audioUrl, audioUrl));
	}
	var targetId = ID; //目标ID
	var userData = {
		userid: ID
	};
	RongIMClient.getInstance().sendMessage(RongIMClient.ConversationType.setValue(conver), targetId, content, null, {
		onSuccess: function() {
			common.toast("发送成功！")
		},
		onError: function(x) {
			var info = '';
			switch (x) {
				case RongIMClient.callback.ErrorCode.TIMEOUT:
					info = '超时';
					break;
				case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
					info = '未知错误';
					break;
				case RongIMClient.SendErrorStatus.REJECTED_BY_BLACKLIST:
					info = '在黑名单中，无法向对方发送消息';
					break;
				case RongIMClient.SendErrorStatus.NOT_IN_DISCUSSION:
					info = '不在讨论组中';
					break;
				case RongIMClient.SendErrorStatus.NOT_IN_GROUP:
					info = '不在群组中';
					break;
				case RongIMClient.SendErrorStatus.NOT_IN_CHATROOM:
					info = '不在聊天室中';
					break;
				default:
					info = x;
					break;
			}
			common.toast('发送失败:' + info);
		}
	});
	addHistoryMessages(content.getMessage(), 'my');
	common.postApi("CheckUserOnline", userData, function(response) {
			 alert(JSON.stringify(response.data))
		if (response.data.status == '0') {
			common.toast("用户不在线 --执行推送服务！");
		}
	}, 'json');
};
var f1 = null;
var imgUrl = '';
var audioUrl = '';

document.getElementById("msg_face").addEventListener('tap', function() {
		$(this).toggleClass("btn_face_active");
		$(".msg_face_space").toggle();
		$("footer").toggleClass("footerbottom");
	})
	//$("#msg_face").click(function(){
	//		$(this).toggleClass("btn_face_active");
	//	$(".msg_face_space").toggle();
	//	$("footer").toggleClass("footerbottom");
	//})

$(".footer-center .input-text").focus(function() {
	$("footer").removeClass("footerbottom");
	$(".msg_face_space").hide();
});
mui.plusReady(function() {
	mui.previewImage();
	var emojis = RongIMLib.RongIMEmoji.emojis;
	document.getElementById("userName").innerText = userName;
	for (var i = 0; i < emojis.length; i++) {
		if (i < 27) {
			document.getElementById("yi_page").innerHTML += emojis[i].innerHTML;
		} else if (i >= 27 && i < 54) {
			document.getElementById("er_page").innerHTML += emojis[i].innerHTML;
		} else if (i >= 54 && i < 81) {
			document.getElementById("san_page").innerHTML += emojis[i].innerHTML;
		} else if (i >= 81 && i < 108) {
			document.getElementById("si_page").innerHTML += emojis[i].innerHTML;
		}
	}
	var ui = {
		body: document.querySelector('body'),
		footer: document.querySelector('footer'),
		footerRight: document.querySelector('.footer-right'),
		footerLeft: document.querySelector('.footer-left'),
		btnMsgType: document.querySelector('#msg-type'),
		boxMsgText: document.querySelector('#msg-text'),
		boxMsgSound: document.querySelector('#msg-sound'),
		btnMsgImage: document.querySelector('#msg-image'),
		areaMsgList: document.querySelector('#msg-list'),
		boxSoundAlert: document.querySelector('#sound-alert'),
		h: document.querySelector('#h'),
		content: document.querySelector('.mui-content')
	};
	mui(".mui-slider-group").on('tap', 'span', function() {
		document.getElementById("msg-text").value += this.innerHTML;
		mui.trigger(ui.boxMsgText, 'input', null);
	})
	var recordCancel = false;
	var recorder = null;
	var audio_tips = document.getElementById("audio_tips");
	var startTimestamp = null;
	var stopTimestamp = null;
	var stopTimer = null;
	ui.footerRight.addEventListener('release', function(event) {
		if (document.getElementById("msg_face").className.indexOf("btn_face_active") > 0) {
			mui.trigger(document.getElementById("msg_face"), 'tap');
		}
		if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
			//showKeyboard();
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 150);
			ui.boxMsgText.blur();
			document.body.focus();
			sendMessage('text');
			ui.boxMsgText.value = '';
			mui.trigger(ui.boxMsgText, 'input', null);
		} else if (ui.btnMsgType.classList.contains('mui-icon-mic')) {
			ui.btnMsgType.classList.add('mui-icon-compose');
			ui.btnMsgType.classList.remove('mui-icon-mic');
			ui.boxMsgText.style.display = 'none';
			ui.boxMsgSound.style.display = 'block';
			ui.boxMsgText.blur();
			document.body.focus();
		} else if (ui.btnMsgType.classList.contains('mui-icon-compose')) {
			ui.btnMsgType.classList.add('mui-icon-mic');
			ui.btnMsgType.classList.remove('mui-icon-compose');
			ui.boxMsgSound.style.display = 'none';
			ui.boxMsgText.style.display = 'block';
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 150);
		}
	}, false);
	ui.boxMsgText.addEventListener('input', function(event) {
		ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
		ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
		ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
		//		ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
		ui.content.style.paddingBottom = ui.footer.style.height;
	});
	ui.boxMsgSound.addEventListener('hold', function(event) {
		recordCancel = false;
		if (stopTimer) clearTimeout(stopTimer);
		audio_tips.innerHTML = "手指上划，取消发送";
		ui.boxSoundAlert.classList.remove('rprogress-sigh');
		setSoundAlertVisable(true);
		recorder = plus.audio.getRecorder();
		if (recorder == null) {
			plus.nativeUI.toast("不能获取录音对象");
			return;
		}
		startTimestamp = (new Date()).getTime();
		recorder.record({
				filename: "_doc/audio/"
			},
			function(path) {
				if (recordCancel) return;
				var reader = null;
				plus.io.resolveLocalFileSystemURL(path, function(entry) {
						entry.file(function(file) {
							uploadAudio(file.fullPath);
						});
					},
					function(e) {});
			},
			function(e) {
				plus.nativeUI.toast("录音时出现异常: " + e.message);
			});
	}, false);
	ui.body.addEventListener('drag', function(event) {
		//console.log('drag');
		if (Math.abs(event.detail.deltaY) > 50) {
			if (!recordCancel) {
				recordCancel = true;
				if (!audio_tips.classList.contains("cancel")) {
					audio_tips.classList.add("cancel");
				}
				audio_tips.innerHTML = "松开手指，取消发送";
			}
		} else {
			if (recordCancel) {
				recordCancel = false;
				if (audio_tips.classList.contains("cancel")) {
					audio_tips.classList.remove("cancel");
				}
				audio_tips.innerHTML = "手指上划，取消发送";
			}
		}
	}, false);
	ui.boxMsgSound.addEventListener('release', function(event) {
		//console.log('release');
		if (audio_tips.classList.contains("cancel")) {
			audio_tips.classList.remove("cancel");
			audio_tips.innerHTML = "手指上划，取消发送";
		}
		//
		stopTimestamp = (new Date()).getTime();
		if (stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
			audio_tips.innerHTML = "录音时间太短";
			ui.boxSoundAlert.classList.add('rprogress-sigh');
			recordCancel = true;
			stopTimer = setTimeout(function() {
				setSoundAlertVisable(false);
			}, 800);
		} else {
			setSoundAlertVisable(false);
		}
		recorder.stop();
	}, false);
	var setSoundAlertVisable = function(show) {
		if (show) {
			ui.boxSoundAlert.style.display = 'block';
			ui.boxSoundAlert.style.opacity = 1;
		} else {
			ui.boxSoundAlert.style.opacity = 0;
			//fadeOut 完成再真正隐藏
			setTimeout(function() {
				ui.boxSoundAlert.style.display = 'none';
			}, 200);
		}
	};
	mui('#msg-list').on('tap', '.msg-content-inner', function() {
		if (this.className.indexOf('sound') > 0) {
			var play_audio = this.querySelector('.play-audio');
			var playState = this.querySelector('.play-state');
			playState.innerText = '正在播放...';
			play_audio.play();
			play_audio.addEventListener('ended', function() {
				playState.innerText = '点击播放';
			});
		}

	});
	document.getElementById("msg-image").addEventListener('tap', function() {
		if (document.getElementById("msg_face").className.indexOf("btn_face_active") > 0) {
			mui.trigger(document.getElementById("msg_face"), 'tap');
		}
		galleryImg();
	});

	function galleryImg() {
		// 从相册中选择图片
		plus.gallery.pick(function(path) {
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
								uploadIMG()
							}
						});
					});
				},
				function(e) {});
		};
	};

	function uploadIMG(path) {
		var task = plus.uploader.createUpload(UploadImageUrl, {
				method: "POST",
				blocksize: 204800,
				priority: 1000
			},
			function(t, status) {
				if (status == 200) {
					if (successIMG) successIMG(t);
				} else {
					if (fail) fail(status);
				}
			}
		);
		task.addFile(path, {
			key: 'file'
		});
		task.addData('base64', f1);
		task.addEventListener("statechanged", function(t, status) {
			switch (t.state) {
				case 1: // 开始
					//common.toast("开始上传...");
					break;
				case 2: // 已连接到服务器
					//common.toast("开始上传...");
					break;
				case 3:
					var a = t.uploadedSize / t.totalSize * 100;
					//sp1.innerText = "已上传" + parseInt(a) + "%";
					common.toast("已上传" + parseInt(a) + "%");
					break;
				case 4:
					break;
			}
		});
		task.start();
	}

	function uploadAudio(path) {
		if (0 != path.toString().indexOf("file://")) {
			path = "file://" + path;
		}
		var task = plus.uploader.createUpload(UploadAudioUrl, {
				method: "POST",
				blocksize: 204800,
				priority: 1000
			},
			function(t, status) {
				if (status == 200) {
					if (successAudio) successAudio(t);
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
	var successIMG = function(response) {
		var array = response.responseText.split('|');
		if (array[0] == '0') {
			imgUrl = array[1];
			sendMessage('img');
		}
	}
	var successAudio = function(response) {
		var array = response.responseText.split('|');
		if (array[0] == '0') {
			audioUrl = array[1];
			sendMessage('Sound');
		}
	}
});