$(function(){
	//	新闻公告
	$('.news_title>ul>li').each(function(i, n) {
        $(n).click(function(){
			$(this).addClass('read_active').siblings().removeClass('read_active');
			$('.container .sc_cells_access').each(function(x, y) {
                if(x==i) $(y).removeClass('h').siblings(".sc_cells_access").addClass('h');
            });	
		})
    });
    //	新闻首页
     $("#tab_pulldown").click(function(){
        $("#tab_pulldown").toggleClass("tab_pulldown_active");
        $(".children_news_ul").toggle();
    });
    
    $('.news_index_title>ul>li').each(function(i, n) {
        $(n).click(function(){
        	$(this).addClass('read_active').siblings("li").removeClass('read_active');
			$(this).addClass('read_active').parent("ul").siblings("ul").children("li").removeClass('read_active');
			$('.container .sc_cells_access').each(function(x, y) {
                if(x==i) $(y).removeClass('h').siblings(".sc_cells_access").addClass('h');
            });	
		})
    });
   
    
    
    
    $('#comment_hint').click(function(){
    	$('#comment_hint').hide();
    	$('.comment_list').each(function(i, n) {
//  		console.log(i);
//  		console.log(n);
    		if(i<=2){
    			$(n).hide();
    		}
    	})
    });
    $("textarea").each(function(){
		$(this).css("height",$(this).attr("scrollHeight+22px"));
//		console.log(1);
	});
    //  审批
//  var w = $('.approve_module .approve_list').width();
//	$('.approve_module .approve_list').height(w);

	
	//弹窗
//	$(".btn-agree").click(function(){
//		$("#diolog_shade").show();
//		$("#diolog_agree").show();
//	})
//	$(".btn-refuse").click(function(){
//		$("#diolog_shade").show();
//		$("#diolog_refuse").show();
//		
//	})
	$(".menu_4_menu span").click(function(){	
	  	$(".widget_wrap").toggleClass("btn-rotate");
	  	$(".message-box>.shortcut11").toggleClass("shortcuts_01");
	  	$(".message-box>.shortcut12").toggleClass("shortcuts_02");
	  	$(".message-box>.shortcut13").toggleClass("shortcuts_03");
	  	$(".message-box>.shortcut14").toggleClass("shortcuts_04");
	});	
	
})