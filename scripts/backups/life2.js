const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

var distC = 50;
var particles = [];

function createParticle(posX, posY, velX, velY, type = 'stem', currentTime, energy = 0, physics = false) {
    return { posX: posX, posY: posY, velX: velX, velY, velY, type: type, currentTime: currentTime, energy: energy, physics: physics };
}

function createParticles(number) {
    for (let i = 0; i < number; i++) {
        const posX = Math.random() * width;
        const posY = Math.random() * height;
        particles.push(createParticle(posX, posY, 0, 0, 'nutrients', Date.now()));
    }
}

function rule(particles1, particles2, g) {
    for (let i = 0; i < particles1.length; i++) {
        fx = 0;
        fy = 0;
        for (let j = 0; j < particles2.length; j++) {
            a = particles1[i];
            b = particles2[j];
            dx = a.posX - b.posX;
            dy = a.posY - b.posY;
            d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0 && d < 80) {
                F = (g * 1) / d;
                fx += F * dx;
                fy += F * dy;
            }
        }
        a.velX = (a.velX + fx) * 0.5;
        a.velY = (a.velY + fy) * 0.5;
        a.posX += a.velX;
        a.posY += a.velY;
        if (a.posX <= 0 || a.posX >= width) { a.velX *= -1; }
        if (a.posY <= 0 || a.posY >= height) { a.velY *= -1; }
    }
};

function verifyDistance(particle1, particle2) {
    const dx = particle1.posX - particle2.posX;
    const dy = particle1.posY - particle2.posY;
    return Math.sqrt(dx * dx + dy * dy)
}

function verifyDistanceParticles(particle, distance) {
    let counters = { 'nutrients': [], 'mother': [], 'membrane': [], 'stem': [] };
    particles.forEach(
        (currentParticle) => {
            const dist = verifyDistance(currentParticle, particle);
            if (dist <= distance) {
                /*if(currentParticle !== particle){
                  counters[currentParticle.type].push(currentParticle);
                }*/

                counters[currentParticle.type].push(currentParticle);
            } else {
                //currentParticle.type = 'nutrients';
            }
        }
    );
    return counters;
}

function contParticles(particle, dist) {
    particle.type = 'mother'
    verifyDistanceParticles(particle, dist);
}

function particlesActions() {
    const max = 1;
    const min = -2;
    particles.forEach(
        (particle) => {
            particle.currentTime = Date.now();
            let particlesClose = {};
            let velX = 0;
            let velY = 0;
            switch (particle.type) {
                case 'nutrients':
                    particlesClose = verifyDistanceParticles(particle, 1);
                    if (particlesClose['nutrients'].length >= 3) {
                        console.log(particlesClose);
                        particlesClose['nutrients'].forEach(
                            (particle) => {
                                particle.type = 'stem';
                            }
                        );
                    }
                    velX = Math.random() * (max - min + 1) + min;
                    velY = Math.random() * (max - min + 1) + min;
                    particle.posX += velX;
                    particle.posY += velY;
                    if (particle.x <= 0 || particle.x >= width) { particle.vx *= -1; }
                    if (particle.y <= 0 || particle.y >= height) { particle.vy *= -1; }
                    break;
                case 'stem':
                    particlesClose = verifyDistanceParticles(particle, 40);
                    if (particlesClose['stem'].length >= 6) {
                        console.log(particlesClose);
                        particlesClose['stem'].forEach(
                            (currentParticle) => {
                                currentParticle.type = 'mother';
                            }
                        );
                    }
                    velX = Math.random() * (max - min + 1) + min;
                    velY = Math.random() * (max - min + 1) + min;
                    particle.posX += velX;
                    particle.posY += velY;
                    if (particle.x <= 0 || particle.x >= width) { particle.vx *= -1; }
                    if (particle.y <= 0 || particle.y >= height) { particle.vy *= -1; }
                    break;
                case 'mother':
                    particlesClose = verifyDistanceParticles(particle, 40);
                    if (particlesClose['mother'].length <= 2) {
                        if (Date.now() - particle.currentTime <= 2000) {
                            particle.type = 'nutrients';
                        }
                    } else {
                        particle.currentTime = Date.now();
                    }

                    if (particlesClose['membrane'].length <= 10) {
                        particlesClose['stem'].forEach(
                            (currentParticle) => {
                                currentParticle.type = 'membrane';
                            }
                        );
                    }

                    if (!particle.physics) {
                        rule(particlesClose['mother'], particlesClose['mother'], particlesClose['mother'].length <= 5 ? -0.01 : 0.005);
                    }
                    break;
                case 'membrane':
                    particlesClose = verifyDistanceParticles(particle, 40);
                    if (particlesClose['mother'].length <= 0) {
                        if (Date.now() - particle.currentTime <= 1000) {
                            particle.type = 'nutrients';
                        }
                    } else {
                        particle.currentTime = Date.now();
                        if (particlesClose['nutrients'].length >= 0) {
                            particlesClose['nutrients'].forEach(
                                (currentParticle) => {
                                    particlesClose['mother'][Math.floor(Math.random() * particlesClose['mother'].length)].energy++;
                                }
                            );
                        }
                    }

                    if (!particle.physics) {
                        rule(particlesClose['membrane'], particlesClose['membrane'], 0.1);
                        rule(particlesClose['membrane'], particlesClose['mother'], -8);
                    }
                    break;
            }
        }
    );
}

function draw() {
    let color = 'white';
    let size = 2;
    ctx.clearRect(0, 0, width, height);

    particles.forEach(
        (particle) => {
            switch (particle.type) {
                case 'stem':
                    color = '#ffff00';
                    size = 3;
                    break;
                case 'nutrients':
                    color = '#0080ff';
                    size = 2;
                    break;
                case 'mother':
                    color = '#ff00fb';
                    size = 5;
                    break;
                case 'membrane':
                    color = '#00ff08';
                    size = 3;
                    break;
                default:
                    color = 'white';
                    size = 4;
                    break;
            }
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;

            /*ctx.fillStyle = color;
            ctx.fillRect(particle.posX, particle.posY, size, size);*/

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(particle.posX, particle.posY, size, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

        }
    )
}


function update() {
    draw();
    particlesActions();
    requestAnimationFrame(update);
}

function startSimulation() {
    createParticles(1000);
    return update();
}

startSimulation();