$(document).ready(function(){
  var ui=new UI();
  ui.turnOnOff();  
});

function UI(){  
}

UI.prototype.turnOnOff = function(){
  var self=this;
  $('.offBtn').on('click', function(){
    $('.offBtn').toggleClass('onBtn');
    if ($('.offBtn').hasClass('onBtn')){ 
      var player = new Player();    
      player.bindPlayerEvents();
      self.setBtnFun(false);
    } else{
      self.setBtnFun('disabled');
      $('#number').html(' ');
      $('#strictActive').removeClass('active');
      location.reload(true);
    }
  });
}

UI.prototype.setBtnFun=function(arg){
  $('.starter').attr('disabled',arg);
}

function Game(typeofGame){
  this.num=1;
  this.typeofGame = typeofGame;
  this.rightSequence=[];
  this.personSequence=[];    
  this.order=0;
  this.maxRounds=20;
  this.allColors = ['green','red','blue','yellow'];
}


Game.prototype.startGame = function (){
  var numColors = this.allColors.length;
  var random=Math.floor((Math.random() * numColors));
  this.rightSequence.push(this.allColors[random]);
  this.changeColorDisplay('none');
  this.displaySequence();
}


Game.prototype.lightSound = function (cor,callback){
  $('#'+cor).addClass('active');
  var storeColInf ={
    'red': 1,
    'green': 2,
    'blue': 3,
    'yellow': 4   
  };
  this.playAudio(cor, storeColInf[cor], callback).play(); 
}

Game.prototype.displaySequence  = function (){
  var timeWait=800;

  $('#number').html(this.num);
  var counter=0; 
  for (var i in this.rightSequence){
    var color=this.rightSequence[i];
    timing(this.lightSound.bind(this), timeWait * ++counter, color);
  }
  timing(this.changeColorDisplay.bind(this), timeWait*counter+1, 'auto');

  function timing(callback, time, arg){
    setTimeout(function(){
      callback(arg);
    }, time);
  }
}

Game.prototype.playAudio =function(color,number, callback){
  return  new Howl({
    urls: ['https://s3.amazonaws.com/freecodecamp/simonSound'+number+'.mp3'],
    volume: 0.5,
    onend: function() {
      $('#'+color).removeClass('active');
      if (callback){
        callback();
      }
    }
  });  
}

Game.prototype.changeColorDisplay=function(arg){
  $('span').css('pointer-events', arg);
}

Game.prototype.verify = function (cor){
  var timeRestart=2000;
  var self=this;
  if (this.rightSequence[this.order-1]!==cor){
    this.changeColorDisplay('none');
    if(this.typeofGame=='strict'){        
      $('#number').html('loser');
      setTimeout(function(){
       self.reset('all');
       self.startGame();
      },timeRestart);
      return;
    } else{  
      this.reset();
      $('#number').trigger('error');
      return;
    }
  }
  if (this.rightSequence.length==this.personSequence.length){
    if(this.rightSequence.length>=this.maxRounds){
      $('#number').html('winner!');
      $('#'+this.typeofGame).attr('disabled', false);
    } else {
      this.num++;
      this.reset();
      this.startGame();  
    } 
  }
}

Game.prototype.bindGameEvents=function (){
  var self=this;
  $('#number').on('error', function(){
    $('#number').html('--');
    setTimeout(function(){
      self.displaySequence();
      $('#number').html(self.num);
    },1500);
  });  

  $('.color').on('click', function(){
    var idClicked = $(this).attr('id');
    self.order++;
    self.lightSound(''+idClicked+'');
    self.personSequence.push(idClicked);
    self.verify(''+idClicked+'');
  });
}

Game.prototype.reset = function(all){
  this.personSequence=[];
  this.order=0;
  if (all){
    this.num=1;
    this.rightSequence=[]; 
  }
}

function Player (){
}

Player.prototype.bindPlayerEvents = function(){
  var self = this;
  $('.starter').on('click', function(){
    $('.starter').attr('disabled','disabled');
    var typeofGame = $(this).attr('id')
    if (typeofGame=='strict'){
      $('#strictActive').addClass('active');
    }
    var game = new Game (typeofGame);
    game.bindGameEvents();
    game.startGame(); 
  }); 
}

