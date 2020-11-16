// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const scoreCounter = document.querySelector('p');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

class Shape {
  constructor (x,y,velX,velY){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = true;
  }
}

class Ball extends Shape {
  constructor (x, y, velX, velY, color, size){
    super(x,y,velX,velY);
    this.color = color;
    this.size = size;
  }
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) { //collided
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x,y){
    super(x,y,20,20);
    this.color = 'white';
    this.size = 10;
  }
  draw(){
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  checkBounds(){
    if ((this.x + this.size) >= width) {
      this.x -= 1;
    }
  
    if ((this.x - this.size) <= 0) {
      this.x +=1 
    }
  
    if ((this.y + this.size) >= height) {
      this.y -=1;
    }
  
    if ((this.y - this.size) <= 0) {
      this.y +=1;
    }
  }
  setControls(){
    let _this = this;
    window.onkeydown = function(e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
  }
  }
  collisionDetect(){
    for (let j = 0; j < balls.length; j++) {
      if (balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) { //collided
          balls[j].exists = false;
        }
      }
    }
  }
}

let balls = [];
let totalBalls = 25
while (balls.length < totalBalls) {
  let size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );

  balls.push(ball);
}
let evilcircle = new EvilCircle(random(10,width - 10),random(0 + 10,height - 10))
evilcircle.setControls();
scoreCounter.textContent = "Ball count: " + totalBalls;
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  totalBalls = 0;
  for (let i = 0; i < balls.length; i++) {
    if(balls[i].exists){
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    totalBalls += 1;
    }
  }
  evilcircle.draw();
  evilcircle.checkBounds();
  evilcircle.collisionDetect();
  scoreCounter.textContent = "Ball count: " + totalBalls;
  requestAnimationFrame(loop);
}

loop();