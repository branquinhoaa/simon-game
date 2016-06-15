$(document).ready(function(){
	var ui=new UI();
	ui.turnOnOff();  
});

function Game(typeOfGame){
	this.typeOfGame = typeOfGame;
	this.rightSequence=[];
	this.personSequence=[];    
	this.allColors = ['green','red','blue','yellow']; 
	this.order=0;
}

Game.prototype.sortColor = function (){
	var numColors = this.allColors.length;
	var random=Math.floor((Math.random() * numColors));
	this.rightSequence.push(this.allColors[random]);
	return this.rightSequence;
}

Game.prototype.reset = function(all){
	this.personSequence=[];
	this.order=0;
	if (all){
		this.rightSequence=[]; 
	}
}

Game.prototype.isRight = function(color){
	return (this.rightSequence[this.order-1]===color);	
}

function UI(){  
	this.game;
	this.num=1;
	this.maxRounds=20; 
}

UI.prototype.turnOnOff = function(){
	var self=this;
	$('.offBtn').on('click', function(){
		$('.offBtn').toggleClass('onBtn');
		if ($('.offBtn').hasClass('onBtn')){ 
			self.changeColorDisplay('none');
			self.bindGameEvents();
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

UI.prototype.lightSound = function (cor,callback){          
	$('#'+cor).addClass('active');
	var storeColInf ={
		'red': 1,
		'green': 2,
		'blue': 3,
		'yellow': 4   
	};
	this.playAudio(cor, storeColInf[cor], callback).play(); 
}

UI.prototype.displaySequence  = function (sequence){                
	var timeWait=800;

	$('#number').html(this.num);
	var counter=0; 
	for (var i in sequence){
		var color=sequence[i];
		timing(this.lightSound.bind(this), timeWait * ++counter, color);
	}
	timing(this.changeColorDisplay.bind(this), timeWait*counter+1, 'auto');

	function timing(callback, time, arg){
		setTimeout(function(){
			callback(arg);
		}, time);
	}
}

UI.prototype.playAudio =function(color,number, callback){                
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

UI.prototype.changeColorDisplay=function(permission){ 
	$('span').css('pointer-events', permission);
}

UI.prototype.verify = function (cor){     
	var timeRestart=2000;
	var self=this;
	if (!this.game.isRight(cor)){  
		this.changeColorDisplay('none');
		if(this.game.typeOfGame=='strict'){    
			$('#number').html('loser');
			setTimeout(function(){
				self.game.reset('all');
				self.num=1;
				self.proceedGame();
			},timeRestart);
			return;
		} else{  
			this.game.reset();
			$('#number').trigger('error');
			return;
		}
	}
	if (this.game.rightSequence.length==this.game.personSequence.length){
		if(this.game.rightSequence.length>=this.maxRounds){
			$('#number').html('winner!');
			$('#'+this.game.typeOfGame).attr('disabled', false);
		} else {
			this.num++;
			this.game.reset();
			this.proceedGame();  
		} 
	}
}

UI.prototype.bindGameEvents=function (){
	var self=this;
	$('#number').on('error', function(){
		$('#number').html('--');
		setTimeout(function(){
			self.displaySequence(self.game.rightSequence);
			$('#number').html(self.num);
		},1500);
	});  

	$('.color').on('click', function(){
		var idClicked = $(this).attr('id');
		self.game.order++;
		self.lightSound(''+idClicked+'');
		self.game.personSequence.push(idClicked);
		self.verify(''+idClicked+'');
	});
	$('.starter').on('click', function(){
		self.setBtnFun('disabled');
		var typeOfGame = $(this).attr('id')
		if (typeOfGame=='strict'){
			$('#strictActive').addClass('active');
		}
		self.game= new Game (typeOfGame);
		self.proceedGame();
	}); 
}

UI.prototype.proceedGame= function(){
	var seq=this.game.sortColor(); 
	this.changeColorDisplay('none');
	this.displaySequence(seq);
}

