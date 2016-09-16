
	var smile_array = {
       '微笑':':smile:',                                       
       '心眼':':heart_eyes:',                           
       '吐舌头':':stuck_out_tongue_closed_eyes:',       
       '冷汗':':cold_sweat:',                           
       '魔鬼':':smiling_imp:',                          
       '爱心':':heart:',                             	 
       '大笑':':grin:',                                 
       '心碎':':broken_heart:',                         
       '开心':':relieved:',                            	
       '睡觉':':sleeping:',                             
       '+1':':+1:',                                     
       '-1':':-1:',                                     
       '胜利':':v:',                                    
       'OK':':ok_hand:',                                
       '鼓掌':':clap:',                                 
       '祈祷':':pray:',                              	 
       '激动':':flushed:',                              
       '喜极而泣':':joy:',                              
       '哭泣':':sob:',                                  
       '丘比特':':cupid:',                              
       '愤怒':':rage:',	                               
		'脸红':':blush:', 				                           
		'味道好':':yum:', 				                           
		'墨镜':':sunglasses:', 			                         
		'失望':':disappointed:',                             
		'惊讶':':astonished:', 					                     
		'络腮胡':':neckbeard:', 	                           
		'流汗':':sweat:', 			                             
		'害怕':':fearful:', 	                               
		'尖叫':':scream:',                                   
		'无嘴':':no_mouth:',						                     
		'无语':':neutral_face:',				                     
		'张嘴':':open_mouth:',					                     
		'鬼':':ghost:',								                       
		'月脸':':new_moon_with_face:',	                     
		'不好':':no_good:',							                     
		'便便':':shit:',						                     
		'感叹号':':exclamation:',					                   
		'问号':':question:',												                         
		'雨伞':':umbrella:',						                     
		'太阳':':sunny:',								                     
		'音乐':':musical_note:'	,  
		'木槿':':hibiscus:',            
		'玫瑰':':rose:',                
		'四叶草':':four_leaf_clover:',    
		'啤酒':':beers:',               
		'鸡尾酒':':cocktail:',            
		'红酒杯':':wine_glass:',          
		'批萨':':pizza:',               
		'意面':':spaghetti:',           
		'米饭':':rice:',                
		'冰激凌':':icecream:',            
		'生日蛋糕':':birthday:',            
		'西瓜':':watermelon:',          
		'步行':':walking:',             
		'自行车':':bike:',                
		'公交车':':bus:',                 
		'火车':':train:',               
		'子弹头':':bullettrain_side:',    
		'爆炸':':boom:',                
		'星星':':star:',                
		'闪电':':zap:',                 
		'打针':':syringe:',
		'波板糖':':lollipop:',
		'美元':':dollar:',
		'花束':':bouquet:',
		'礼物':':gift:',
		'祝':':congratulations:',
		'密':':secret:',
		'吉他':':guitar:',
		'天真':':innocent:',
		'钱袋':':moneybag:',
		'祈祷':':pray:',
		'跑步':':running:',
		'王冠':':crown:',
		'水晶':':crystal_ball:',
		'礼帽':':tophat:',
		'说话':':speak_no_evil:',
		'消息泡泡':':speech_balloon:',
		'猴脸':':monkey_face:'
    };
	function codeToWord(code){
		for(var s in smile_array){
			if(smile_array[s]==code)
				return s;
		}
		return null;
	}
	function wordToCode(word){
		for(var s in smile_array){
			if(s==word)
				return smile_array[s];
		}
		return null;
	}

$(function(){
    //定义
    var hasTouch = true,
        START_EV = hasTouch?"touchstart":"mousedown",
        MOVE_EV = hasTouch?"touchmove":"mousemove",
        END_EV = hasTouch?"touchend":"mouseup";


    var actions = {
        openLink: function(href, opt){
            opt = opt || {};
            if (typeof href !== 'string') {
                var node = href;
                href = node.href;
                opt.target = opt.target || node.target;
            }
            if (opt.target && opt.target !== '_self') {
                window.open(href, opt.target);
            } else {
                location.href = href;
            }
        }
    }; 


    var win_height = $(window).height(),
        win_width = $(window).width();

    $(".wrap_inner").height(win_height);
    //$(".wrap").height(win_height);

    // 加载中控制
    window.ku = {};
    ku.simple_tips = function(obj){
        var tipsDom = $(".simple_tips"),
            tips_width = tipsDom.actual('width'),
            tips_height= tipsDom.actual('height'),
            top = (win_height-tips_height)/2-(tips_height/2),
            left = (win_width-tips_width)/2;

        obj = obj || {};

        if(!obj.show){
            tipsDom.show().css({
                top:top,
                left:left,
                opacity:0,
                display:"none"
            });
        }else{
            tipsDom.show().css({
                top:top,
                left:left,
                opacity:1,
                display:"inline-block"
            });
        }

    };

    // 定义选择器
    var address_link = $(".settings-item .a_link");

    // 模拟高亮事件
    address_link.on(START_EV,function(){
        $(this).closest(".settings-item").addClass('highlight');
    }).on(END_EV,function(){
        $(this).closest(".settings-item").removeClass('highlight');
    });

    // 控制跳转
    address_link.on("click", function(e){
        e.preventDefault();
        actions.openLink(this);
    });

    // 如果是安卓微信，则显示后退
    /*if(WeixinJS.isWeixin){
        WeixinJS.hideToolbar();
    }*/
    $(".img_preview img").on("load",function(){

        var width = $(this).width(),
            height = $(this).height(),
            win_width = $(window).width(),
            win_height = $(window).height();

        if(width>win_width){
            $(this).width(win_width);
            $(this).height(height*(win_width/width));
        }

        $(this).css({
            'position':"absolute",
            'top':  (win_height-$(this).height())/2+"px",
            "left": (win_width-$(this).width())/2+"px"
        });

        // 返回
        $(this).siblings(".img_preview_top").find(".back_btn").click(function(){
            alert("返回事件");
            $(this).off();
        });

        // 删除
        $(this).siblings(".img_preview_top").find(".red_btn").click(function(){
            alert("删除事件");
            $(this).off();
        });

    });

    /*弹出框*/
    function show_tips(){
        if(!$(".over_lay").length){
            $("body").append('<div class="over_lay"></div>');
        }
        $(".over_lay").css({
            "display": "block",
            "opacity":1
        })
    }

    /*弹出框*/
    function hide_tips(){
        $(".over_lay").css({
            "display": "none",
            "opacity":0
        });
    }

    /*多选按钮事件*/
    $(".multiple_btn li").on("click", function(){
        $(this).toggleClass('active');
        return false;
    });

    /*单选选按钮事件*/
    $(".radio_btn li").on("click", function(){
        $(this).addClass('active').siblings('li').removeClass("active");
        return false;
    });

    /*添加回答*/
    $("#ask_btn").on("click", function(){
        show_tips();
        $(".text_tips").show().css({
            "left":(win_width-$(".text_tips").width())/2,
            "top":(win_height-$(".text_tips").height())/2
        });
        return false;
    });
	
	/* 锚点跳转 */
	function jump_point(obj){
		
		var $obj = $(obj)[0],
		top_offset =  $obj.offsetTop,
		top_scroll = $obj.scrollTop,
		tatolTop = top_offset - top_scroll;
	
	$(".wrap_inner").scrollTop(tatolTop);
	}

	/* 锚点跳转 */
	function jump_point2(obj){
		
		var $obj = $(obj)[0],
		top_offset =  $obj.offsetTop,
		top_scroll = $obj.scrollTop,
		tatolTop = top_offset - top_scroll-$(window).height()/2;
	
	$(".wrap_inner").scrollTop(tatolTop);
	}

    $(".wrap_inner").on("scroll", function(){
        $("#return_top").show();
        /**
         * 
        var scrollTop = $(this).scrollTop();
         if(scrollTop>100){
            $("#return_top").show();
        }else{
            $("#return_top").hide();
        }
         */
    });
    
    //非微信浏览器，不显示页面菜单；
	var ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)!="micromessenger") {
		$(".return_top_inner").remove();
	} 
    
    
    //修改菜单显示的时间为3.5秒
    setInterval(function(){
    	$("#return_top").hide(500);
    },3500)

	$("#sendComment").on("click", function(){
		jump_point2("#comments-box");
	});
	

	$("#down_comment").on("click", function(){
		jump_point("#comments-box");
	});

    $("#up_top").on("click", function(){
        $(".wrap_inner").scrollTop(0);
    });

    $("#down_refresh").on("click", function(){
    	
    	loadNew();
    });
	
    
    // 搜索框字母导航
    /*弹出框*/
    (function($){
	    $(function(){	
	    function show_lay(){
	        var over_opactiy_lay = $(".over_opactiy_lay");
	        if(!over_opactiy_lay.length){
	            $("body").append('<div class="over_opactiy_lay"></div>');
	            over_opactiy_lay = $(".over_opactiy_lay");
	        }
	        over_opactiy_lay.css({
	            "display": "block",
	            "opacity":1
	        })
	    }
	
	    function hide_lay(){
	        var over_opactiy_lay = $(".over_opactiy_lay");
	        over_opactiy_lay.css({
	            "display": "none",
	            "opacity":0
	        })
	    }
	    $(".search-input").on("input", function(){
	        var val = $(this).val();
	         if(val!=""){
	             $("#letter_search").hide();
	             $("#users_search").show();
	             $(".letter_list").hide();
	             hide_lay();
	         }else{
	             $("#letter_search").show();
	             $("#users_search").hide();
	         }
	     });
	
	     $("#letter_search").on("click", function(){
	    	 show_lay();
	         $(".letter_list").toggle();
	         var over_opactiy_lay = $(".over_opactiy_lay");
	         if(over_opactiy_lay.length){
	             over_opactiy_lay.on("click", function(){
	                 $(".letter_list").hide();
	                 over_opactiy_lay.off();
	                 hide_lay();
	             });
	         }
	     });
	     
	  // 评论框高度自适应
	     $(".text_input").on("input", function(){

	         var text_input_copy = $(".text_input_copy"),
	             text_input = $(".text_input");

	     }).on("focus", function(){
            var plus_btns = $("#plus_btns"),
                emoji_list = $("#emoji_list");
            plus_btns.hide();
            emoji_list.hide();

            var over_opactiy_lay = $(".over_opactiy_lay");
            if(!over_opactiy_lay.length){
                show_lay();
                over_opactiy_lay = $(".over_opactiy_lay");
                over_opactiy_lay.css({ "z-index": "50" });
                over_opactiy_lay.on("click", function(){
                    plus_btns.hide();
                    emoji_list.hide();
                    $(".text_input").blur();
                    over_opactiy_lay.off();
                    over_opactiy_lay.css({ "z-index": "90" });
                    hide_lay();
                });
            }
        });

	     // 判断元素是否隐藏
	     $.fn.ishide = function(){
	         return $(this).css("display") === "none";
	     };

	     // 加号功能
	     var tap = $.os.phone?"touchstart":"mousedown";
	     $("#sendmsg").on(tap, function () {
	         commitComment_BtnPinglUN();
	         $(".text_input").blur();
	     });
	     
	     $("#plus_btn").on("click", function(){
	         var plus_btns = $("#plus_btns"),
	             emoji_list = $("#emoji_list"),
	             text_input = $(".text_input");

	         text_input.blur();
	         if( !plus_btns.ishide() || !emoji_list.ishide() ){
	             plus_btns.hide();
	             emoji_list.hide();
	             //text_input.focus(); 
	         }else {
	        	 show_lay();
	             plus_btns.show();
	             var over_opactiy_lay = $(".over_opactiy_lay");
	             over_opactiy_lay.css({ "z-index": "50" });
	             if(over_opactiy_lay.length){
	                 over_opactiy_lay.on("click", function(){
	                     plus_btns.hide();
	                     emoji_list.hide();
	                     text_input.blur();
	                     over_opactiy_lay.off();
	                     over_opactiy_lay.css({ "z-index": "90" });
	                     hide_lay();
	                 });
	             }
	         }
	         return false;
	     });

	     
	     // 展开表情
	     $("#get_smile").on("click",function(){
	         var plus_btns = $("#plus_btns"),
	             emoji_list = $("#emoji_list"),
	             text_input = $(".text_input");

	         plus_btns.hide();
	         emoji_list.show();
	         text_input.blur();
	     });

	     // 表情列表
	     $(".emoji_list li a").each(function(){
	         emojify.run($(this)[0]);
	     });

	     emojify.run($('.text_input')[0]);
	     if($('.emoji_list_viewport').length){
	         var win_width = $(window).width();

	         $(".emoji_list_viewport").width(win_width);
	         $(".emoji_list_viewport .flipsnap").width(win_width*$(".emoji_list_viewport .item").length);
	         $(".emoji_list_viewport .item").width(win_width);

	         var $pointer = $('.pointer span');
	         var emoji_list_flipsnap = Flipsnap('.emoji_list_viewport .flipsnap', {
	             distance: win_width
	         });
	         emoji_list_flipsnap.element.addEventListener('fspointmove', function() {
	             $pointer.filter('.current').removeClass('current');
	             $pointer.eq(emoji_list_flipsnap.currentPoint).addClass('current');
	             $pointer.hide().show();
	         }, false);
	     }

	     //插入表情示例
	     $(".emoji_list a").on("click", function(){

	         var plus_btns = $("#plus_btns"),
	             emoji_list = $("#emoji_list"),
	             text_input = $(".text_input");
	         var newVal = $(".text_input").text() + '['+codeToWord($(this).attr("title"))+']';
	         newVal = $.trim(newVal);
	         $(".text_input").html(newVal);
	         //$(".text_input").trigger("input");

	         setTimeout(function(){
	             emojify.run($('.text_input')[0]);
	         },10);

	     });

	     $(".text_input").on("focus", function(){
	    	 $("#plus_btns").hide();
	    	 $("#emoji_list").hide();
	         $(".text_input").trigger("click");
	         if($.os.ios){
	             $(".foot_bar").css({
	                 'padding-bottom':"35px"
	             })
	         }
	     });

	     $(".text_input").on("blur", function(){
	         if($.os.ios){
	             $(".foot_bar").css({
	                 'padding-bottom':"0px"
	             })
	         }
	     });
	    })
    })(Zepto);
});