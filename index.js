// Efeito de partículas
function createParticles() {
  const particlesContainer = document.getElementById("particles")
  const colors = ["#8d02e3", "#03005b", "#009dff", "#b900d6", "#ff3e7f"]

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    // Tamanho aleatório
    const size = Math.random() * 15 + 5
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    // Posição inicial aleatória
    const posX = Math.random() * 100
    const posY = Math.random() * 100
    particle.style.left = `${posX}%`
    particle.style.top = `${posY}%`

    // Cor aleatória
    const color = colors[Math.floor(Math.random() * colors.length)]
    particle.style.backgroundColor = color
    particle.style.boxShadow = `0 0 ${size / 2}px ${color}`

    // Animação
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 5

    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`

    particlesContainer.appendChild(particle)
  }
}

// Efeito de corações flutuantes
function createFloatingHearts() {
  const heartsContainer = document.getElementById("floating-hearts")
  const heartSymbols = ["❤️", "💖", "💕", "💓", "💗", "💘", "💝"]

  setInterval(() => {
    const heart = document.createElement("div")
    heart.classList.add("heart")

    // Símbolo aleatório
    heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)]

    // Posição inicial aleatória
    const posX = Math.random() * 100
    heart.style.left = `${posX}%`
    heart.style.bottom = "-20px"

    // Tamanho aleatório
    const size = Math.random() * 1 + 0.5
    heart.style.fontSize = `${size}rem`

    // Animação
    const duration = Math.random() * 10 + 5
    heart.style.animationDuration = `${duration}s`

    heartsContainer.appendChild(heart)

    // Remover após a animação
    setTimeout(() => {
      heart.remove()
    }, duration * 1000)
  }, 300)
}

// Sistema de mensagens rotativas
function initRotatingMessages() {
  const messagesContainer = document.getElementById("messages-container")
  if (!messagesContainer) {
    console.error("Container de mensagens não encontrado")
    return
  }

  const messages = [
    "Meu coração é seu para sempre...",
    "Você é o amor da minha vida...",
    "Cada momento com você é especial...",
    "Te amarei para todo o sempre...",
    "Você me faz feliz todos os dias...",
    "Meu amor por você é infinito...",
    "Você é meu sonho realizado...",
    "Juntos somos mais fortes...",
    "Nosso amor é eterno...",
    "Você é minha alma gêmea...",
  ]

  // Criar elementos para cada mensagem
  messages.forEach((text, index) => {
    const messageElement = document.createElement("div")
    messageElement.classList.add("message")
    messageElement.textContent = text
    messageElement.id = `message-${index}`
    messagesContainer.appendChild(messageElement)
  })

  let currentMessageIndex = 0
  const messageElements = document.querySelectorAll(".message")

  // Função para mostrar a próxima mensagem
  function showNextMessage() {
    // Esconder mensagem atual
    messageElements.forEach((el) => el.classList.remove("active"))

    // Mostrar próxima mensagem
    messageElements[currentMessageIndex].classList.add("active")

    // Atualizar índice para a próxima mensagem
    currentMessageIndex = (currentMessageIndex + 1) % messageElements.length
  }

  // Mostrar a primeira mensagem
  showNextMessage()

  // Alternar mensagens a cada 4 segundos
  setInterval(showNextMessage, 4000)
}

// Efeito de clique no botão
function buttonClickEffect() {
  const button = document.getElementById("main-button")
  if (!button) return

  button.addEventListener("click", (e) => {
    // Criar efeito de ondulação
    const ripple = document.createElement("span")
    ripple.classList.add("ripple")
    button.appendChild(ripple)

    // Adicionar efeito de vibração
    navigator.vibrate && navigator.vibrate(50)

    // Remover o efeito após a animação
    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
}

// Enhanced particle system
function enhanceParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;
  
  // Clear existing particles
  particlesContainer.innerHTML = '';
  
  // More varied colors
  const colors = [
    "#8d02e3", "#03005b", "#009dff", "#b900d6", "#ff3e7f", 
    "#6a00ff", "#00b3ff", "#d100ff", "#ff0066", "#7700ff"
  ];
  
  // Create more particles with better properties
  const particleCount = window.innerWidth < 768 ? 60 : 100;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    
    // More varied sizes
    const size = Math.random() * 20 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Random color with glow effect
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size/2}px ${color}`;
    
    // Enhanced animation
    const duration = Math.random() * 30 + 20;
    const delay = Math.random() * 10;
    
    // Custom animation properties
    particle.style.setProperty('--float-duration', `${duration}s`);
    particle.style.setProperty('--float-delay', `${delay}s`);
    particle.style.animation = `enhanced-float var(--float-duration) ease-in-out var(--float-delay) infinite alternate`;
    
    particlesContainer.appendChild(particle);
  }
  
  // Add new keyframes to the document
  if (!document.getElementById('enhanced-keyframes')) {
    const style = document.createElement('style');
    style.id = 'enhanced-keyframes';
    style.textContent = `
      @keyframes enhanced-float {
        0% {
          transform: translate(0, 0) rotate(0deg) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(${Math.random() * 180}deg) scale(${Math.random() * 0.5 + 0.8});
          opacity: 0.7;
        }
        50% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.8});
          opacity: 0.5;
        }
        75% {
          transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(${Math.random() * 180}deg) scale(${Math.random() * 0.5 + 0.8});
          opacity: 0.7;
        }
        100% {
          transform: translate(0, 0) rotate(0deg) scale(1);
          opacity: 0.3;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Create dynamic light rays
function createLightRays() {
  const container = document.querySelector('.landing-container');
  if (!container) return;
  
  const raysContainer = document.createElement('div');
  raysContainer.classList.add('light-rays');
  raysContainer.style.position = 'absolute';
  raysContainer.style.top = '0';
  raysContainer.style.left = '0';
  raysContainer.style.width = '100%';
  raysContainer.style.height = '100%';
  raysContainer.style.overflow = 'hidden';
  raysContainer.style.zIndex = '0';
  raysContainer.style.opacity = '0.4';
  raysContainer.style.pointerEvents = 'none';
  
  // Create light rays
  const rayCount = window.innerWidth < 768 ? 3 : 5;
  
  for (let i = 0; i < rayCount; i++) {
    const ray = document.createElement('div');
    ray.classList.add('light-ray');
    
    // Style the ray
    ray.style.position = 'absolute';
    ray.style.top = '50%';
    ray.style.left = '50%';
    ray.style.width = '200%';
    ray.style.height = '200px';
    ray.style.transform = `translate(-50%, -50%) rotate(${i * (360 / rayCount)}deg)`;
    ray.style.background = `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)`;
    ray.style.transformOrigin = 'center center';
    ray.style.animation = `ray-rotate ${30 + i * 5}s linear infinite`;
    ray.style.filter = 'blur(20px)';
    
    raysContainer.appendChild(ray);
  }
  
  // Add keyframes
  if (!document.getElementById('ray-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ray-keyframes';
    style.textContent = `
      @keyframes ray-rotate {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
          opacity: 0.3;
        }
        50% {
          opacity: 0.7;
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg);
          opacity: 0.3;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  container.appendChild(raysContainer);
}

// Create cosmic dust effect
function createCosmicDust() {
  const container = document.querySelector('.landing-container');
  if (!container) return;
  
  const dustContainer = document.createElement('div');
  dustContainer.classList.add('cosmic-dust');
  dustContainer.style.position = 'absolute';
  dustContainer.style.top = '0';
  dustContainer.style.left = '0';
  dustContainer.style.width = '100%';
  dustContainer.style.height = '100%';
  dustContainer.style.overflow = 'hidden';
  dustContainer.style.zIndex = '0';
  dustContainer.style.pointerEvents = 'none';
  
  // Create dust particles
  const dustCount = window.innerWidth < 768 ? 30 : 50;
  
  for (let i = 0; i < dustCount; i++) {
    const dust = document.createElement('div');
    dust.classList.add('dust-particle');
    
    // Random size
    const size = Math.random() * 4 + 1;
    dust.style.width = `${size}px`;
    dust.style.height = `${size}px`;
    
    // Random position
    dust.style.left = `${Math.random() * 100}%`;
    dust.style.top = `${Math.random() * 100}%`;
    
    // Style
    dust.style.position = 'absolute';
    dust.style.borderRadius = '50%';
    dust.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    dust.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
    dust.style.filter = 'blur(1px)';
    
    // Animation
    const duration = Math.random() * 20 + 10;
    dust.style.animation = `dust-float ${duration}s linear infinite`;
    dust.style.animationDelay = `${Math.random() * duration}s`;
    
    dustContainer.appendChild(dust);
  }
  
  // Add keyframes
  if (!document.getElementById('dust-keyframes')) {
    const style = document.createElement('style');
    style.id = 'dust-keyframes';
    style.textContent = `
      @keyframes dust-float {
        0%, 100% {
          transform: translate(0, 0);
          opacity: 0;
        }
        10%, 90% {
          opacity: 0.5;
        }
        50% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  container.appendChild(dustContainer);
}

// Create interactive mouse trail
function createMouseTrail() {
  const container = document.querySelector('.landing-container');
  if (!container || window.innerWidth < 768) return; // Skip on mobile
  
  const trailContainer = document.createElement('div');
  trailContainer.classList.add('mouse-trail');
  trailContainer.style.position = 'absolute';
  trailContainer.style.top = '0';
  trailContainer.style.left = '0';
  trailContainer.style.width = '100%';
  trailContainer.style.height = '100%';
  trailContainer.style.overflow = 'hidden';
  trailContainer.style.zIndex = '2';
  trailContainer.style.pointerEvents = 'none';
  
  container.appendChild(trailContainer);
  
  // Track mouse movement
  let mouseX = 0;
  let mouseY = 0;
  let trailPoints = [];
  
  container.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create trail point
    createTrailPoint(mouseX, mouseY);
  });
  
  function createTrailPoint(x, y) {
    // Limit creation rate
    if (Math.random() > 0.3) return;
    
    const point = document.createElement('div');
    point.classList.add('trail-point');
    
    // Style
    point.style.position = 'absolute';
    point.style.width = '8px';
    point.style.height = '8px';
    point.style.borderRadius = '50%';
    point.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    point.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
    point.style.transform = 'translate(-50%, -50%)';
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;
    point.style.opacity = '0.8';
    point.style.transition = 'transform 0.5s ease-out, opacity 1s ease-out';
    
    trailContainer.appendChild(point);
    
    // Animate and remove
    setTimeout(() => {
      point.style.transform = `translate(-50%, -50%) scale(3)`;
      point.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      if (point.parentNode === trailContainer) {
        point.remove();
      }
    }, 1000);
  }
}

// Enhanced background initialization
function enhanceBackground() {
  enhanceParticles();
  createLightRays();
  createCosmicDust();
  createMouseTrail();
  
  // Enhance light effect
  const lightEffect = document.querySelector('.light-effect');
  if (lightEffect) {
    lightEffect.style.background = 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)';
    lightEffect.style.animation = 'enhanced-pulse 10s ease-in-out infinite alternate';
    lightEffect.style.filter = 'blur(30px)';
    
    // Add enhanced pulse animation
    if (!document.getElementById('enhanced-pulse-keyframes')) {
      const style = document.createElement('style');
      style.id = 'enhanced-pulse-keyframes';
      style.textContent = `
        @keyframes enhanced-pulse {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.3);
          }
          100% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Inicializar todos os efeitos quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  createParticles()
  createFloatingHearts()
  initRotatingMessages()
  buttonClickEffect()
  
  // Add our enhanced background effects
  enhanceBackground();
})
