var mario, mario_running;
var ground, invisibleGround, groundImage;
var obstacle, obstacleImage, obstaclesGroup;
var cloud, cloudImage, cloudsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;
var gameOver, restart, overImage, restartImage;
var jumpSound, dieSound, checkPointSound;

function preload() 
{
  mario_running = loadImage("mario.png");
  groundImage = loadImage("Marioground.png");
  obstacleImage = loadImage("obstacle.png");
  cloudImage = loadImage("cloud.png");
  overImage = loadImage("gameover.png");
  restartImage = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() 
{
  createCanvas(600, 200);
  
  //create a trex sprite
  mario = createSprite(50,160,10,40);
  mario.addImage("running", mario_running);
  mario.scale = 0.25;
  
  //create a ground sprite
  ground = createSprite(200,220,400,20);
  ground.addImage("ground",groundImage);
  ground.scale = 2.5;
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200, 183, 400, 20);
  invisibleGround.visible = false;
  
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  mario.setCollider("rectangle",0,0,130,200);
  //mario.debug = true;
  
  gameOver = createSprite(300, 80);
  gameOver.addImage(overImage);
  gameOver.scale = 0.5;
  
  
  
  restart = createSprite(300, 120);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  
  score = 0;
}

function draw() 
{
  background("skyblue");
  
  textSize(15);
  fill(0);
  text("Score = " + score, 480, 30);
  
  //jump when the space button is pressed
  if(gameState === PLAY)
  {
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(6 + (score/100));
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score % 250 === 0 && score > 0)
      {
        checkPointSound.play();
      }
    
    if (keyDown("space")&&mario.y>=140) 
     {
       mario.velocityY = -11;
       jumpSound.play();
     
     }
  
    mario.velocityY = mario.velocityY + 0.8;

    if (ground.x < 0) 
     {
      ground.x = ground.width / 2;
     }
  
  
    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();
      if(obstaclesGroup.isTouching(mario))
        {
          //mario.velocityY = -11;
          gameState = END;
          dieSound.play();
          //jumpSound.play();
        }
    }
    else if (gameState === END) {
       ground.velocityX = 0;
       mario.velocityY =0;
       obstaclesGroup.setLifetimeEach(-1);
       cloudsGroup.setLifetimeEach(-1);
       obstaclesGroup.setVelocityXEach(0);
       cloudsGroup.setVelocityXEach(0);
       gameOver.visible = true;
       restart.visible = true;
      
      if(mousePressedOver(restart))
        {
          reset();
        }
     }
    mario.collide(invisibleGround);

    drawSprites();
  
}

function reset()
{
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,160,10,40);
   obstacle.velocityX = -(6 + (score/100));

   
    obstacle.addImage(obstacleImage);
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.03;
    obstacle.lifetime = 100;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -6;
    
     //assign lifetime to the variable
    cloud.lifetime = 100;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}