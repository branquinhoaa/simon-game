$(document).ready(function(){
  var num=1,
      random,
      btnClicked,
      typeofGame,
      allColors=['green','red','blue','yellow'],
      rightSequence=[],
      personSequence=[],
      order=0,
      timeWait=800,
      timeRestart=2000,
      numColors=4,
      maxRounds=20,
      storeColInf ={
        'red': 1,
        'green': 2,
        'blue': 3,
        'yellow': 4   
      };

  changeColorDisplay('none');
  setBtnFun('disabled');

  $('.starter').on('click', function(){
    typeofGame = $(this).attr('id')
    if (typeofGame=='strict'){
      $('#strictActive').addClass('strictActive');
    }
    setBtnFun('disabled');
    continueGame();
  });  

  $('.color').on('click', function(){
    var idClicked = $(this).attr('id');
    order++;
    lightSound(''+idClicked+'');
    personSequence.push(idClicked);
    verify(''+idClicked+'');  
  });

  $('#number').on('error', function(event, callback){
    $('#number').html('--');
    setTimeout(function(){
      callback();
      $('#number').html(num);
    },1500);
  });

  $('.offBtn').on('click', function(){
    $('.offBtn').toggleClass('onBtn');
    if ($('.offBtn').hasClass('onBtn')){ //se tiver on
      setBtnFun(false);
    } else{
      changeColorDisplay('none');
      setBtnFun('disabled')
      reset('all');
      $('#number').html(' ');
      $('#strictActive').removeClass('strictActive');
    }
  });

  function playAudio (color,number, callback){
    return  new Howl({
      urls: ['https://s3.amazonaws.com/freecodecamp/simonSound'+number+'.mp3'],
      volume: 0.5,
      onend: function() {
        $('#'+color).removeClass(''+color+'active');
        if (callback){
          callback();
        }
      }
    });  
  }

  function continueGame(){
    random=Math.floor((Math.random() * numColors));
    rightSequence.push(allColors[random]);
    changeColorDisplay('none');
    doIt();
  }

  function doIt(){
    $('#number').html(num);
    var counter=0; 
    for (var i in rightSequence){
      var color=rightSequence[i];
      timing(lightSound, timeWait * ++counter, color);
    }
    timing(changeColorDisplay, timeWait*counter+1, 'auto');
  }

  function timing(callback, time, arg){
    setTimeout(function(){
      callback(arg);
    }, time);
  }

  function lightSound(cor, callback){
    $('#'+cor).addClass(''+cor+'active');
    playAudio(cor, storeColInf[cor], callback).play(); 
  }

  function verify(cor){
    if (rightSequence[order-1]!==cor){
      changeColorDisplay('none');
      if(typeofGame=='strict'){  //restart        
        $('#number').html('loser');
        setTimeout(function(){
          reset('all');
          continueGame();
        },timeRestart);
        return;
      } else{  //repeat sequence
        reset();
        $('#number').trigger('error',[doIt]);
        return;
      }
    }
    if (rightSequence.length==personSequence.length){
      if(rightSequence.length>=maxRounds){
        $('#number').html('winner!');
        $('#'+typeofGame).attr('disabled', false);
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
    $('span').css('pointer-events', arg);
  }

  function setBtnFun(arg){
    $('.starter').attr('disabled',arg);
  }

});