mui.init();
common.backOfHideCurrentWebview();
mui.plusReady(function() {
	var pays = {};
	getChannels();

	function getChannels() {
		plus.payment.getChannels(function(channels) {
			for (var i = 0; i < channels.length; i++) {
				var channel = channels[i];
				pays[channel.id] = channel;
				checkServices(channel);
			}
		}, function(e) {});
	}
	document.getElementById("alipay").addEventListener('tap', function() {
		pay('alipay')
	});
	document.getElementById("wxpay").addEventListener('tap', function() {
		common.alert('暂不支持微信支付');
	});
	// 检测是否安装支付服务
	function checkServices(pc) {
		if (!pc.serviceReady) {
			var txt = null;
			switch (pc.id) {
				case "alipay":
					txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
					break;
				default:
					txt = "系统未安装“" + pc.description + "”服务，无法完成支付，是否立即安装？";
					break;
			}
			plus.nativeUI.confirm(txt, function(e) {
				if (e.index == 0) {
					pc.installService();
				}
			}, pc.description);
		}
	}
	// 支付
	function pay(id) {
		var amount = document.getElementById('total').value;
		var data = {
			total: amount,
			userid: getUserInfo().UserId
		};
		common.showWaiting(true);
		common.postApi('GetAlipayInfo', data, function(response) {
			var order = response.data;
			plus.payment.request(pays[id], order, function(result) {
				common.closeWaiting();
				common.alert("捐赠成功,谢谢您~");
			}, function(error) {
				common.closeWaiting();
				if (error.code == '62001' || error.code=='-100') {
					common.toast("您放弃了捐赠...");
					//mui.back();
				} else {
					common.toast("捐赠失败，请联系客服!");
				}
			});

		}, 'json');
	}
})