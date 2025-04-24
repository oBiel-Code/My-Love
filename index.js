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
  
  // Inicializar todos os efeitos quando o DOM estiver carregado
  document.addEventListener("DOMContentLoaded", () => {
    createParticles()
    createFloatingHearts()
    initRotatingMessages()
    buttonClickEffect()
  })
  