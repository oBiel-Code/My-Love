// Define a data de início do contador: 28 de março de 2025, 00:00:00
const startDate = new Date(2024, 2, 29, 0, 0, 0); // (mês 2 = março, pois janeiro é 0)

// Define a função que atualiza o contador na tela
function updateCounter() {
    // Pega a data e hora atual
    const now = new Date();

    // Calcula quantos segundos se passaram desde a data de início
    const secondsPassed = Math.floor((now - startDate) / 1000);

    // Se a data atual for antes da data de início, mostra mensagem e sai da função
    if (secondsPassed < 0) {
        document.getElementById("timer").innerHTML = "Ainda não começou!";
        return;
    }

    // Calcula quantos dias inteiros se passaram
    const days = Math.floor(secondsPassed / (60 * 60 * 24));

    // Calcula quantas horas restam após remover os dias completos
    const hours = Math.floor((secondsPassed % (60 * 60 * 24)) / (60 * 60));

    // Calcula quantos minutos restam após remover as horas completas
    const minutes = Math.floor((secondsPassed % (60 * 60)) / 60);

    // Calcula os segundos restantes após remover os minutos completos
    const seconds = secondsPassed % 60;

    // Atualiza o conteúdo HTML dos elementos com os valores calculados
    document.getElementById("days").textContent = String(days).padStart(3, '0');
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
}

// Chama a função updateCounter a cada 1 segundo (1000 milissegundos)
setInterval(updateCounter, 1000);

// Executa a função imediatamente ao carregar a página
updateCounter();

const imgs = document.getElementById("img");
const img = document.querySelectorAll("#img img")

let idx = 0;

function carrossel(){
    idx++;
    if (idx > img.length - 1){
        idx = 0;
    }

    imgs.style.transform = `translateX(${-idx * 200}px)`;
}

setInterval(carrossel, 2000);

function createEmoji() {
    const emojiList = ['🎉', '💖', '🖤', '💙', '💜', '🤍', '💖'];
    const emoji = document.createElement('div');
    emoji.innerText = emojiList[Math.floor(Math.random() * emojiList.length)];
    emoji.classList.add('emoji');

    emoji.style.left = Math.random() * 100 + 'vw';

    emoji.style.animationDuration = (Math.random() * 2 + 3) + 's';

    document.getElementById('emoji-container').appendChild(emoji);

    setTimeout(() => {
        emoji.remove();
    }, 5000);
}

setInterval(createEmoji, 200);
