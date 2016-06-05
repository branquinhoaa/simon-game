var audioError = function(){
  return new Howl({
    urls: ['/home/amanda/Brackets/javaScript/simonGame/beep2.mp3'],
    volume: 0.5,
  })
}

var audioGreen = function(callback){
  return  new Howl({
    urls: ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'],
    volume: 0.5,
    onend: function() {
      $("#green").css('background','#00A74A');
      if (callback){
        callback();
      }
    }
  });
} 
var audioRed = function(callback){
  return  new Howl({
    urls: ['https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'],
    volume: 0.5,
    onend: function() {
      $("#red").css('background','#9F0F17');
      if (callback){
        callback();
      }
    }
  }); 
}
var audioBlue = function(callback){
  return  new Howl({
    urls: ['https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'],
    volume: 0.5,
    onend: function() {
      $("#blue").css('background','#094A8F');
      if (callback){
        callback();
      }
    }
  }); 
}
var audioYellow = function(callback){
  return  new Howl({
    urls: ['https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'],
    volume: 0.5,
    onend: function() {
      $("#yellow").css('background','#CCA707');
      if (callback){
        callback();
      }
    }
  });
}

var num;
var aleat;
var btnClicked;
var typeofGame;
var allColors=['green','red','blue','yellow'];
var rightSequence;
var personSequence;
var order=0;

function startGame(){
  disableColor();
  order=0;
  btnClicked=true;
  num=1;
  rightSequence=[];
  personSequence=[];
  continueGame();
}  


function continueGame(){
  order=0;
  aleat=Math.floor((Math.random() * 4));
  var choice = allColors[aleat];
  rightSequence.push(choice);
  disableColor();
  doit();

}


function enableColor(){
  $("span").css("pointer-events", "auto");
}

function disableColor(){
  $("span").css("pointer-events", "none");
}


function doit(){
  $("#number").html(num);
  var counter=0; //define um contador para cada chamada;
  for (var i in rightSequence){
    var color=rightSequence[i];
    (function(color){   // encapsulo o setTimeOut para nao executar de uma vez
      setTimeout(function(){
        lightSound(color);       
      },800 * ++counter);

    })(color);
  }
  (function(){
    setTimeout(function(){
      enableColor();
    }, 800 * counter+1);
  })();
}

function lightSound(cor, callback){
  switch (cor){
    case 'red':
      $("#red").css('background','#ff0000');
      audioRed(callback).play(); 
      break;
    case 'green':
      $("#green").css('background','#00ff00');
      audioGreen(callback).play(); 
      break;
    case 'blue':
      $("#blue").css('background','#0000ff');
      audioBlue(callback).play(); 
      break;
    case 'yellow':
      $("#yellow").css('background','#FFFF00');
      audioYellow(callback).play(); 
  }
}



$(document).ready(function(){
  $('button').on("click", function(){
    typeofGame=this.id;
    if (typeofGame=='strict'){
      $("#strictActive").css('background','#ff0000');
      if(btnClicked){
        btnClicked=false;
        $("#strictActive").css('background','#000');
        typeofGame='start';
        startGame();
      }
    }
    $("#"+typeofGame).attr('disabled','disabled');
    startGame();
  });  
  $("#green").on("click", function(){
    order++;
    $("#green").css('background','#00ff00');
    audioGreen().play();
    personSequence.push('green');
    verify('green');  
  });
  $("#red").on("click", function(){
    order++;
    $("#red").css('background','#ff0000');
    audioRed().play();
    personSequence.push('red');
    verify('red');   
  });
  $("#blue").on("click", function(){
    order++;
    $("#blue").css('background','#0000ff');
    audioBlue().play();
    personSequence.push('blue');
    verify('blue');     
  });
  $("#yellow").on("click", function(){
    order++;
    $("#yellow").css('background','#FFFF00');
    audioYellow().play();
    personSequence.push('yellow');
    verify('yellow');   
  });

  $("#number").on("errou", function(event, callback){
    $("#number").html("--");

    setTimeout(function(){
      callback();
      displayNum();
    },1500);
  })
});

function displayNum(){
  $("#number").html(num);
}

function enableButton(){
  $("#"+typeofGame).attr('disabled', false);
}

function verify(cor){
  if (rightSequence[order-1]!==cor){
    disableColor();
    if(typeofGame=="strict"){  //restart        
      num='loser';
      $("#number").html(num);
      setTimeout(function(){
        startGame();
      },2000);
      return;
    } else{  //repeat sequence
      order=0;
      personSequence=[];
      $("#number").trigger("errou",[doit]);
      return;
    }
  }
  if (rightSequence.length==personSequence.length){
    if(rightSequence.length>=20){
      num="winner!";
      $("#number").html(num);
      enableButton();
    } else {
      num++;
      personSequence=[];
      continueGame();  
    } 
  }
}