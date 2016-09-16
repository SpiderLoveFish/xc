(function($, owner) {
	owner.login = function(loginname, pwd, clientid,version, callback) {
			common.postApi("UpdateUserClientId", {
				loginname: loginname,
				pwd: pwd,
				clienid: clientid,
				ver:version
			}, function(response) {
				if (response.data.length > 0) {
					for (var i = 0; i < response.data.length; i++) {
						var obj = response.data[i];
						var userinfo = new Object();
						userinfo.UserId = obj.UserId;
						userinfo.CorpId = obj.CorpId;
						userinfo.ClientId = clientid;
						userinfo.UserName = obj.UserName;
						owner.setUserInfo(userinfo);
					}
					callback(true);
				} else {
					callback(false);
				}


			}, 'json');
		}
		//设置本地用户信息
	owner.setUserInfo = function(userInfo) {
			localStorage.setItem('$users', JSON.stringify(userInfo));
		}
		//获取本地用户信息
	owner.getUserInfo = function() {
			return JSON.parse(localStorage.getItem('$users') || '[]');
		}
		/**
		 * 获取应用本地配置
		 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}

}(mui, window.app = {}));