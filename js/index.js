$(function(){
  function formate(v){
    var start=v%60;
    var s;
    var b;
    if(start<10){
      s="0"+Math.floor(start);
    }else{
      s=Math.floor(start);
    }
    var m=Math.floor(v/60);
    if(m<10){
      b="0"+Math.floor(m);
    }else{
      b=Math.floor(m);
    }
    return b+":"+s;
  }
	//////////////////////////////////
  var audio=$("#audio").get(0);
  var play=$("#play");
  var current=$("#current");
  var durtion=$("#duration").get(0);
  var pv=$("#p-v");
  var progress=$("#progress");
  var add=$("#add");
  var vol=$("#vol");
  var vi=$("#vi");
    //播放、暂停歌曲
    play.on('touchend',function(){
      if(audio.paused){
       audio.play();
       play.html("&#xe64f;");
     }else{
       audio.pause();
       play.html("&#xe608;");
     }
   })
    //音量调节
    vol.on("touchend",function(e){
      var b=e.originalEvent.changedTouches[0].clientY;
      var top=b-vol.offset().top;
      audio.volume=(vol.height()-top)/vol.height();
      $("#mute").html("&#xe672;").removeAttr("data-v");//非常重要
      return false;
   })
    //音量弹出、静音
      $("#mute").on("touchend",function(e){
          vol.css({"display":"block"});
          if($(this).attr("data-v")){
              audio.volume=$(this).attr("data-v");
              $(this).removeAttr("data-v")
              $(this).html("&#xe672;")
          }else{
            $(this).attr("data-v",audio.volume)
            audio.volume=0;
            $(this).html("&#xe607;")
          }
        e.stopPropagation();
      })
       $(document).on("touchend",function(e){
          vol.css({"display":"none"});
      })
    //列表和切换歌曲
    var database=[
                {name:"My Way",author:"张敬轩",src:"musics/My Way.mp3"},
                {name:"遇见",author:"张敬轩",src:"musics/遇见.mp3"},
                {name:"遥远的她",author:"张学友",src:"musics/遥远的她.mp3"},
                {name:"花火",author:"陈慧娴",src:"musics/陈慧娴 - 花火.mp3"},
                {name:"她来听我的演唱会",author:"张学友",src:"musics/张学友 - 她来听我的演唱会.mp3"}
    ]
    var current=0;//当前播放歌曲
    function render(){
     	$("#music-lists").empty();
     	$.each(database,function(i,v){
        if(localStorage.music){
          current=JSON.parse(localStorage.music);
        }
        var s=(i===current)?"active":"";
        audio.src=database[current].src;
        $("#name").html(database[current].name);
        $("#author").html(database[current].author);
        $("<li class="+s+"><div class="+"nameg"+">"+database[i].name+"</div><div class="+"heng"+">-</div><div class="+"authorg"+">"+database[i].author+"</div><div class="+"fontbox"+"><div class="+"font"+">&#xe604;</div> <div class="+"font"+">&#xe724;</div> </div></li>").appendTo($("#music-lists"));
      })
    }
    //点击当前播放
    $("#music-lists").on("touchend","li",function(){
            var index=$(this).index();
            $('#music-lists li').removeClass('active');
            $('#music-lists li').eq(index).addClass('active');
            audio.src=database[index].src;
            $("#name").html(database[index].name);
            $("#author").html(database[index].author);
            localStorage.music=JSON.stringify(index);
            render() ;  
    })
     //下一首
     $("#next").on("touchend",function(){
       current++;
       if(current>=database.length){
        current=0;
      }
      $('#music-lists li').removeClass('active');
      $('#music-lists li').eq(current).addClass('active');
      audio.src=database[current].src;
      $("#name").html(database[current].name);
      $("#author").html(database[current].author);
      localStorage.music=JSON.stringify(current);
      render() ;
    })
      //上一首
      $("#prve").on("click",function(){
         current--;
         if(current<0){
          current=database.length-1;
        }
        $('#music-lists li').removeClass('active');
        $('#music-lists li').eq(current).addClass('active');
        audio.src=database[current].src;
        $("#name").html(database[current].name);
        $("#author").html(database[current].author);
        localStorage.music=JSON.stringify(current);
        render() ;
    })
     //添加歌曲
      /*add.on("click",function(){
          $("<li><div class="+"nameg"+">"+database[i].name+"</div><div class="+"authorg"+">"+database[i].author+"</div><div class="+"fontbox"+"><div class="+"font"+">&#xe604;</div> <div class="+"font"+">&#xe724;</div> </div></li>").appendTo($("#music-lists"));
           render();
      })*/

      //点击调进度
          progress.on("touchend",function(e){
            var a=e.originalEvent.changedTouches[0].clientX;
            var left=progress.eq(0).offset().left;
            audio.currentTime=audio.duration*(a-left)/progress.width();
          })
          progress.on("touchend",pv,function(e){
            e.stopPropagation();
            e.preventDefault();
          })
      //播放进度拖拽
      pv.on("touchstart",function(e){
          e.preventDefault();
          var start=e.offsetX;
          $(document).on("touchmove",function(e){
              var left=e.originalEvent.changedTouches[0].clientX-progress.offset().left;
              if(left/pv.width()<0||left/pv.width()>1){
                return 
              }
              audio.currentTime=left/progress.width()*audio.duration;
          })
      })
      $(document).on("touchend",function(){
           $(document).off("touchmove");
      })
      pv.on("touchend",function(e){
          e.stopPropagation();
          e.preventDefault();
      })
      //收藏
      $('.font').on("touchend",function(){
           var index=$(this).parentsUntil("li").index();console.log(1)
            var cc=$('#music-lists li').eq(index).filter(".font:nth-child(1)");
            cc.css({"color":"#6e2427"});
      })
render() ;
      //显示、隐藏列表
      $("#tt").on("touchend",function(){
         $(this).css({"color":"#fff"});
      })
     $("#tt").on("touchend",function(){
         $(this).css({"color":"#565656"});
       $(".danchu").eq(0).css({"display":"block"});
       return false;
     })
     $(".closed").eq(0).on("touchend",function(){
       $(".danchu").eq(0).css({"display":"none"});
       return false;
     })
    /////////////////////////////////////////////////////////////////所有事件
    $(audio).on('loadstart',function(){
     console.log('loadstart');
      audio.play();
      play.html("&#xe64f;");
   });
    $(audio).on('canpaly',function(){
           console.log('canpaly')//JSON.parse()中键值都要用双引号
           //播放调用
         });
    $(audio).on('progess',function(){
     console.log('progess')
   });
    $(audio).on('paly',function(){
     console.log('paly');
         
   });
    $(audio).on('seek',function(){
     console.log('seek');
   });
    //歌曲结束触发事件
    $(audio).on('ended',function(){
      console.log(1);
        $('#music-lists li').removeClass('active');
       $('#music-lists li').eq(current++).addClass('active');
        audio.src=database[current++].src;
        $("#name").html(database[current++].name);
        $("#author").html(database[current++].author);
        render();
    });
    $(audio).on('timeupdate',function(){
      console.log('timeupdate');
      $(durtion).html(formate(audio.duration));//放在外面为 NaN
     $("#current").html(formate(audio.currentTime));
     // 进度调节
      var width=progress.width();
      pv.css({"left":(width*audio.currentTime/audio.duration)-width});
    });
    $(audio).on("volumechange",function(){
      //音量调节
       var t=vol.height();
       vi.css({"top":t-t*audio.volume});
    })
  });