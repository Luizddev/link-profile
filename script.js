// Inicializa o efeito tilt
VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
  max: 8, 
  speed: 400, 
  glare: true, 
  "max-glare": 0.15,
  perspective: 1000
});

// Sistema de música
const audio = document.getElementById('custom-audio');
audio.volume = 0.1; // Volume inicial
const pauseBtn = document.getElementById('pause-btn');
const pauseIcon = document.getElementById('pause-icon');
const volumeControl = document.getElementById('volume-control');
const playIcon = document.getElementById('play-icon');
const notification = document.getElementById('music-notification');

let isPlaying = false;
// Função para mostrar notificação
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Função para atualizar o botão
function updatePauseBtn() {
  if (isPlaying) {
    pauseIcon.style.display = 'block';
    playIcon.style.display = 'none';
    pauseBtn.title = 'Pausar música';
  } else {
    pauseIcon.style.display = 'none';
    playIcon.style.display = 'block';
    pauseBtn.title = 'Tocar música';
  }
}

// Event listener para o botão
pauseBtn.addEventListener('click', async function() {
  try {
    if (audio.paused) {
      await audio.play();
      showNotification('♪ Música iniciada');
    } else {
      audio.pause();
      showNotification('⏸️ Música pausada');
    }
  } catch (error) {
    console.error('Erro ao tocar música:', error);
    showNotification('❌ Erro ao tocar música');
  }
});

// Event listeners do áudio
audio.addEventListener('play', function() {
  isPlaying = true;
  updatePauseBtn();
});

audio.addEventListener('pause', function() {
  isPlaying = false;
  updatePauseBtn();
});

audio.addEventListener('ended', function() {
  isPlaying = false;
  updatePauseBtn();
  showNotification('🎵 Música finalizada');
});

audio.addEventListener('error', function(e) {
  console.error('Erro no áudio:', e);
  showNotification('❌ Erro ao carregar música');
});

audio.addEventListener('loadstart', function() {
  console.log('Carregando música...');
});

audio.addEventListener('canplay', function() {
  console.log('Música pronta para tocar');
});

// Configuração do perfil Discord
const DISCORD_ID = "1167948636437622797";
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

// Sistema de views (usando variável em memória)
let viewCount = 7210;

function getViews() {
  return viewCount;
}

function incrementViews() {
  viewCount += Math.floor(Math.random() * 3) + 1;
  return viewCount;
}

// Mapeamento de cores de status
const STATUS_COLORS = {
  online: '#43b581',
  idle: '#faa61a', 
  dnd: '#f04747',
  offline: '#747f8d'
};

async function updateViews() {
  try {
    const views = incrementViews();
    document.getElementById("views").innerHTML = `
      <svg class="view-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
      ${views.toLocaleString()} views
    `;
  } catch (error) {
    console.error("Erro ao atualizar views:", error);
    document.getElementById("views").innerHTML = `
      <svg class="view-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
      7210+ views
    `;
  }
}

async function updateProfile() {
  try {
    const response = await fetch(LANYARD_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const { data, success } = await response.json();
    
    if (!success) {
      throw new Error("API retornou erro");
    }

    // Atualiza avatar
    const avatarUrl = data.discord_user.avatar 
      ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${data.discord_user.discriminator % 5}.png`;
    
    document.getElementById("avatar").src = avatarUrl;

    // Atualiza status
    const statusColor = STATUS_COLORS[data.discord_status] || STATUS_COLORS.offline;
    document.getElementById("status-dot").style.background = statusColor;
    document.getElementById("avatar").style.borderColor = statusColor;

    // Atualiza informações do usuário
    const displayName = data.discord_user.global_name || data.discord_user.username;
    document.getElementById("name").textContent = displayName;
    document.getElementById("username").textContent = `@${data.discord_user.username}`;

    // Atualiza atividade
    updateActivity(data);

    // Atualiza botão de mensagem
    document.getElementById("message-btn").onclick = () => {
      window.open(`https://discord.com/users/${DISCORD_ID}`, '_blank');
    };

  } catch (error) {
    console.error("Erro ao buscar dados do perfil:", error);
    document.getElementById("name").innerHTML = `
      <div class="error">
        Erro ao carregar perfil
      </div>
    `;
  }
}

// Função para obter ícone da atividade
function getActivityIcon(activityName) {
  const icons = {
    'Visual Studio Code': 'https://code.visualstudio.com/favicon.ico',
    'Discord': 'https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico',
    'Google Chrome': 'https://www.google.com/chrome/static/images/chrome-logo.svg',
    'Spotify': 'https://open.spotify.com/favicon.ico',
    'YouTube': 'https://www.youtube.com/favicon.ico',
    'GitHub': 'https://github.com/favicon.ico',
    'Steam': 'https://store.steampowered.com/favicon.ico',
    'Figma': 'https://static.figma.com/app/icon/1/favicon.ico',
    'Photoshop': 'https://www.adobe.com/content/dam/cc/icons/photoshop.svg',
    'Illustrator': 'https://www.adobe.com/content/dam/cc/icons/illustrator.svg',
    
    // Jogos populares
    'FiveM': 'https://fivem.net/favicon.ico',
    'VALORANT': 'https://playvalorant.com/favicon.ico',
    'Counter-Strike 2': 'https://www.counter-strike.net/favicon.ico',
    'CS2': 'https://www.counter-strike.net/favicon.ico',
    'Elden Ring': 'https://www.fromsoftware.jp/favicon.ico',
    'Aim Lab': 'https://aimlab.gg/favicon.ico',
    'Roblox': 'https://www.roblox.com/favicon.ico',
    'Minecraft': 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon.ico',
    'Fortnite': 'https://www.epicgames.com/fortnite/favicon.ico',
    'Warzone': 'https://www.callofduty.com/favicon.ico',
    'Grand Theft Auto V': 'https://www.rockstargames.com/favicon.ico'
  };
  
  // Retorna ícone específico ou ícone genérico
  return icons[activityName] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzVGNjM2OCIvPgo8cGF0aCBkPSJNMzIgMjBWNDQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMCAzMkg0NCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
}

function updateActivity(data) {
  const div = document.getElementById("activity");
  const no = document.getElementById("no-activity");
  const album = document.getElementById("album");
  const type = document.getElementById("activity-type");
  const details = document.getElementById("activity-details");
  const progress = document.getElementById("progress");

  // Mostrar custom_status se existir
  const custom = data.activities?.find(a => a.type === 4 && a.state);
  if (custom) {
    div.style.display = 'flex';
    no.style.display = 'none';
    // Usar ícone de emoji ou ícone genérico para custom status
    album.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzQyNzNEQyIvPgo8dGV4dCB4PSIzMiIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+💬PC90ZXh0Pgo8L3N2Zz4=';
    type.textContent = '💬 Custom Status';
    details.textContent = custom.state;
    progress.style.width = '0%';
    return;
  }

  // Mostrar Spotify se estiver ouvindo
  if (data.listening_to_spotify && data.spotify) {
    const s = data.spotify;
    div.style.display = 'flex';
    no.style.display = 'none';
    album.src = s.album_art_url;
    type.textContent = "🎵 Spotify";
    details.textContent = `${s.song} • ${s.artist}`;

    // Calcular progresso da música
    const start = s.timestamps.start;
    const end = s.timestamps.end;
    const now = Date.now();
    const total = end - start;
    const current = now - start;
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    progress.style.width = percentage + "%";
    return;
  }

  // Mostrar outra atividade
  const activity = data.activities?.find(a => a.type !== 4);
  if (activity) {
    div.style.display = 'flex';
    no.style.display = 'none';
    
    // Usar ícone específico da aplicação ou ícone genérico
    const activityIcon = getActivityIcon(activity.name);
    album.src = activityIcon;
    
    type.textContent = `🎮 ${activity.name}`;
    details.textContent = activity.state || activity.details || "Atividade em andamento";
    progress.style.width = '0%';
    return;
  }

  // Nenhuma atividade
  div.style.display = 'none';
  no.style.display = 'block';
}

// Inicialização
async function init() {
  // Atualiza estado inicial do botão
  updatePauseBtn();
  
  const clickOverlay = document.getElementById("click-overlay");

  clickOverlay.addEventListener("click", async () => {
    clickOverlay.style.display = "none";
    try {
      await audio.play();
      showNotification('🎵 Música iniciada');
    } catch (error) {
      console.error("Erro ao tocar música:", error);
      showNotification('❌ Erro ao tocar música');
    }
  });

  // Incrementa views ao carregar a página
  await updateViews();
  await updateProfile();
  
  // Atualiza dados a cada 3 segundos
  setInterval(async () => {
    await updateProfile();
  }, 3000);
}

// Inicia quando a página carrega
document.addEventListener('DOMContentLoaded', init);

// Previne ações de inspeção e cópia
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
  if (
    e.key === "F12" || // DevTools
    (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) || // Ctrl+Shift+I/C/J
    (e.ctrlKey && e.key === "U") // Ctrl+U (ver código-fonte)
  ) {
    e.preventDefault();
  }
});

const socket = new WebSocket("wss://api.lanyard.rest/socket");

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({
    op: 2,
    d: { subscribe_to_id: "1167948636437622797" } // seu ID Discord
  }));
});

socket.addEventListener("message", (event) => {
  const payload = JSON.parse(event.data);
  const data = payload.d;

  if (payload.op === 0 && data) {
    updateActivity(data);
  }
});