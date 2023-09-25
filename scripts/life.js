const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

var distC = 50;
var particles = [];

function createParticle(posX,posY,velX,velY,type='stem'){
  return {posX:posX,posY:posY,velX:velX,velY,velY,type:type};
}

function createParticles(number){
  for(let i=0;i<number;i++){
    const posX = Math.random()*width;
    const posY = Math.random()*height;
    particles.push(createParticle(posX,posY,0,0,'nutrients'));
  }
}

function verifyDistance(particle1, particle2){
  const dx = particle1.posX - particle2.posX;
  const dy = particle1.posY - particle2.posY; 
  return Math.sqrt(dx * dx + dy * dy)
}

function verifyDistanceParticles(particle, distance){
  let counters = {'nutrients':0,'mother':0,'membrane':0,'stem':0};
  particles.forEach(
    (currentParticle) => {
      const dist = verifyDistance(currentParticle, particle);
      if(dist <= distance){
        if(currentParticle !== particle){
          currentParticle.type = 'membrane';
          counters[currentParticle.type]++;
          console.log(dist);
        }
      }else{
        //currentParticle.type = 'nutrients';
      }
    }
  );
  return counters;
}

function contParticles(particle, dist){
  particle.type = 'mother'
  console.log(verifyDistanceParticles(particle, dist));
}

function draw(){
  let color = 'white';

  ctx.clearRect(0,0,width,height);

  particles.forEach(
    (particle) => {
      switch(particle.type){
        case 'stem':
          color = 'yellow';
        break;
        case 'nutrients':
          color = 'lightgreen';
        break;
        case 'mother':
          color = 'purple';
        break;
        case 'membrane':
          color = 'cyan';
        break;
        default:
          color = 'white';
        break;
      }

      ctx.fillStyle = color;
      ctx.fillRect(particle.posX,particle.posY,4,4);
    }
  )
}


function update(){
  draw();
  contParticles(particles[20], distC);
  contParticles(particles[40], distC);
  contParticles(particles[60], distC);
  contParticles(particles[80], distC);
  requestAnimationFrame(update);
}

function startSimulation(){
  createParticles(1000);
  return update();
}

startSimulation();