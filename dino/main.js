const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');


let score;
let highscore;
let scoreText;
let highScoreText;
let player;
let gravity;
let Obstacles=[];
let gameSpeed;
let keys={};
//eventListeners
document.addEventListener('keydown',function(evt){
	keys[evt.code]=true;
});
document.addEventListener('keyup',function(evt){
	keys[evt.code]=false;
});
class Player{
	constructor(x,y,w,h,c){
		this.x=x;
		this.y=y;
		this.w=w;
		this.h=h;
		this.c=c;

		this.dy=0;
		this.jumpForce=20;
		this.originalHeight=h;
		this.grounded=false;
		this.jumpTimer=0;
	}
	Animate(){
		//jump
		if(keys['ArrowUp']){
			this.Jump();
		}
		else{
			this.jumpTimer=0;
		}
		this.y+=this.dy
		//shrinking
		if(keys['ArrowDown']){
			this.h=this.originalHeight/2;
		}
		else{
			this.h=this.originalHeight;
		}
		//gravity
		if(this.y+this.h<canvas.height){
			this.dy+=gravity;
			this.grounded=false;
		}
		else{
			this.dy=0;
			this.grounded=true;
			this.y=canvas.height-this.h;
		}
    
		this.Draw();
	}
	Jump(){
		if(this.grounded&&this.jumpTimer==0){//grounded
			this.jumpTimer=1;
			this.dy=-this.jumpForce;
		}
		else if(this.jumpTimer>0&&this.jumpTimer<15){//in air check for the maxm jump height
			this.jumpTimer++;
			this.dy=-this.jumpForce;
		}
	}

	Draw(){
		ctx.beginPath();
		ctx.fillStyle=this.c;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.closePath();
	}
}//classPlayer
class Obstacle{
	constructor(x,y,w,h,c){
		this.x=x;
		this.y=y;
		this.w=w;
		this.h=h;
		this.c=c;

		this.dx=-gameSpeed;
	}
	Update(){
		this.x+=this.dx;//moving the obstacles to left 
		this.dx-=(gameSpeed*.6);//increasing he speed of the obstacles as they reach the end
	}
	Draw(){
		ctx.beginPath();
		ctx.fillStyle=this.c;
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.closePath();
	}
}//Obstacle

class Text{
	constructor(t,x,y,a,c,s){//score,x,y,textAlign,color,fontSize
		this.t=t;
		this.x=x;
		this.y=y;
		this.a=a;
		this.c=c;
		this.s=s;
	}
	Draw(){
		ctx.beginPath();
		ctx.fillStyle=this.c;//color
		ctx.font=this.s+"px Arial";//font
		ctx.textAlign=this.a;//textAlign
		ctx.fillText(this.t,this.x,this.y);//score,x,y
		ctx.closePath();
	}
}//Text

//Game functions
function SpawnObstacle(){
	let size=RandomIntInRange(20,170);
	let type=RandomIntInRange(0,1);
	let obstacle=new Obstacle(canvas.width+size,canvas.height-size,size,size,'#2484E4');
	if(type==1){
		obstacle.y-=player.originalHeight-10;
	}
	Obstacles.push(obstacle);
}
function RandomIntInRange(min,max){
	return Math.round(Math.random()*(max-min)+min);
}

function Start(){
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight;

	ctx.font='20px sans-serif';

	gameSpeed=0.1;
	gravity=1;

	score=0;
	highscore=0;
    highScoreText=new Text('HighScore:'+highscore,250,25,"left",'#212121','20');
	player=new Player(25,0,50,50,'#AF5858');
	scoreText=new Text('Score:'+score,25,25,"left",'#212121','20');
    Update();
	//requestAnimationFrame(Update);
}//spawnObstacle

let initialSpawnTimer=200;
let spawnTimer=200;

function Update(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
		spawnTimer--;
	if(spawnTimer<=90){//time for next obstacle
		SpawnObstacle();
		spawnTimer=initialSpawnTimer-gameSpeed*(RandomIntInRange(5,8));
		if(spawnTimer<60){
			spawnTimer=Math.random()*200+60;
		}
	}
	for(let i=0;i<Obstacles.length;i++){
		let o=Obstacles[i];
		if(player.x<o.x+o.w&&player.x+player.w>o.x&&player.y<o.y+o.h&&player.y+player.h>o.y){//collision
			Obstacles=[];
			spawnTimer=initialSpawnTimer;
			gameSpeed=.15;
			if(score>highscore){
			highscore=score;
			highScoreText.t="HighScore:"+highscore;
			}
			alert("your score:"+score);
			score=0;
		}
		o.Update();
		o.Draw();
	}
	player.Animate();
	score++;
	scoreText.t="Score:"+score;
	highScoreText.t="HighScore:"+highscore;
	highScoreText.Draw();
	scoreText.Draw();
    gameSpeed+=.000003;
	requestAnimationFrame(Update);
}//Update

Start();