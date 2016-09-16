//全局变量 接口地址
var interfaceUrl = "http://expappapi.go-mobile.cn/Sc_FamilyExperience/v1.0/";
var UploadImageUrl="http://app.go-mobile.cn/HandlersAuthFrame/H_Upload.ashx";
var UploadAudioUrl="http://app.go-mobile.cn/HandlersAuthFrame/H_UploadVideo.ashx";
//http://192.168.10.12:8888/ScFamilyAPI/v1.1/
var aniShow = "pop-in"; //fade-in,zoom-out,slide-in-right,pop-in
var aniHide = "auto"; //fade-out,zoom-in,slide-out-right,pop-out
var aniSecond = "250";
var CommonTop = '101px';

(function(mui, common) {
	mui.plusReady(function() {
		//初始化首页信息
		common.initMessage = function() {
				plus.webview.getWebviewById('view_style_two/nav/message.html').evalJS('getData();');
			}
			//初始化快捷键信息
		common.initshowButton = function() {
				plus.webview.getWebviewById('view_style_two/nav/message.html').evalJS('showButton();');
			}
			//初始化通讯录信息
		common.initAddList = function() {
			plus.webview.getWebviewById('view_style_two/addList/addList_all_list.html').evalJS('GetUserList();');
		}

		//初始化我的信息
		common.initMine = function() {
			plus.webview.getWebviewById('view_style_two/nav/mine.html').evalJS('getuser();');
		}

		//初始化公共选人信息
		common.initUserList = function() {
			var webview = plus.webview.getWebviewById('user_list');
			if (webview) {
				webview.evalJS('getData();');
			}
		}

		plus.webview.currentWebview().setStyle({
			'popGesture': 'none'
		});
		var templates = {};
		//根据指定模板名称获取模板 封装共用webview
		common.getTemplate = function(name, url) {
			if (!name) {
				name = "default";
			}
			var template = plus.webview.getWebviewById(name + "-template");

			if (!template) {
				//预加载共用子webview
				var subWebview = mui.preload({
					url: '',
					id: name + "-template",
					styles: {
						top: '0px',
						bottom: '0px',
					}
				});
				//				subWebview.addEventListener('loaded', function() {
				//					alert(subWebview);
				//					setTimeout(function() {
				//						subWebview.show(aniShow, aniSecond);
				//					}, 50);
				//				});
				//subWebview.hide();
				subWebview.loadURL(url);
				setTimeout(function() {
					subWebview.show(aniShow, aniSecond);
				}, 500);
				template = subWebview;
			} else {
				template.loadURL(url);
				setTimeout(function() {
					template.show(aniShow, aniSecond);
				}, 500);
			}

			return template;
		}

		//侧滑详情界面专用webview
		common.getWebviewDetailById = function(detailId) {
			var template = plus.webview.getWebviewById(detailId);
			if (!template) {
				//预加载共用子webview
				var subWebview = mui.preload({
					id: detailId,
					url: '',
					styles: {
						left: "15%",
						width: '85%',
						zindex: 9999
					}
				});
				template = subWebview;
			}

			return template;
		}

		//根据共用模板加载指定url
		common.loadUrl = function(url, callback) {
			//获得共用子webview
			var contentWebview = common.getTemplate('', url);
			//contentWebview.loadURL(url);
			if (typeof callback == 'function') {
				callback();
			}
		}
	});
		//是否联网
	common.isNetWork = function() {
		var internetType = plus.networkinfo.getCurrentType();
		if (internetType == 1) {
			return false;
		}
		return true;
	}

	//创建或打开websql数据库
	common.openDatabase = function() {
		var db = openDatabase('ScFamilyDB', '1.0', 'ScFamilyDB', 2 * 1024 * 1024);
		return db;
	}

	//获取url参数
	common.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	/**
	 * 页面跳转并可传递参数
	 * @param {String} url 要打开的页面地址
	 * @param {String} id = 指定页面ID
	 * @param {object} params 指定传递的json格式参数
	 * @param {Function} callback webview加载完成回调函数
	 * @example common.jump('www.baidu.com','baidu',{name:'张三',age:'100'})
	 */
	common.jump = function(url, id, params, callback) {
		var webview = plus.webview.create(url, id, {}, params);
		webview.show(aniShow, aniSecond, function() {
			if (callback) {
				callback();
			}
		});
	};

	//根据指定webviewid显示并隐藏当前webview 动画效果
	common.showWebviewAnimationHideCurrent = function(webviewId) {
		plus.webview.getWebviewById(webviewId).show(aniShow, aniSecond, function() {
			//Webview窗口显示完成的回调函数
			plus.webview.currentWebview().hide();
		});

	}

	//根据指定webviewid显示并关闭当前webview 动画效果
	common.showWebviewAnimationCloseCurrent = function(webviewId) {
		plus.webview.getWebviewById(webviewId).show(aniShow, aniSecond, function() {
			//Webview窗口显示完成的回调函数
			plus.webview.currentWebview().close();
		});
	}

	//根据指定webviewid显示 动画效果
	common.showWebviewAnimation = function(webviewId) {
		plus.webview.getWebviewById(webviewId).show(aniShow, aniSecond);
	}

	//隐藏当前webview 动画效果
	common.currentWebviewHide = function() {
		plus.webview.currentWebview().hide(aniHide, aniSecond);
	};


	//显示loading
	common.showWaiting = function(autoClose) {
		//开始：zjl 2016-02-25 修改代码
		if (!common.isNetWork()) {
			common.toast('检测到您尚未联网,请检查网络链接..');
			return;
		}
		//结束：zjl 2016-02-25 修改代码
		plus.nativeUI.showWaiting("", {
			//透明背景 雪花样式
			background: 'rgba(0,0,0,0)', //等待框背景区域宽度，默认根据内容自动计算合适宽度
			modal: true,
			style: 'black',
			padlock: autoClose ? true : false //点击是否关闭等待框
		});
	}

	//关闭loading
	common.closeWaiting = function() {
		plus.nativeUI.closeWaiting();
	}

	/**
	 * 后退减直接显示某页面
	 * @param {String} url 要打开的页面地址
	 * @param {String} id = 指定页面ID
	 */
	common.backTo = function(url, id) {
		mui.back = function() {
			common.jump(url, id, {}, false, false);
		}
	}

	//重写后退 隐藏当前webview
	common.backOfHideCurrentWebview = function(callback) {
		mui.back = function() {
			if (callback) {
				callback();
			}
			common.currentWebviewHide();
		}
	}

	/**
	 * 根据id绑定点击事件
	 * @param {String} id 标签id
	 * @param {String} func function
	 * @example common.textValiAlert('张三','请填写姓名')
	 */
	common.click = function(id, func) {
		document.getElementById(id).addEventListener('tap', function() {
			func();
		});
	};
	/**
	 * select标签动态添加option
	 * @param {String} id select选择器id
	 * @param {String} typeId 字典类型
	 * @param {String} corpid corpid
	 * @example common.numValiAlert('fff','数字不符合规范')
	 */
	common.setDropdownList = function(id, typeId, corpid) {
		common.showWaiting();
		common.postApi("GetDictionary", {
			'DType': typeId
		}, function(response) {
			dataArray = eval(response.data);
			for (var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				document.getElementById(id).options.add(new Option(obj.DictionaryName, obj.ID));
			}
			common.closeWaiting();
		}, 'json');
	};
	common.getUserList = function(corpid, fun) {
		document.getElementById("headerList").innerHTML = '';
		document.getElementById("ulUserList").innerHTML = '';
		//字母头
		var temHead = '<li data-group="@headLetter" class="mui-table-view-divider mui-indexed-list-group">@headLetter</li>';
		//数据体
		var temBody = '<li data-name="@dataName" data-value="@dataValue" data-type="@datatype" data-type data-tags="@dataTag" class="mui-table-view-cell mui-indexed-list-item mui-checkbox mui-left"><input type="checkbox" />@dataShow</li>';
		var headLetter;

		//常用群组 
		var data = {
			ID: '',
			type: 'getGroupList_All',
			strWhere: '',
			starIndex: '',
			endIndex: ''
		};
		common.postApi('GetUsergroup', data, function(response) {
			dataArray = eval(response.data);
			//列表右侧字母列表
			if (dataArray[0].length > 0) {
				document.getElementById("headerList").innerHTML += "<a>常</a>";
				document.getElementById("ulUserList").innerHTML += temHead.replace("@headLetter", '常').replace("@headLetter", '常用群组');
			}
			for (var i = 0; i < dataArray[0].length; i++) {
				var obj = dataArray[0][i];


				var userIdList = new Array();
				var userNameList = new Array();
				//获取群组中人员userid
				for (var n = 0; n < dataArray[1].length; n++) {
					var obj1 = dataArray[1][n];
					if (obj.ID == obj1.GroupID) {
						userIdList.push(obj1.UserId);
						userNameList.push(obj1.UserName);
					}
				}
				var userIdString = userIdList.join(',');
				var userNameString = userNameList.join(',');
				//datatype=0为常用群组
				document.getElementById("ulUserList").innerHTML += temBody.replace("@datatype", '0').replace("@dataValue", userIdString).replace("@dataTag", userNameString).replace("@dataName", userNameString).replace("@dataShow", obj.GroupName);
			}
			//加载完群组再加载人员
			//用户列表
			common.postApi("GetUsersBySelectKey", {
				uType: 'ToOrCcUserList'
			}, function(response) {
				dataArray = eval(response.data);
				for (var i = 0; i < dataArray.length; i++) {
					var temp; //临时变量
					var obj = dataArray[i];
					if (headLetter != obj.Header) { //没有此头字母,插入头
						headLetter = obj.Header;
						//列表右侧字母列表
						document.getElementById("headerList").innerHTML += "<a>" + obj.Header + "</a>";
						//主列表字母头
						temp = temHead;
						document.getElementById("ulUserList").innerHTML += temp.replace("@headLetter", obj.Header).replace("@headLetter", obj.Header);
					}
					temp = temBody;
					//datatype=1为人员
					document.getElementById("ulUserList").innerHTML += temp.replace("@datatype", '1').replace("@dataValue", obj.UserId).replace("@dataTag", obj.Header).replace("@dataName", obj.UserName).replace("@dataShow", obj.UserName);
				}
				fun();
			}, 'json');

		}, 'json');


		//mui.getJSON
	};


	/**
	 * @description 获取审批流逻辑信息
	 * @param {String} obj 业务数据
	 * @param {String} toData 所有负责人数据
	 * @param {String} ccData 所有相关人数据
	 */
	common.getApproveOrderBussiness = function(obj, toData, ccData) {
		var creator = 0, //发起人|负责人|相关人
			approveProcessHtml = '', //审批过程html代码
			isLastApprover = false, //是否是最后审批人
			canApprove = false;
		//当前人userid
		var currentUserId = getUserInfo().UserId;
		approveProcessHtml += '<li class="state_icon_pass"><div class="approve_state_list"><div class="sc_cell_hd"><img src="' + obj.Avatar + '"></div><div class="sc_cell_bd sc_cell_primary"><p>' + obj.UserName + '</p><p class="label_describe">发起申请</p></div><div class="sc_cell_data">' + dateToWithoutYearSecond(obj.ReleaseTime) + '</div></div></li>';
		//obj.UserName + '发起申请' + obj.ReleaseTime + '<br/>';
		if (obj.UserId == currentUserId) {
			//当前人是发起人
			creator = 0;
		}
		if (toData) {
			for (var i = 0; i < toData.length; i++) {
				var item = toData[i];
				if (item.ApproveFlag == '0') {
					approveProcessHtml += '<li class="state_icon_wait"><div class="approve_state_list"><div class="sc_cell_hd"><img src="' + item.Avatar + '"></div><div class="sc_cell_bd sc_cell_primary"><p>' + item.UserName + '</p><p class="label_describe">等待审批</p></div><div class="sc_cell_data"></div></div></li>'
				} else if (item.ApproveFlag == '1') {
					approveProcessHtml += '<li class="state_icon_pass"><div class="approve_state_list"><div class="sc_cell_hd"><img src="' + item.Avatar + '"></div><div class="sc_cell_bd sc_cell_primary"><p>' + item.UserName + '</p><p class="label_describe">' + item.ApproveOpinion + '</p></div><div class="sc_cell_data">' + dateToWithoutYearSecond(item.ApproveTime) + '</div></div></li>';
				} else {
					approveProcessHtml += '<li class="state_icon_notpass"><div class="approve_state_list"><div class="sc_cell_hd"><img src="' + item.Avatar + '"></div><div class="sc_cell_bd sc_cell_primary"><p>' + item.UserName + '</p><p class="label_describe">' + item.ApproveOpinion + '</p></div><div class="sc_cell_data">' + dateToWithoutYearSecond(item.ApproveTime) + '</div></div></li>';
				}
				if (currentUserId == item.UserId) {
					creator = 1; //负责人
					if (obj.ApproveOrder == item.ApproveOrder) {
						if (item.ApproveFlag == '0') { //未审批
							canApprove = true;
						}
						//审批流对应
						if (i == (toData.length - 1)) { //负责人是按approveorder升序查询,所以最后一条数据为最后审批人
							isLastApprover = true;
						} else {

						}
					}
				}
			}
		}
		if (ccData) {
			for (var i = 0; i < ccData.length; i++) {
				var item = ccData[i];
				if (currentUserId == item.UserId) {
					creator = 2; //相关人
					break;
				}
			}
		}
		return {
			creator: creator,
			approveProcessHtml: approveProcessHtml,
			isLastApprover: isLastApprover,
			canApprove: canApprove
		};
	}

	/**
	 * @description 查詢评论
	 * @param {String} commentType 业务类型
	 * @param {String} masterID 业务关联ID
	 * @param {Int32Array} startIndex 开始行数
	 * @param {Int32Array} endIndex 显示行数
	 * @example insertAComment('1','ID',0,10)
	 */
	aCommentList = function(commentType, masterID, startIndex, endIndex) {
		var data = {
			commentType: commentType,
			masterID: masterID,
			startIndex: startIndex,
			endIndex: endIndex
		};
		common.postApi(interfaceUrl + 'EnterpriseApp/v1.0/GetAComment', data, function(response) {
			dataArray = eval(response.data);
			for (var i = 0; i < dataArray.length; i++) {
				var obj = dataArray[i];
				//alert(obj.MasterID + obj.Avatar)
			}
		}, 'json');
	};
	/**
	 * @description 刪除或插入评论
	 * @param {String} ID 评论ID
	 * @param {String} masterID 业务关联ID
	 * @param {String} commentFirst 评论内容
	 * @param {String} commentTime 评论时间
	 * @param {String} commentType 业务类型
	 * @param {String} type 删除或插入的类型
	 * @example insertAComment('1','ID','评论内容','评论时间','业务类型','类型')
	 */
	aCommentManage = function(ID, masterID, commentFirst, commentTime, commentType, type) {
		var data = {
			ID: ID,
			masterID: masterID,
			commentFirst: commentFirst,
			commentTime: commentTime,
			commentType: commentType,
			type: type
		};
		common.postApi(interfaceUrl + 'EnterpriseApp/v1.0/InsertAComment', data, function(response) {
			//dataArray = response.data;
			//alert(response.data);
		}, 'json');
	};
	/**
	 * @description 文本内容验证及弹出提示消息
	 * @param {String} text 要验证的文本内容
	 * @param {String} alertMsg alert弹出内容
	 * @example common.textValiAlert('张三','请填写姓名')
	 */
	common.textValiAlert = function(text, alertMsg) {
		if (!text.trim()) {
			common.alert(alertMsg);
			return '';
		} else {
			return text;
		}

	};

	/**
	 * 不是数字返回false及弹出提示消息
	 * @param {String} num 要验证的数字格式
	 * @param {String} alertMsg alert弹出内容
	 * @example common.numValiAlert('fff','数字不符合规范')
	 */
	common.numValiAlert = function(num, alertMsg) {
		var pattern = /^[0-9]*[0-9][0-9]*$/;
		var flag = pattern.test(num);
		if (!flag) {
			common.alert(alertMsg);
			return false;
		} else {
			return num;
		}
	};
	/**
	 * 浮点数验证及弹出提示消息
	 * @param {String} num 要验证的数字格式
	 * @param {String} alertMsg alert弹出内容
	 * @param {String} type 默认为验证一位小数
	 * @example common.numValiAlert('fff','数字不符合规范')
	 */
	common.floatValiAlert = function(num, alertMsg, type) {
		var pattern;
		if (!type || type == 1) {
			pattern = /^-?\d+[\.\d]?\d{0,1}$/; //保留一位小数
		} else {
			pattern = /^-?\d+[\.\d]?\d{0,2}$/; //保留二位小数
		}
		var flag = pattern.test(num);
		if (!flag) {
			common.alert(alertMsg);
			return false;
		} else {
			return num;
		}
	};

	//原生alert
	common.alert = function(alertMsg) {
		mui.alert(alertMsg, "提示");
	}
	var time = 0;
	//原生吐司 避免连续点击后持续吐司的情况
	common.toast = function(msg) {
		var now = new Date().getTime();
		if (now - time > 2000) {
			time = now;
			mui.toast(msg);
		}
	}

	/**
	 * 截取指定长度的字符串然后在后加..
	 * @param {String} text 要截取的字符串
	 * @param {Number} length 截取字符串的长度
	 * @example common.textValiAlert('张三','请填写姓名')
	 */
	substringAddPoint = function(text, length) {
		if (text.length > length) {
			return text.substring(0, length) + "..";
		} else {
			return text;
		}
	};
	/**
	 * 截取替换数据库的字符串格式2015-01-01T12:1212:000 转为 2015-01-01 12:12:12
	 * @param {String} text 要截取的字符串
	 */
	subReplaceDateString = function(text) {
		return text.substring(0, 19).replace('T', ' ');
	};
	/**
	 * 双击退出应用 重写back方法
	 */
	appQuit = function() {
			var timeCompleteState = localStorage.getItem('$timeCompleteState'); //结束状态
			var pauseState = localStorage.getItem('$timeStopState'); //暂停状态
			if (timeCompleteState == "false" && pauseState == "false") {
				//没有结束也没有暂停就双击退出了
				localStorage.setItem('$processKillState', true); //杀死进程记录状态
			} else {
				localStorage.setItem('$processKillState', false); //杀死进程记录状态
			}
			//双击后退退出登录
			var preTime = 0;
			mui.back = function() {
				var now = new Date().getTime();
				if (now - preTime > 2000) {
					preTime = now;
					mui.toast('再按一次退出应用');
				} else {
					plus.runtime.quit();
				}
			};
		}
		/**
		 * 获取登录用户信息UserId,CorpId,ClientId
		 * @example getUserInfo().UserId;
		 */
	getUserInfo = function() {
			return JSON.parse(localStorage.getItem('$users') || '[]');
		}
		//推送跳转
	common.pushTransfer = function(type, status, url, id) {
		var listWebview = plus.webview.getWebviewById(id);
		if (listWebview) {
			//如果已存在webview,则传参,数据初始化 不再创建webview
			if (type && status) {
				//2个参数
				listWebview.evalJS("dataLoad('" + type + "','" + status + "');");
			} else if (status) {
				//1个参数
				listWebview.evalJS("dataLoad('" + status + "');");
			}
			common.showWebviewAnimation(id);
		} else {
			//不存在webview 创建
			common.jump(url, id, {
				status: status,
				type: type
			});
		}
	}
	common.toPage = function(ViewID, PageID) {
		if (ViewID == "News") {
			common.getTemplate('pushMsgPage', 'view_style_two/news/newdetail.html?id=' + PageID);
		} else if (ViewID == "Activity") {
			common.getTemplate('pushMsgPage', 'view_style_two/activity/activity_detail.html?id=' + PageID);
		} else if (ViewID == "Surveys") {
			common.getTemplate('pushMsgPage', 'view_style_two/questionnaire/questionnairedetail.html?id=' + PageID);
		} else if (ViewID == "calendar") {
			common.getTemplate('pushMsgPage', 'view_style_two/calendar/calendar_list.html');
		} else if (PageID == "0") {
			//跳转发起
			common.getTemplate('pushMsgPage', 'view_style_two/approve/list/list_launched.html');
		} else if (PageID == "1") {
			//跳转该我审批
			common.getTemplate('pushMsgPage', 'view_style_two/approve/list/list_waitforme.html');
		} else if (PageID == "2") {
			//跳转相关
			common.getTemplate('pushMsgPage', 'view_style_two/approve/list/list_sendme.html');
		}
	}
	common.postApi = function(interfaceName, data, success, dataType) {
		if (!dataType) {
			//默认json格式
			dataType = 'json';
		}
		var options = {
			url: interfaceUrl + interfaceName,
			data: data,
			success: success,
			dataType: dataType
		};
		options.type = 'POST';
		var headers = {};
		var userinfo = getUserInfo();
		headers["sc_api"] = base64_encode(userinfo.CorpId + '/' + userinfo.UserId + '/' + userinfo.ClientId + '/' + Math.round(new Date().getTime() / 1000));
		options.headers = headers;
		var result = mui.ajax(options); //接口调用完成前不允许请求接口(防重复提交,低端机,网卡等连续点击请求接口)
		return result;

	};
	common.postApipayment = function(interfaceName, data, success, dataType) {
		if (!dataType) {
			//默认json格式
			dataType = 'json';
		}
		var options = {
			url: interfaceName,
			data: data,
			success: success,
			dataType: dataType
		};
		options.type = 'POST';
		var headers = {};
		var userinfo = getUserInfo();
		headers["sc_api"] = base64_encode(userinfo.CorpId + '/' + userinfo.UserId + '/' + userinfo.ClientId + '/' + Math.round(new Date().getTime() / 1000));
		options.headers = headers;
		var result = mui.ajax(options); //接口调用完成前不允许请求接口(防重复提交,低端机,网卡等连续点击请求接口)
		return result;

	};
	//---------------------------------------------------  
	// 日期格式化  
	// 格式 YYYY/yyyy/YY/yy 表示年份  
	// MM/M 月份  
	// W/w 星期  
	// dd/DD/d/D 日期  
	// hh/HH/h/H 时间  
	// mm/m 分钟  
	// ss/SS/s/S 秒  
	//alert(DateFormat('YYYY-MM-dd hh:mm 星期w'));
	//---------------------------------------------------  
	common.DateFormat = function(mDate, formatStr) {


		var myDate = new Date(mDate); //正确

		//alert(date.getFullYear());
		var str = formatStr;
		var Week = ['日', '一', '二', '三', '四', '五', '六'];

		str = str.replace(/yyyy|YYYY/, myDate.getFullYear());
		str = str.replace(/yy|YY/, (myDate.getYear() % 100) > 9 ? (myDate.getYear() % 100).toString() : '0' + (myDate.getYear() % 100));

		str = str.replace(/MM/, parseInt(myDate.getMonth()) + 1 > 9 ? (parseInt(myDate.getMonth()) + 1).toString() : '0' + (parseInt(myDate.getMonth()) + 1));
		str = str.replace(/M/g, parseInt(myDate.getMonth()) + 1);

		str = str.replace(/w|W/g, Week[myDate.getDay()]);

		str = str.replace(/dd|DD/, myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate());
		str = str.replace(/d|D/g, myDate.getDate());

		str = str.replace(/hh|HH/, myDate.getHours() > 9 ? myDate.getHours().toString() : '0' + myDate.getHours());
		str = str.replace(/h|H/g, myDate.getHours());
		str = str.replace(/mm/, myDate.getMinutes() > 9 ? myDate.getMinutes().toString() : '0' + myDate.getMinutes());
		str = str.replace(/m/g, myDate.getMinutes());

		str = str.replace(/ss|SS/, myDate.getSeconds() > 9 ? myDate.getSeconds().toString() : '0' + myDate.getSeconds());
		str = str.replace(/s|S/g, myDate.getSeconds());

		return str;
	}

	common.getApi = function(url, data, success, dataType) {
		if (!dataType) {
			//默认json格式
			dataType = 'json';
		}
		var options = {
			url: url,
			data: data,
			success: success,
			dataType: dataType
		};
		options.type = 'GET';
		var headers = {};
		var userinfo = getUserInfo();
		headers["sc_api"] = base64_encode(userinfo.CorpId + '/' + userinfo.UserId + '/' + userinfo.ClientId + '/' + Math.round(new Date().getTime() / 1000));
		options.headers = headers;
		return mui.ajax(options);
	};
}(mui, window.common = {}));

function base64_encode(str) {
	var c1, c2, c3;
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var i = 0,
		len = str.length,
		string = '';

	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt((c1 & 0x3) << 4);
			string += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			string += base64EncodeChars.charAt((c2 & 0xF) << 2);
			string += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		string += base64EncodeChars.charAt(c1 >> 2);
		string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		string += base64EncodeChars.charAt(c3 & 0x3F)
	}
	return string
}

//去除左右空格
function trimLR(sendComment) {
	sendComment = sendComment.replace(/(^\s*)/g, "").replace('&nbsp;', ' ');
	//去除右空格
	sendComment = sendComment.replace(/(\s*$)/g, "");
	return sendComment;
}

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
	} else {
		return this.replace(reallyDo, replaceWith);
	}
}
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
Array.prototype.contains = function(element) { //利用Array的原型prototype点出一个我想要封装的方法名contains 

	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) { //如果数组中某个元素和你想要测试的元素对象element相等，则证明数组中包含这个元素，返回true 
			return true;
		}
	}
}
Date.prototype.format = function(fmt) { //author: meizz   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;

function getDateDiff(dateTimeStamp) {
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if (monthC >= 1 || weekC >= 1) {
		var d = new Date(dateTimeStamp);
		//result = d.toDateString();
		result = d.format('yyyy-MM-dd');
	} else if (dayC >= 1) {
		result = parseInt(dayC) + "天前";
	} else if (hourC >= 1) {
		result = parseInt(hourC) + "个小时前";
	} else if (minC >= 1) {
		result = parseInt(minC) + "分钟前";
	} else
		result = "刚刚发表";
	return result;
}

function getDateTimeStamp(dateStr) {
	return Date.parse(dateStr.replace(/-/gi, "/"));
}
var ws = null;
back = function(hide) {
	if (window.plus) {
		ws || (ws = plus.webview.currentWebview());
		if (hide || ws.preate) {
			ws.hide('auto');
		} else {
			ws.close('auto');
		}
	} else if (history.length > 1) {
		history.back();
	} else {
		window.close();
	}
};

// 格式化日期时间字符串，格式为"YYYY-MM-DD HH:MM:SS"
dateToStr = function(d) {
	return (d.getFullYear() + "-" + ultZeroize(d.getMonth() + 1) + "-" + ultZeroize(d.getDate()) + " " + ultZeroize(d.getHours()) + ":" + ultZeroize(d.getMinutes()) + ":" + ultZeroize(d.getSeconds()));
};

// 格式为"YYYY-MM-DD HH:MM:SS" 截取为 格式为"MM-DD HH:MM"
dateToWithoutYearSecond = function(d) {
	return d.substring(5, 16);
};

// 格式化日期时间字符串，格式为"YYYY-MM-DD"
dayToStr = function(d) {
	return (d.getFullYear() + "-" + ultZeroize(d.getMonth() + 1) + "-" + ultZeroize(d.getDate()));
};
// 格式化日期时间字符串，格式为"YYYY-MM-DD"
noneToStr = function(d) {
	return (d.getFullYear() + ultZeroize(d.getMonth() + 1) + ultZeroize(d.getDate()));
};

ultZeroize = function(v, l) {
	var z = "";
	l = l || 2;
	v = String(v);
	for (var i = 0; i < l - v.length; i++) {
		z += "0";
	}
	return z + v;
};
//native.js
//获取已配对蓝牙设备列表
function bluetooth_list() {
	var main = plus.android.runtimeMainActivity();
	var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter");
	var BAdapter = BluetoothAdapter.getDefaultAdapter();
	var Context = plus.android.importClass("android.content.Context");
	var lists = BAdapter.getBondedDevices();
	plus.android.importClass(lists);
	var len = lists.size();
	console.log(len);
	var iterator = lists.iterator();
	plus.android.importClass(iterator);
	while (iterator.hasNext()) {
		var d = iterator.next();
		plus.android.importClass(d);
		console.log(d.getName());
	}
}