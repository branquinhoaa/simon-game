$(document).ready(function(){
  var num=1,
      aleat,
      btnClicked,
      typeofGame,
      allColors=['green','red','blue','yellow'],
      rightSequence=[],
      personSequence=[],
      order=0,
      storeColInf ={
        "red": 1,
        "green": 2,
        "blue": 3,
        "yellow": 4   
      };

  changeColorDisplay('none');
  setBtnFun('disabled');

  $('.starter').on("click", function(){
    typeofGame = $(this).attr('id')
    if (typeofGame=='strict'){
      $("#strictActive").addClass('strictActive');
    }
    setBtnFun('disabled');
    continueGame();
  });  

  $(".color").on("click", function(){
    var idClicked = $(this).attr('id');
    order++;
    lightSound(''+idClicked+'');
    personSequence.push(idClicked);
    verify(''+idClicked+'');  
  });

  $("#number").on("errou", function(event, callback){
    $("#number").html("--");
    setTimeout(function(){
      callback();
      $("#number").html(num);
    },1500);
  });

  $('.offBtn').on('click', function(){
    $(".offBtn").toggleClass("onBtn");
    if ($('.offBtn').hasClass('onBtn')){ //se tiver on
      setBtnFun(false);
    } else{
      changeColorDisplay('none');
      setBtnFun('disabled')
      reset('all');
      $("#number").html(' ');
      $("#strictActive").removeClass('strictActive');
    }
  });

  function playAudio (color,number, callback){
    return  new Howl({
      urls: ['https://s3.amazonaws.com/freecodecamp/simonSound'+number+'.mp3'],
      volume: 0.5,
      onend: function() {
        $("#"+color).removeClass(""+color+'active');
        if (callback){
          callback();
        }
      }
    });  
  }

  function continueGame(){
    aleat=Math.floor((Math.random() * 4));
    rightSequence.push(allColors[aleat]);
    changeColorDisplay('none');
    doit();
  }

  function doit(){
    $("#number").html(num);
    var counter=0; //define um contador para cada chamada;
    for (var i in rightSequence){
      var color=rightSequence[i];
      timing(lightSound, 800 * ++counter, color);
    }
    timing(changeColorDisplay, 800*counter+1, 'auto');
  }

  function timing(callback, time, arg){
    setTimeout(function(){
      callback(arg);
    }, time);
  }

  function lightSound(cor, callback){
    $("#"+cor).addClass(""+cor+'active');
    playAudio(cor, storeColInf[cor], callback).play(); 
  }

  function verify(cor){
    if (rightSequence[order-1]!==cor){
      changeColorDisplay('none');
      if(typeofGame=="strict"){  //restart        
        $("#number").html('loser');
        setTimeout(function(){
          reset('all');
          continueGame();
        },2000);
        return;
      } else{  //repeat sequence
        reset();
        $("#number").trigger("errou",[doit]);
        return;
      }
    }
    if (rightSequence.length==personSequence.length){
      if(rightSequence.length>=20){
        $("#number").html('winner!');
        $("#"+typeofGame).attr('disabled', false);
      } else {
        num++;
        reset();
        continueGame();  
      } 
    }
  }

  function reset (all){
    personSequence=[];
    order=0;
    if (all){
      num=1;
      rightSequence=[]; 
    }
  }

  function changeColorDisplay(arg){
    $("span").css("pointer-events", arg);
  }

  function setBtnFun(arg){
    $('.starter').attr('disabled',arg);
  }

});