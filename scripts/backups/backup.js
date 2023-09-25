const canvas = document.getElementById("canvas");
    const m = canvas.getContext("2d");

    // Função para desenhar uma partícula
    function draw(x, y, color, size) {
      m.fillStyle = color;
      m.fillRect(x, y, size, size);
    }

    // Função para criar uma partícula
    function createParticle(x, y, vx, vy, color) {
      return { x, y, vx, vy, color };
    }

    const particles = [];
    const motherParticles = [createParticle(250, 250, 0, 0, "purple")];
    const G = 0.1; // Constante gravitacional
    const moveInterval = 3000; // Intervalo para mover a mãe (em milissegundos)
    const createInterval = 5000; // Intervalo para criar outra mãe (em milissegundos)
    let lastMoveTime = Date.now();
    let lastCreateTime = Date.now();

    // Função para aplicar atração gravitacional entre partículas
    function applyGravitationalAttraction() {
      const motherParticle = motherParticles[0];

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        for (let j = 0; j < motherParticles.length; j++) {
          const motherParticle = motherParticles[j];
          const dx = motherParticle.x - particle.x;
          const dy = motherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

        
        d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0 && d < 80) {
          F = (G * 1) / d;
          fx += F * dx;
          fy += F * dy;
        }
      }
      motherParticle.velocityX = (motherParticle.velocityX + fx) * 0.5;
      motherParticle.velocityY = (motherParticle.velocityY + fy) * 0.5;
      motherParticle.positionX += motherParticle.velocityX;
      motherParticle.positiony += motherParticle.velocityY;
      if (motherParticle.positionX <= 0 || motherParticle.positionX >= 500) { motherParticle.velocityX *= -1; }
      if (motherParticle.positionY <= 0 || motherParticle.positionY >= 500) { motherParticle.velocityY *= -1; }
        }
      }

    // Função para organizar as partículas em torno das mães
    function arrangeMembraneParticles() {
      for (let k = 0; k < motherParticles.length; k++) {
        const motherParticle = motherParticles[k];
        const numParticles = particles.length;
        const radius = 100; // Raio da disposição circular
        const angleIncrement = (2 * Math.PI) / numParticles;

        for (let i = 0; i < numParticles; i++) {
          const angle = i * angleIncrement;
          const x = motherParticle.x + radius * Math.cos(angle);
          const y = motherParticle.y + radius * Math.sin(angle);
          particles[i].x = x;
          particles[i].y = y;
        }
      }
    }

    // Função para mover a mãe para uma nova posição aleatória
    function moveMother() {
      for (let k = 0; k < motherParticles.length; k++) {
        const motherParticle = motherParticles[k];
        motherParticle.x = Math.random() * canvas.width;
        motherParticle.y = Math.random() * canvas.height;
      }
    }

    // Função para criar outra mãe com as mesmas propriedades
    function createMother() {
      const motherParticle = createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        0,
        0,
        "purple"
      );
      motherParticles.push(motherParticle);
    }

    // Função para verificar a colisão entre mãe e filha
    function checkCollision() {
      for (let k = 0; k < motherParticles.length; k++) {
        const motherParticle = motherParticles[k];
        for (let i = 0; i < motherParticles.length; i++) {
          if (i !== k) {
            const otherMother = motherParticles[i];
            const dx = otherMother.x - motherParticle.x;
            const dy = otherMother.y - motherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
              // Repulsão entre mãe e filha
              const force = 0.5;
              const fx = force * dx;
              const fy = force * dy;

              motherParticle.vx += fx;
              motherParticle.vy += fy;
            }
          }
        }
      }
    }

    // Função para atualizar a simulação
    function update() {
      m.clearRect(0, 0, canvas.width, canvas.height);

      // Desenhar mães
      motherParticles.forEach((motherParticle) => {
        draw(motherParticle.x, motherParticle.y, motherParticle.color, 10);
      });

      // Adicionar uma nova partícula de membrana a cada 100 quadros
      if (frameCount % 100 === 0) {
        const angle = Math.random() * 2 * Math.PI;
        const x = motherParticles[0].x + 100 * Math.cos(angle);
        const y = motherParticles[0].y + 100 * Math.sin(angle);
        const color = "blue"; // Cor da partícula de membrana
        particles.push(createParticle(x, y, 0, 0, color));
      }

      // Aplicar atração gravitacional entre as partículas e as mães
      applyGravitationalAttraction();

      // Organizar as partículas em torno das mães
      arrangeMembraneParticles();

      // Verificar colisões e aplicar repulsão entre mães e filhas
      checkCollision();

      // Desenhar partículas de membrana
      particles.forEach((particle) => {
        draw(particle.x, particle.y, particle.color, 5);
      });

      // Verificar se é hora de mover a mãe
      if (Date.now() - lastMoveTime > moveInterval) {
        moveMother();
        lastMoveTime = Date.now();
      }

      // Verificar se é hora de criar outra mãe
      if (Date.now() - lastCreateTime > createInterval) {
        createMother();
        lastCreateTime = Date.now();
      }

      requestAnimationFrame(update);
    }

    let frameCount = 0;
    update();