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

// Otimizar carregamento de imagens
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

// Executa a função imediatamente ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
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
