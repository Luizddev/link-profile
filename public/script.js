// Função para o efeito de soletrar títulos alternados
const titles = ["by lz", "alwards win"];
let titleIndex = 0;
let charIndex = 0;
let typing = true;

function soletrarTitle() {
  const currentTitle = titles[titleIndex];

  if (typing) {
    // Adiciona uma letra
    document.title = currentTitle.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentTitle.length) {
      typing = false;
      setTimeout(soletrarTitle, 1500); // pausa no título completo
    } else {
      setTimeout(soletrarTitle, 250);
    }
  } else {
    // Remove uma letra
    document.title = currentTitle.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      typing = true;
      titleIndex = (titleIndex + 1) % titles.length; // próximo título no loop
      setTimeout(soletrarTitle, 500); // pausa antes de começar a digitar
    } else {
      setTimeout(soletrarTitle, 100);
    }
  }
}

// Aplica VanillaTilt, faz fetch e incrementa contador
document.addEventListener('DOMContentLoaded', () => {
  VanillaTilt.init(document.querySelectorAll('.discord-profile'), {
    glare: true,
    maxGlare: 0.05,
    gyroscope: true,
    scale: 1.02,
    speed: 400,
    max: 15
  });

  // Puxa dados do usuário do backend
  fetch('/discord-user')
    .then(res => res.json())
    .then(data => {
      document.getElementById('avatar').src = data.avatarUrl;
      if (data.bannerUrl) {
        document.getElementById('banner').src = data.bannerUrl;
      } else {
        const banner = document.getElementById('banner');
        if(banner) banner.style.display = 'none';
      }
    });

  // Contador de views
  let count = localStorage.getItem('viewCount');
  if (!count) {
    count = 0;
  } else {
    count = Number(count) + 1;
  }
  document.getElementById('counter').textContent = count;
  localStorage.setItem('viewCount', count);

  // Inicia o efeito do título
  soletrarTitle();
});
