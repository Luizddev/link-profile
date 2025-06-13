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

    function updateActivity(data) {
      const activityDiv = document.getElementById("activity");
      const noActivityDiv = document.getElementById("no-activity");
      
      // Verifica Spotify
      if (data.listening_to_spotify && data.spotify) {
        activityDiv.style.display = 'flex';
        noActivityDiv.style.display = 'none';
        
        document.getElementById("album").src = data.spotify.album_art_url || '';
        document.getElementById("activity-type").textContent = "Spotify";
        document.getElementById("activity-details").textContent = `${data.spotify.song} • ${data.spotify.artist}`;

        // Calcula progresso
        if (data.spotify.timestamps) {
          const start = data.spotify.timestamps.start;
          const end = data.spotify.timestamps.end;
          const now = Date.now();
          const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
          document.getElementById("progress").style.width = `${progress}%`;
        }
        
        return;
      }
      
      // Verifica outras atividades
      if (data.activities && data.activities.length > 0) {
        const activity = data.activities[0];
        activityDiv.style.display = 'flex';
        noActivityDiv.style.display = 'none';
        
        document.getElementById("album").src = activity.assets?.large_image 
          ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
          : '';
        document.getElementById("activity-type").textContent = activity.name || 'Atividade';
        document.getElementById("activity-details").textContent = activity.details || activity.state || 'Em atividade';
        document.getElementById("progress").style.width = '0%';
        
        return;
      }
      
      // Nenhuma atividade
      activityDiv.style.display = 'none';
      noActivityDiv.style.display = 'block';
    }

    // Inicialização
    async function init() {
      // Atualiza estado inicial do botão
      updatePauseBtn();
      
      // Tenta iniciar a música automaticamente
      try {
        await audio.play();
        showNotification('🎵 Música iniciada automaticamente');
      } catch (error) {
        console.log('Autoplay bloqueado pelo navegador:', error);
        // Alguns navegadores bloqueiam autoplay, então não mostramos erro
      }
      
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
    // Volume slider
    volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value;
    });
    audio.volume = volumeControl.value;


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
  