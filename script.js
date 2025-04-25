// Define a data de início do contador: 29 de março de 2024, 00:00:00
const startDate = new Date(2024, 2, 29, 0, 0, 0) // (mês 2 = março, pois janeiro é 0)

// Variáveis para otimização de desempenho
let isScrolling = false
let scrollTimeout
const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768
let lastFrameTime = 0
const FRAME_RATE = isMobile ? 30 : 60 // Taxa de quadros reduzida em dispositivos móveis
const FRAME_INTERVAL = 1000 / FRAME_RATE
const isLowEndDevice = navigator.deviceMemory < 4 || navigator.hardwareConcurrency < 4

// Define a função que atualiza o contador na tela
function updateCounter() {
  // Pega a data e hora atual
  const now = new Date()

  // Calcula quantos segundos se passaram desde a data de início
  const secondsPassed = Math.floor((now - startDate) / 1000)

  // Se a data atual for antes da data de início, mostra mensagem e sai da função
  if (secondsPassed < 0) {
    document.getElementById("timer").innerHTML = "Ainda não começou!"
    return
  }

  // Calcula quantos dias inteiros se passaram
  const days = Math.floor(secondsPassed / (60 * 60 * 24))

  // Calcula quantas horas restam após remover os dias completos
  const hours = Math.floor((secondsPassed % (60 * 60 * 24)) / (60 * 60))

  // Calcula quantos minutos restam após remover as horas completas
  const minutes = Math.floor((secondsPassed % (60 * 60)) / 60)

  // Calcula os segundos restantes após remover os minutos completos
  const seconds = secondsPassed % 60

  // Atualiza o conteúdo HTML dos elementos com os valores calculados
  document.getElementById("days").textContent = String(days).padStart(3, "0")
  document.getElementById("hours").textContent = String(hours).padStart(2, "0")
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0")
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0")
}

// Otimização: Usar requestAnimationFrame para atualizar o contador
function updateCounterLoop() {
  const now = performance.now()
  if (now - lastFrameTime >= 1000) {
    // Atualizar a cada segundo
    updateCounter()
    lastFrameTime = now
  }
  requestAnimationFrame(updateCounterLoop)
}

// Carrossel interativo otimizado para mobile
function initCarousel() {
  const imgs = document.getElementById("img")
  const slides = document.querySelectorAll(".slide")
  const indicatorsContainer = document.getElementById("indicators")
  const prevArrow = document.getElementById("prev-arrow")
  const nextArrow = document.getElementById("next-arrow")

  // Verificar se os elementos existem
  if (!imgs || !indicatorsContainer || !prevArrow || !nextArrow) {
    console.error("Elementos do carrossel não encontrados")
    return
  }

  let idx = 0
  let autoplayInterval
  let startX, endX
  let isDragging = false
  let startTranslate = 0

  // Criar indicadores para o carrossel
  function createIndicators() {
    // Limpar indicadores existentes
    indicatorsContainer.innerHTML = ""

    for (let i = 0; i < slides.length; i++) {
      const indicator = document.createElement("div")
      indicator.classList.add("indicator")
      indicator.setAttribute("role", "button")
      indicator.setAttribute("aria-label", `Slide ${i + 1}`)
      indicator.setAttribute("tabindex", "0")

      if (i === 0) {
        indicator.classList.add("active")
        indicator.setAttribute("aria-current", "true")
      }

      indicator.addEventListener("click", () => {
        goToSlide(i)
        resetAutoplay()
      })

      // Acessibilidade: permitir navegação por teclado
      indicator.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          goToSlide(i)
          resetAutoplay()
        }
      })

      indicatorsContainer.appendChild(indicator)
    }
  }

  // Atualizar indicadores ativos
  function updateIndicators() {
    const indicators = document.querySelectorAll(".indicator")
    indicators.forEach((indicator, i) => {
      if (i === idx) {
        indicator.classList.add("active")
        indicator.setAttribute("aria-current", "true")
      } else {
        indicator.classList.remove("active")
        indicator.setAttribute("aria-current", "false")
      }
    })
  }

  // Ir para um slide específico
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return

    idx = index
    updateCarousel()
    updateIndicators()
  }

  // Próximo slide
  function nextSlide() {
    idx = (idx + 1) % slides.length
    updateCarousel()
    updateIndicators()
  }

  // Slide anterior
  function prevSlide() {
    idx = (idx - 1 + slides.length) % slides.length
    updateCarousel()
    updateIndicators()
  }

  // Atualizar a posição do carrossel com otimização
  function updateCarousel() {
    if (!slides.length) return

    const slideWidth = slides[0].clientWidth
    // Usar transform com translateX para melhor desempenho
    requestAnimationFrame(() => {
      imgs.style.transform = `translateX(${-idx * slideWidth}px)`
    })
  }

  // Reiniciar o autoplay
  function resetAutoplay() {
    clearInterval(autoplayInterval)
    // Reduzir intervalo em dispositivos móveis para economizar bateria
    const interval = isMobile ? 5000 : 4000
    autoplayInterval = setInterval(nextSlide, interval)
  }

  // Inicializar eventos de toque para dispositivos móveis
  function initTouchEvents() {
    // Eventos de toque para dispositivos móveis
    imgs.addEventListener("touchstart", handleTouchStart, { passive: true })
    imgs.addEventListener("touchmove", handleTouchMove, { passive: false })
    imgs.addEventListener("touchend", handleTouchEnd, { passive: true })

    // Eventos de mouse para desktop
    imgs.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Manipuladores de eventos de toque
  function handleTouchStart(e) {
    startX = e.touches[0].clientX
    handleDragStart()
  }

  function handleTouchMove(e) {
    if (!isDragging) return
    e.preventDefault() // Previne o comportamento padrão de rolagem
    endX = e.touches[0].clientX
    handleDrag()
  }

  function handleTouchEnd() {
    handleDragEnd()
  }

  // Manipuladores de eventos de mouse
  function handleMouseDown(e) {
    e.preventDefault()
    startX = e.clientX
    handleDragStart()
  }

  function handleMouseMove(e) {
    if (!isDragging) return
    endX = e.clientX
    handleDrag()
  }

  function handleMouseUp() {
    handleDragEnd()
  }

  // Funções de arrastar compartilhadas
  function handleDragStart() {
    isDragging = true
    clearInterval(autoplayInterval)
    startTranslate = -idx * slides[0].clientWidth
    imgs.style.transition = "none"
  }

  function handleDrag() {
    if (!isDragging) return
    const diff = endX - startX
    requestAnimationFrame(() => {
      imgs.style.transform = `translateX(${startTranslate + diff}px)`
    })
  }

  function handleDragEnd() {
    if (!isDragging) return
    isDragging = false
    imgs.style.transition = `transform var(--transition-slow)`

    if (!startX || !endX) return

    const diff = endX - startX
    const threshold = slides[0].clientWidth * 0.2 // 20% da largura do slide

    if (diff < -threshold) {
      nextSlide()
    } else if (diff > threshold) {
      prevSlide()
    } else {
      updateCarousel() // Voltar para a posição original
    }

    resetAutoplay()
    startX = null
    endX = null
  }

  // Adicionar eventos de clique nas setas com otimização para toque
  function initArrowEvents() {
    prevArrow.addEventListener("click", () => {
      prevSlide()
      resetAutoplay()
    })

    nextArrow.addEventListener("click", () => {
      nextSlide()
      resetAutoplay()
    })

    // Acessibilidade: permitir navegação por teclado
    prevArrow.setAttribute("role", "button")
    prevArrow.setAttribute("aria-label", "Slide anterior")
    prevArrow.setAttribute("tabindex", "0")
    prevArrow.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        prevSlide()
        resetAutoplay()
      }
    })

    nextArrow.setAttribute("role", "button")
    nextArrow.setAttribute("aria-label", "Próximo slide")
    nextArrow.setAttribute("tabindex", "0")
    nextArrow.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        nextSlide()
        resetAutoplay()
      }
    })
  }

  // Adicionar evento de teclado para navegação
  function initKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide()
        resetAutoplay()
      }
      if (e.key === "ArrowRight") {
        nextSlide()
        resetAutoplay()
      }
    })
  }

  // Adicionar evento de redimensionamento com debounce
  function initResizeEvents() {
    let resizeTimer
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        updateCarousel()
      }, 250)
    })
  }

  // Inicializar o carrossel
  createIndicators()
  initTouchEvents()
  initArrowEvents()
  initKeyboardEvents()
  initResizeEvents()
  updateCarousel()
  resetAutoplay()
}

// Função para criar emojis com animação - Otimizada para mobile
function createEmoji() {
  // Não criar emojis se estiver rolando a página ou em modo de economia
  if (isScrolling || isReducedMotion) return

  const emojiContainer = document.getElementById("emoji-container")
  if (!emojiContainer) return

  // Reduzir a quantidade de emojis em dispositivos móveis
  const maxEmojis = isMobile ? 20 : 50
  if (emojiContainer.children.length > maxEmojis) return

  const emojiList = ["🎉", "💖", "🖤", "💙", "💜", "🤍", "💖"]
  const emoji = document.createElement("div")
  emoji.innerText = emojiList[Math.floor(Math.random() * emojiList.length)]
  emoji.classList.add("emoji")

  // Posição horizontal aleatória
  emoji.style.left = Math.random() * 100 + "vw"

  // Duração da animação aleatória - mais rápida em dispositivos móveis
  const duration = isMobile
    ? Math.random() * 2 + 3
    : // 3-5s em mobile
      Math.random() * 3 + 4 // 4-7s em desktop
  emoji.style.animationDuration = duration + "s"

  // Tamanho aleatório - menor em dispositivos móveis
  const size = isMobile
    ? Math.random() * 0.3 + 0.8
    : // 0.8-1.1 em mobile
      Math.random() * 0.5 + 1 // 1-1.5 em desktop
  emoji.style.transform = `scale(${size})`

  // Adicionar ao container
  emojiContainer.appendChild(emoji)

  // Remover após a animação
  setTimeout(() => {
    if (emoji.parentNode === emojiContainer) {
      emoji.remove()
    }
  }, duration * 1000)
}

// NOVO CÓDIGO - INÍCIO
// Inicializar o fundo interativo
function initInteractiveBackground() {
  // Criar elementos do fundo
  createAnimatedBackground()
  createWaves()
  createStars()
  createShootingStars()
  createGlowOrbs()
  createFog()
  createBubbles()
  createGridLines()
  
  // Adicionar interatividade ao movimento do mouse
  addMouseInteractivity()
}

// Criar o container do fundo animado
function createAnimatedBackground() {
  const landingContainer = document.querySelector('.landing-container')
  if (!landingContainer) return
  
  const animatedBackground = document.createElement('div')
  animatedBackground.classList.add('animated-background')
  landingContainer.prepend(animatedBackground)
}

// Criar efeito de ondas
function createWaves() {
  const animatedBackground = document.querySelector('.animated-background')
  if (!animatedBackground) return
  
  const waveContainer = document.createElement('div')
  waveContainer.classList.add('wave-container')
  
  // Criar 3 ondas com diferentes velocidades
  for (let i = 0; i < 3; i++) {
    const wave = document.createElement('div')
    wave.classList.add('wave')
    waveContainer.appendChild(wave)
  }
  
  animatedBackground.appendChild(waveContainer)
}

// Criar efeito de estrelas
function createStars() {
  const animatedBackground = document.querySelector('.animated-background')
  if (!animatedBackground) return
  
  const starsContainer = document.createElement('div')
  starsContainer.classList.add('stars-container')
  
  // Reduzir número de estrelas em dispositivos móveis
  const starCount = isMobile ? 50 : 100
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div')
    star.classList.add('star')
    
    // Tamanho aleatório
    const size = Math.random() * 3 + 1
    star.style.width = `${size}px`
    star.style.height = `${size}px`
    
    // Posição aleatória
    star.style.left = `${Math.random() * 100}%`
    star.style.top = `${Math.random() * 100}%`
    
    // Duração da animação aleatória
    const duration = Math.random() * 3 + 2
    star.style.setProperty('--twinkle-duration', `${duration}s`)
    
    starsContainer.appendChild(star)
  }
  
  animatedBackground.appendChild(starsContainer)
}

// Criar estrelas cadentes
function createShootingStars() {
  if (isMobile && isLowEndDevice) return // Pular em dispositivos móveis de baixo desempenho
  
  const animatedBackground = document.querySelector('.animated-background')
  if (!animatedBackground) return
  
  // Criar 5 estrelas cadentes
  for (let i = 0; i < 5; i++) {
    const shootingStar = document.createElement('div')
    shootingStar.classList.add('shooting-star')
    
    // Ângulo e atraso aleatórios
    const angle = Math.random() * 20 - 10
    const delay = Math.random() * 15
    const slope = Math.tan(angle * Math.PI / 180)
    
    shootingStar.style.setProperty('--angle', `${angle}deg`)
    shootingStar.style.setProperty('--delay', `${delay}s`)
    shootingStar.style.setProperty('--slope', slope)
    
    animatedBackground.appendChild(shootingStar)
  }
}

// Criar orbes brilhantes
function createGlowOrbs() {
  const animatedBackground = document.querySelector('.animated-background')
  if (!animatedBackground) return
  
  // Criar 3 orbes brilhantes
  for (let i = 0; i < 3; i++) {
    const glowOrb = document.createElement('div')
    glowOrb.classList.add('glow-orb')
    animatedBackground.appendChild(glowOrb)
  }
}

// Criar efeito de névoa
function createFog() {
  if (isMobile && isLowEndDevice) return // Pular em dispositivos móveis de baixo desempenho
  
  const animatedBackground = document.querySelector('.animated-background')
  if (!animatedBackground) return
  
  const fogContainer = document.createElement('div')
  fogContainer.classList.add('fog-container')
  
  // Criar 2 camadas de névoa
  for (let i = 0; i < 2; i++) {
    const fog = document.createElement('div')
    fog.classList.add('fog')
    fogContainer.appendChild(fog)
  }
  
  animatedBackground.appendChild(fogContainer)
}

// Criar efeito de bolhas
function createBubbles() {
  if (isMobile && isLowEndDevice) return // Pular em dispositivos móveis de baixo desempenho
  
  const animatedBackground = document.querySelector('.animated-background')
  if (!animatedBackground) return
  
  const bubbleContainer = document.createElement('div')
  bubbleContainer.classList.add('bubble-container')
  
  // Criar bolhas em intervalos
  setInterval(() => {
    if (document.hidden || isScrolling) return
    
    const bubble = document.createElement('div')
    bubble.classList.add('bubble')
    
    // Tamanho aleatório
    const size = Math.random() * 30 + 10
    bubble.style.width = `${size}px`
    bubble.style.height = `${size}px`
    
    // Posição horizontal aleatória
    bubble.style.left = `${Math.random() * 100}%`
    
    // Duração e desvio aleatórios
    const duration = Math.random() * 10 + 10
    const drift = Math.random() * 100 - 50
    const scaleEnd = Math.random() * 0.5 + 0.5
    const opacity = Math.random() * 0.3 + 0.2
    
    bubble.style.setProperty('--rise-duration', `${duration}s`)
    bubble.style.setProperty('--drift', `${drift}px`)
    bubble.style.setProperty('--scale-end', scaleEnd)
    bubble.style.setProperty('--bubble-opacity', opacity)
    
    bubbleContainer.appendChild(bubble)
    
    // Remover após a animação
    setTimeout(() => {
      if (bubble.parentNode === bubbleContainer) {
        bubble.remove()
      }
    }, duration * 1000)
  }, isMobile ? 1000 : 500)
  
  animatedBackground.appendChild(bubbleContainer)
}

// Criar linhas de grade
function createGridLines() {
  if (isMobile) return // Pular em dispositivos móveis
  
  const animatedBackground = document.querySelector('.animated-background')
  if (!animatedBackground) return
  
  const gridLines = document.createElement('div')
  gridLines.classList.add('grid-lines')
  
  // Criar linhas horizontais
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div')
    line.classList.add('grid-horizontal')
    line.style.top = `${i * 10}%`
    gridLines.appendChild(line)
  }
  
  // Criar linhas verticais
  for (let i = 0; i < 10; i++) {
    const line = document.createElement('div')
    line.classList.add('grid-vertical')
    line.style.left = `${i * 10}%`
    gridLines.appendChild(line)
  }
  
  animatedBackground.appendChild(gridLines)
}

// Adicionar interatividade ao movimento do mouse
function addMouseInteractivity() {
  if (isMobile) return // Pular em dispositivos móveis
  
  const landingContainer = document.querySelector('.landing-container')
  if (!landingContainer) return
  
  // Criar container para partículas interativas
  const interactiveParticles = document.createElement('div')
  interactiveParticles.classList.add('interactive-particles')
  landingContainer.appendChild(interactiveParticles)
  
  // Adicionar evento de movimento do mouse
  landingContainer.addEventListener('mousemove', (e) => {
    if (isScrolling) return
    
    // Limitar a criação de partículas para melhor desempenho
    if (Math.random() > 0.3) return
    
    const mouseX = e.clientX
    const mouseY = e.clientY
    
    // Criar partícula
    const particle = document.createElement('div')
    particle.classList.add('mouse-particle')
    particle.style.left = `${mouseX}px`
    particle.style.top = `${mouseY}px`
    
    interactiveParticles.appendChild(particle)
    
    // Remover após a animação
    setTimeout(() => {
      if (particle.parentNode === interactiveParticles) {
        particle.remove()
      }
    }, 1500)
  })
  
  // Efeito de paralaxe suave
  landingContainer.addEventListener('mousemove', (e) => {
    if (isScrolling || isLowEndDevice) return
    
    const mouseX = e.clientX / window.innerWidth
    const mouseY = e.clientY / window.innerHeight
    
    // Mover elementos com base na posição do mouse
    const glowOrbs = document.querySelectorAll('.glow-orb')
    glowOrbs.forEach((orb, index) => {
      const factor = (index + 1) * 10
      requestAnimationFrame(() => {
        orb.style.transform = `translate(${(mouseX - 0.5) * factor}px, ${(mouseY - 0.5) * factor}px)`
      })
    })
  })
}

// Create starfield background
function createStarfield() {
  const site = document.querySelector('.site');
  if (!site) return;
  
  const starfield = document.createElement('div');
  starfield.classList.add('starfield');
  
  // Reduce star count on mobile
  const starCount = isMobile ? 100 : 200;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Random size
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Random twinkle duration
    const duration = Math.random() * 4 + 2;
    star.style.setProperty('--twinkle-duration', `${duration}s`);
    
    starfield.appendChild(star);
  }
  
  site.appendChild(starfield);
}

// Create shooting stars
function createShootingStars() {
  if (isMobile && isLowEndDevice) return; // Skip on low-end mobile devices
  
  const site = document.querySelector('.site');
  if (!site) return;
  
  // Create container for shooting stars
  const shootingStarsContainer = document.createElement('div');
  shootingStarsContainer.classList.add('shooting-stars-container');
  shootingStarsContainer.style.position = 'fixed';
  shootingStarsContainer.style.top = '0';
  shootingStarsContainer.style.left = '0';
  shootingStarsContainer.style.width = '100%';
  shootingStarsContainer.style.height = '100%';
  shootingStarsContainer.style.overflow = 'hidden';
  shootingStarsContainer.style.pointerEvents = 'none';
  shootingStarsContainer.style.zIndex = '0';
  
  site.appendChild(shootingStarsContainer);
  
  // Create shooting stars at random intervals
  function createShootingStar() {
    if (document.hidden || isScrolling) return;
    
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    
    // Random angle and position
    const angle = Math.random() * 30 - 60; // -60 to -30 degrees
    const yPos = Math.random() * 70; // Top 70% of the screen
    const delay = Math.random() * 2;
    const slope = Math.tan(angle * Math.PI / 180);
    
    shootingStar.style.top = `${yPos}%`;
    shootingStar.style.setProperty('--angle', `${angle}deg`);
    shootingStar.style.setProperty('--delay', `${delay}s`);
    shootingStar.style.setProperty('--slope', slope);
    
    shootingStarsContainer.appendChild(shootingStar);
    
    // Remove after animation
    setTimeout(() => {
      if (shootingStar.parentNode === shootingStarsContainer) {
        shootingStar.remove();
      }
    }, 6000); // Match animation duration
  }
  
  // Create shooting stars periodically
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance each interval
      createShootingStar();
    }
  }, 3000);
}

// Create aurora effect
function createAuroraEffect() {
  const site = document.querySelector('.site');
  if (!site) return;
  
  const aurora = document.createElement('div');
  aurora.classList.add('aurora');
  
  // Create multiple aurora beams
  const beamCount = isMobile ? 3 : 5;
  
  for (let i = 0; i < beamCount; i++) {
    const beam = document.createElement('div');
    beam.classList.add('aurora-beam');
    
    // Random position and properties
    beam.style.top = `${i * 25}%`;
    beam.style.animationDelay = `${i * 2}s`;
    
    // Random color
    const hue = Math.random() * 60 + 240; // Blue to purple range
    beam.style.background = `linear-gradient(90deg, 
      hsla(${hue}, 100%, 50%, 0) 0%, 
      hsla(${hue}, 100%, 70%, 0.3) 50%, 
      hsla(${hue}, 100%, 50%, 0) 100%)`;
    
    aurora.appendChild(beam);
  }
  
  site.appendChild(aurora);
}

// Create floating light orbs
function createLightOrbs() {
  const site = document.querySelector('.site');
  if (!site) return;
  
  // Reduce orb count on mobile
  const orbCount = isMobile ? 3 : 5;
  
  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement('div');
    orb.classList.add('light-orb');
    
    // Random size
    const size = Math.random() * 150 + 100;
    orb.style.width = `${size}px`;
    orb.style.height = `${size}px`;
    
    // Random position
    orb.style.left = `${Math.random() * 80 + 10}%`;
    orb.style.top = `${Math.random() * 80 + 10}%`;
    
    // Random color
    const colors = [
      'rgba(141, 2, 227, 0.3)',
      'rgba(0, 157, 255, 0.3)',
      'rgba(185, 0, 214, 0.3)',
      'rgba(255, 62, 127, 0.3)'
    ];
    orb.style.background = `radial-gradient(circle, ${colors[i % colors.length]} 0%, rgba(255, 255, 255, 0) 70%)`;
    
    // Animation
    orb.style.animation = `float ${15 + i * 5}s ease-in-out infinite alternate`;
    orb.style.animationDelay = `${i * 2}s`;
    
    site.appendChild(orb);
  }
}

// Create interactive mouse effect
function createMouseInteractivity() {
  if (isMobile) return; // Skip on mobile devices
  
  const site = document.querySelector('.site');
  if (!site) return;
  
  // Create container for mouse particles
  const particlesContainer = document.createElement('div');
  particlesContainer.style.position = 'fixed';
  particlesContainer.style.top = '0';
  particlesContainer.style.left = '0';
  particlesContainer.style.width = '100%';
  particlesContainer.style.height = '100%';
  particlesContainer.style.pointerEvents = 'none';
  particlesContainer.style.zIndex = '1';
  
  site.appendChild(particlesContainer);
  
  // Track mouse movement
  site.addEventListener('mousemove', (e) => {
    if (isScrolling || Math.random() > 0.3) return; // Limit particle creation
    
    const particle = document.createElement('div');
    particle.classList.add('glow-particle');
    
    // Random size
    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position at mouse
    particle.style.left = `${e.clientX}px`;
    particle.style.top = `${e.clientY}px`;
    
    // Random color
    const colors = [
      'rgba(141, 2, 227, 0.8)',
      'rgba(0, 157, 255, 0.8)',
      'rgba(185, 0, 214, 0.8)',
      'rgba(255, 62, 127, 0.8)'
    ];
    particle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, rgba(255, 255, 255, 0) 70%)`;
    
    particlesContainer.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode === particlesContainer) {
        particle.remove();
      }
    }, 3000);
  });
  
  // Parallax effect on orbs
  site.addEventListener('mousemove', (e) => {
    if (isScrolling || isLowEndDevice) return;
    
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    const orbs = document.querySelectorAll('.light-orb');
    orbs.forEach((orb, index) => {
      const factor = (index + 1) * 20;
      requestAnimationFrame(() => {
        orb.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
      });
    });
  });
}

// Initialize all new background effects
function initEnhancedBackground() {
  createStarfield();
  createShootingStars();
  createAuroraEffect();
  createLightOrbs();
  createMouseInteractivity();
}

// Otimizar imagens
function optimizeImages() {
  // Usar IntersectionObserver para carregar imagens apenas quando visíveis
  if ("IntersectionObserver" in window) {
    const imgObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            const src = img.getAttribute("data-src")

            if (src) {
              img.src = src
              img.removeAttribute("data-src")
            }

            observer.unobserve(img)
          }
        })
      },
      { rootMargin: "50px" },
    )

    // Converter src para data-src para todas as imagens não críticas
    document.querySelectorAll(".carousel-image:not(:first-child)").forEach((img) => {
      const src = img.src
      img.setAttribute("data-src", src)
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'
      imgObserver.observe(img)
    })
  }
}

// Otimizar animações para melhor desempenho
function optimizeAnimations() {
  // Reduzir o número de partículas em dispositivos móveis
  const particlesContainer = document.getElementById("particles")
  if (particlesContainer) {
    const particles = particlesContainer.querySelectorAll(".particle")

    // Manter apenas metade das partículas em dispositivos móveis
    for (let i = 0; i < particles.length; i++) {
      if (i % 2 !== 0) {
        particles[i].style.display = "none"
      }
    }
  }

  // Usar requestAnimationFrame para animações suaves
  if (window.requestAnimationFrame) {
    // Aplicar para animações personalizadas
    const animateElements = document.querySelectorAll(".light-effect")
    animateElements.forEach((el) => {
      el.style.animation = "none"
      animateWithRAF(el)
    })
  }
}

// Animar com requestAnimationFrame para melhor desempenho
function animateWithRAF(element) {
  let start = null
  const duration = 8000 // 8 segundos

  function step(timestamp) {
    if (!start) start = timestamp
    const progress = (timestamp - start) / duration

    if (progress < 1) {
      const opacity = 0.3 + progress * 0.4 // 0.3 a 0.7
      const scale = 1 + progress * 0.2 // 1 a 1.2

      element.style.opacity = opacity
      element.style.transform = `scale(${scale})`

      requestAnimationFrame(step)
    } else {
      start = null
      requestAnimationFrame(step) // Reiniciar a animação
    }
  }

  requestAnimationFrame(step)
}

// Melhorar experiência de toque
function enhanceTouchExperience() {
  // Aumentar áreas de toque para elementos interativos
  const touchTargets = document.querySelectorAll(".carousel-arrow, .indicator, .landing-button")
  touchTargets.forEach((el) => {
    el.style.minHeight = "5px"
    el.style.minWidth = "5px"
  })

  // Adicionar feedback tátil para elementos clicáveis
  document.querySelectorAll(".carousel-arrow, .indicator, .landing-button").forEach((el) => {
    el.addEventListener("touchstart", () => {
      el.style.transform = "scale(0.95)"
    })

    el.addEventListener("touchend", () => {
      el.style.transform = ""
    })

    // Adicionar vibração ao toque se disponível
    el.addEventListener("click", () => {
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    })
  })

  // Remover delay de 300ms em cliques
  document.documentElement.style.touchAction = "manipulation"
}

// Otimizar para conexões lentas
function optimizeForSlowConnections() {
  // Reduzir qualidade de imagens
  document.querySelectorAll("img").forEach((img) => {
    if (img.src.includes(".jpg") || img.src.includes(".jpeg")) {
      img.style.filter = "blur(0.5px)"
    }
  })

  // Desativar algumas animações
  document.querySelectorAll(".emoji, .heart").forEach((el) => {
    el.style.animationPlayState = "paused"
  })
}

// Otimizar para dispositivos de baixo desempenho
function optimizeForLowEndDevices() {
  // Desativar efeitos de sombra complexos
  document.querySelectorAll(".carrossel, .carousel-arrow, #timer, .time-unit").forEach((el) => {
    el.style.boxShadow = "none"
  })

  // Simplificar gradientes
  document.querySelectorAll(".site").forEach((el) => {
    el.style.background = "#8d02e3"
  })

  // Reduzir opacidade de elementos decorativos
  document.querySelectorAll("#emoji-container, .floating-hearts").forEach((el) => {
    el.style.opacity = "0.5"
  })
}

// Adicionar suporte a gestos
function addGestureSupport() {
  const siteContent = document.querySelector(".site-content")
  if (!siteContent) return

  let touchStartY = 0
  let touchEndY = 0

  // Detectar gestos de deslize para navegação
  siteContent.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.changedTouches[0].screenY
    },
    { passive: true },
  )

  siteContent.addEventListener(
    "touchend",
    (e) => {
      touchEndY = e.changedTouches[0].screenY
      handleVerticalSwipe()
    },
    { passive: true },
  )

  function handleVerticalSwipe() {
    const swipeThreshold = 100
    const swipeDistance = touchEndY - touchStartY

    // Swipe para baixo (ir para o footer)
    if (swipeDistance < -swipeThreshold) {
      const footer = document.getElementById("site-footer")
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" })
      }
    }

    // Swipe para cima (ir para o header)
    if (swipeDistance > swipeThreshold) {
      const header = document.getElementById("site-header")
      if (header) {
        header.scrollIntoView({ behavior: "smooth" })
      }
    }
  }
}

// Otimizar experiência de áudio em dispositivos móveis
function optimizeAudio() {
  const audioElement = document.querySelector(".audio")
  if (!audioElement) return

  // Garantir que o áudio não bloqueie a interface
  audioElement.setAttribute("playsinline", "")
  audioElement.setAttribute("preload", "metadata")

  // Adicionar controles de volume adaptados para toque
  audioElement.volume = 0.7 // Volume inicial mais baixo

  // Pausar áudio quando o app estiver em segundo plano
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audioElement.pause()
    }
  })

  // Adicionar suporte a gestos para controle de volume
  let touchStartX = 0
  audioElement.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX
    },
    { passive: true },
  )

  audioElement.addEventListener(
    "touchmove",
    (e) => {
      const touchX = e.touches[0].clientX
      const diff = touchX - touchStartX
      const volumeChange = diff / 100

      let newVolume = audioElement.volume + volumeChange
      newVolume = Math.max(0, Math.min(1, newVolume))

      audioElement.volume = newVolume
      touchStartX = touchX
    },
    { passive: true },
  )
}

// Lidar com orientação do dispositivo
function handleDeviceOrientation() {
  const updateLayout = () => {
    const isLandscape = window.innerWidth > window.innerHeight
    const carouselContainer = document.querySelector(".carrossel-container")
    const timer = document.getElementById("timer")

    if (isLandscape && window.innerHeight < 500) {
      // Layout otimizado para paisagem em telas pequenas
      if (carouselContainer && timer) {
        carouselContainer.style.height = "80vh"
        carouselContainer.style.maxWidth = "50%"
        carouselContainer.style.float = "left"

        timer.style.float = "right"
        timer.style.width = "45%"
        timer.style.marginTop = "10vh"
      }

      // Ajustar header para não ocupar muito espaço
      const header = document.querySelector(".header")
      if (header) {
        header.style.position = "absolute"
        header.style.background = "transparent"
        header.style.boxShadow = "none"
      }
    } else {
      // Restaurar layout normal
      if (carouselContainer) {
        carouselContainer.style.height = ""
        carouselContainer.style.maxWidth = ""
        carouselContainer.style.float = ""
      }

      if (timer) {
        timer.style.float = ""
        timer.style.width = ""
        timer.style.marginTop = ""
      }

      const header = document.querySelector(".header")
      if (header) {
        header.style.position = ""
        header.style.background = ""
        header.style.boxShadow = ""
      }
    }
  }

  // Atualizar layout na carga inicial e quando a orientação mudar
  updateLayout()
  window.addEventListener("resize", updateLayout)
  window.addEventListener("orientationchange", updateLayout)
}

// Configurar suporte a PWA (Progressive Web App)
function setupPWASupport() {
  // Adicionar evento para instalar PWA
  window.addEventListener("beforeinstallprompt", (e) => {
    // Armazenar o evento para uso posterior
    window.deferredPrompt = e
  })
}
// NOVO CÓDIGO - FIM

// Executa a função imediatamente ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar o novo fundo interativo
  initInteractiveBackground()
  
  // Add our new enhanced background
  initEnhancedBackground();
  
  // Iniciar contador com requestAnimationFrame para melhor desempenho
  lastFrameTime = performance.now()
  updateCounterLoop()

  // Inicializar carrossel
  initCarousel()

  // Otimizações para dispositivos móveis
  if (isMobile) {
    // Otimizar carregamento de imagens
    optimizeImages()

    // Melhorar desempenho de animações
    optimizeAnimations()

    // Melhorar experiência de toque
    enhanceTouchExperience()

    // Otimizar para conexões lentas
    if (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType.includes("2g"))) {
      optimizeForSlowConnections()
    }

    // Otimizações para dispositivos de baixo desempenho
    if (isLowEndDevice) {
      optimizeForLowEndDevices()
    }

    // Adicionar suporte a gestos
    addGestureSupport()

    // Melhorar experiência de áudio em dispositivos móveis
    optimizeAudio()

    // Adicionar suporte a orientação do dispositivo
    handleDeviceOrientation()
  }

  // Adicionar suporte a PWA (Progressive Web App)
  setupPWASupport()

  // Detectar scroll para pausar animações pesadas
  window.addEventListener(
    "scroll",
    () => {
      if (!isScrolling) {
        isScrolling = true
        document.body.classList.add("is-scrolling")
      }

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
        document.body.classList.remove("is-scrolling")
      }, 200)
    },
    { passive: true },
  )

  // Reduzir a frequência de emojis em dispositivos móveis
  const emojiInterval = isMobile ? 800 : 500

  // Usar requestAnimationFrame para criar emojis com taxa de quadros controlada
  let lastEmojiTime = 0
  function createEmojiLoop(timestamp) {
    if (timestamp - lastEmojiTime >= emojiInterval) {
      createEmoji()
      lastEmojiTime = timestamp
    }
    requestAnimationFrame(createEmojiLoop)
  }

  // Iniciar loop de criação de emojis
  requestAnimationFrame(createEmojiLoop)
})
