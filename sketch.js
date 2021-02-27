var mario, marioRunning;
var ground;
var cloud, cloudsGroup;
var obstacle, obstaclesGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;
var highScore = 0;
function preload(){
  marioRunning = loadAnimation("images/running1.png","images/running2.png", "images/running3.png");
  marioStanding = loadAnimation("images/mario standing.png");
  obstacle1 = loadImage("images/enemy 1.png");
  obstacle2 = loadImage("images/enemy3.png");
  obstacle3 = loadImage("images/enemy4.png");
  obstacle4 = loadImage("images/enemy5.png");
  obstacle5 = loadImage("images/enemy6.png");
  cloudImage = loadImage("images/cloud.png");
  coinImage = loadImage("images/coin.png");
  restartImage = loadImage("images/restart.png");
  coinSound = loadSound("coin.wav");
  marioDie = loadSound("marioDie.wav");
  

}
function setup() {
  createCanvas(800,300);
  ground = createSprite(400,278,1500,40);
  ground.shapeColor= rgb(188,97,16);
  
  restart = createSprite(380,200);
  restart.addImage(restartImage);
  restart.scale = 0.1;

  mario = createSprite(50,230,20,40);
  mario.addAnimation("running",marioRunning);
  mario.addAnimation("standing",marioStanding);
  mario.scale = 2;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  coinGroup = new Group();
  
}

function draw() {
  background(118, 134, 255);  
  textSize(20);
  fill("white");
  text("Score: "+score, 700,50);
  text("High Score: "+highScore, 550,50);
  if(gameState === PLAY){
    
    restart.visible = false;
    ground.velocityX = -(2 + score/10);
    if(ground.x <50){
      ground.x = 400;
    }
  
    console.log(mario.y);
    if(keyDown("space") && mario.y > 200){
      mario.velocityY = -12;
    }
  
    mario.velocityY = mario.velocityY + 0.5;

    if(coinGroup.isTouching(mario)){
      coinGroup[0].destroy();
      score = score + 1;
      coinSound.play();
    }
    if(obstaclesGroup.isTouching(mario)){
      gameState = END;
    }
    spawnObstacles();
    spawnClouds();
    spawnCoins();
  }
  else if(gameState === END){
    marioDie.playMode('untilDone');
    marioDie.play();
    marioDie.noLoop();
    mario.changeAnimation("standing",marioStanding);
    restart.visible = true;
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);
    if(score>highScore){
      highScore = score;
    }
    textSize(50);
    fill("white");
    text("Game Over", 250,100);
    textSize(25);
    text("Your Score: "+ score, 300,150);
    if(mousePressedOver(restart)){
      resetGame();
    }
    
  }
  
  mario.collide(ground);

  

  drawSprites();
}

function spawnClouds(){
  if(frameCount % 150 === 0){
    cloud = createSprite(800, Math.round(random(10,180)),40,20);
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -(3 + score/10);
    cloud.lifetime = 300;
    cloud.depth = mario.depth;
    mario.depth+=1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount%300 ===0){
    obstacle=createSprite(800,245,20,40);
    var rand = Math.round(random(1,5));
    switch(rand){
      case 1: obstacle.velocityX = -2;
              obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.velocityX = -4;
              obstacle.addImage(obstacle2);
              break;       
      case 3: obstacle.velocityX = -6;
              obstacle.addImage(obstacle3);
              obstacle.y = 235;
              break;
      case 4: obstacle.velocityX = -7;
              obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.velocityX = -3;
              obstacle.addImage(obstacle5);
              break;

      default: break;
    }
    obstacle.lifetime = 500;
    obstaclesGroup.add(obstacle); 

  }
}
function spawnCoins(){
  if(frameCount % 100 === 0){
    coin = createSprite(800, Math.round(random(100,210)),40,20);
    coin.addImage(coinImage);
    coin.scale = 0.7;
    coin.velocityX = -3+(score/10);
    coin.lifetime = 300;
    coin.depth = mario.depth;
    mario.depth+=1;
    coinGroup.add(coin);
  }
}

function resetGame(){
  gameState = PLAY;
  mario.changeAnimation("running", marioRunning);
  restart.visible = false;
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}