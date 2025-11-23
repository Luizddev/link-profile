const DISCORD_ID = '1167948636437622797';
        const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

        // Criar neve
        function createStars() {
            const starsContainer = document.getElementById('stars');
            const snowCount = 80;
            
            for (let i = 0; i < snowCount; i++) {
                const snow = document.createElement('div');
                snow.className = 'star';
                snow.style.left = Math.random() * 100 + '%';
                snow.style.width = (Math.random() * 6 + 3) + 'px';
                snow.style.height = snow.style.width;
                snow.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
                snow.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(snow);
            }
        }
        function getBadges(flags, premiumType) {
            const badges = [];
            
            if (flags & (1 << 0)) badges.push({ name: 'Staff', url: badgeUrls.staff });
            if (flags & (1 << 1)) badges.push({ name: 'Partner', url: badgeUrls.partner });
            if (flags & (1 << 2)) badges.push({ name: 'HypeSquad Events', url: badgeUrls.hypesquad });
            if (flags & (1 << 3)) badges.push({ name: 'Bug Hunter Level 1', url: badgeUrls.bug_hunter_level_1 });
            if (flags & (1 << 6)) badges.push({ name: 'HypeSquad Bravery', url: badgeUrls.hypesquad_bravery });
            if (flags & (1 << 7)) badges.push({ name: 'HypeSquad Brilliance', url: badgeUrls.hypesquad_brilliance });
            if (flags & (1 << 8)) badges.push({ name: 'HypeSquad Balance', url: badgeUrls.hypesquad_balance });
            if (flags & (1 << 9)) badges.push({ name: 'Early Supporter', url: badgeUrls.early_supporter });
            if (flags & (1 << 14)) badges.push({ name: 'Bug Hunter Level 2', url: badgeUrls.bug_hunter_level_2 });
            if (flags & (1 << 17)) badges.push({ name: 'Verified Bot Developer', url: badgeUrls.verified_developer });
            if (flags & (1 << 22)) badges.push({ name: 'Active Developer', url: badgeUrls.active_developer });
            
            if (premiumType === 1 || premiumType === 2) {
                badges.push({ name: 'Nitro', url: badgeUrls.nitro });
            }
            
            return badges;
        }

        // Efeito 3D com mouse
        function add3DEffect() {
            const cards = document.querySelectorAll('.profile-card');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                });
            });
        }

        async function fetchProfile() {
            try {
                const response = await fetch(LANYARD_API);
                const data = await response.json();
                
                if (!data.success) {
                    throw new Error('Falha ao buscar dados');
                }
                
                renderProfile(data.data);
            } catch (error) {
                document.getElementById('profilesGrid').innerHTML = `
                    <div class="profile-card">
                        <div style="color: #888;">
                            <p>Erro ao carregar perfil</p>
                            <p style="font-size: 14px; margin-top: 10px;">Entre no servidor do Lanyard para usar este site</p>
                        </div>
                    </div>
                `;
            }
        }

        function renderProfile(data) {
            const user = data.discord_user;
            const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`;
            const badges = getBadges(user.public_flags || 0, data.premium_type);
            
            let activitiesHTML = '';
            
            if (data.spotify) {
                const spotify = data.spotify;
                activitiesHTML += `
                    <div class="activity-section">
                        <div class="activity-title">Ouvindo no Spotify</div>
                        <div class="activity-item spotify">
                            <img src="${spotify.album_art_url}" alt="Album" class="activity-image">
                            <div class="activity-details">
                                <div class="activity-name">${spotify.song}</div>
                                <div class="activity-state">${spotify.artist}</div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (data.activities && data.activities.length > 0) {
                const gameActivities = data.activities.filter(a => a.type === 0);
                if (gameActivities.length > 0 && !activitiesHTML) {
                    activitiesHTML = '<div class="activity-section"><div class="activity-title">Jogando</div>';
                    gameActivities.forEach(activity => {
                        const imageUrl = activity.assets?.large_image 
                            ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                            : '';
                        
                        activitiesHTML += `
                            <div class="activity-item">
                                ${imageUrl ? `<img src="${imageUrl}" alt="${activity.name}" class="activity-image">` : ''}
                                <div class="activity-details">
                                    <div class="activity-name">${activity.name}</div>
                                    ${activity.details ? `<div class="activity-state">${activity.details}</div>` : ''}
                                </div>
                            </div>
                        `;
                    });
                    activitiesHTML += '</div>';
                }
            }
            
                    document.getElementById('profilesGrid').innerHTML = `
                        <div class="profile-card">
                            <a href="https://discord.com/users/${user.id}" target="_blank" style="text-decoration: none;">
                        <div class="avatar-wrapper">
                            <img src="${avatarUrl}" alt="Avatar" class="avatar" title="Clique para ir para o profile.">
                            <div class="status-indicator status-${data.discord_status}"></div>
                        </div>
                    </a>
                    <div class="username">${user.global_name || user.username}</div>
                    <div class="user-handle">@${user.username}</div>
                    <div class="subscription-badges">
                        <img src="https://cdn3.emoji.gg/emojis/30854-nitro-bronze.png" alt="Nitro" class="subscription-badge" title="Assinante desde 8 de nov. de 2025">
                        <img src="https://cdn3.emoji.gg/emojis/4390-evolving-badge-nitro-1-months.png" alt="Boost" class="subscription-badge" title="Boost Nível 1">
                    </div>
                    ${badges.length > 0 ? `
                        <div class="badges">
                            
                            ${badges.map(badge => `<img src="${badge.url}" alt="${badge.name}" class="badge" title="${badge.name}">`).join('')}
                        </div>
                    ` : ''}
                    ${activitiesHTML}
                    <div class="social-links">
                        <a href="https://steamcommunity.com/id/167g/" target="_blank" class="social-link steam" title="why? untils">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
                            </svg>
                        </a>
                        <a href="https://br.pinterest.com/82g3/" target="_blank" class="social-link pinterest" title="82g3">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
            
            add3DEffect();
        }

        // Controle de música
        const musicControl = document.getElementById('musicControl');
        const bgMusic = document.getElementById('bgMusic');
        let isPlaying = false;

        musicControl.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                document.getElementById('volumeIcon').innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
            } else {
                bgMusic.play();
                document.getElementById('volumeIcon').innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
            }
            isPlaying = !isPlaying;
        });

        // Inicializar quando a página carregar
        document.addEventListener('DOMContentLoaded', () => {
            createStars();
            fetchProfile();
        });

        // Bloquear teclas de desenvolvedor
document.addEventListener('keydown', function(e) {
  // F12
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    return false;
  }
  
  // Ctrl+Shift+I (Inspector)
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    return false;
  }
  
  // Ctrl+Shift+J (Console)
  if (e.ctrlKey && e.shiftKey && e.key === 'J') {
    e.preventDefault();
    return false;
  }
  
  // Ctrl+Shift+C (Seletor de elementos)
  if (e.ctrlKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    return false;
  }
  
  // Ctrl+U (Ver código-fonte)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    return false;
  }
  
  // Insert
  if (e.key === 'Insert' || e.keyCode === 45) {
    e.preventDefault();
    return false;
  }
});

// Bloquear clique direito (menu de contexto)
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// Detectar se DevTools está aberto (método 1 - diferença de tamanho)
let devtoolsOpen = false;
const threshold = 160;

setInterval(function() {
  if (window.outerWidth - window.innerWidth > threshold || 
      window.outerHeight - window.innerHeight > threshold) {
    if (!devtoolsOpen) {
      devtoolsOpen = true;
      // Redirecionar ou mostrar aviso
      document.body.innerHTML = '<h1 style="text-align:center; margin-top:20%; color:red;">Acesso às ferramentas de desenvolvedor não permitido!</h1>';
    }
  } else {
    devtoolsOpen = false;
  }
}, 500);

// Detectar se DevTools está aberto (método 2 - debugger)
setInterval(function() {
  const before = new Date();
  debugger;
  const after = new Date();
  if (after - before > 100) {
    document.body.innerHTML = '<h1 style="text-align:center; margin-top:20%; color:red;">Acesso às ferramentas de desenvolvedor não permitido!</h1>';
  }
}, 1000);

// Desabilitar seleção de texto
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
  return false;
});

// Desabilitar arrastar elementos
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
  return false;
});

console.log('Sistema de proteção ativado');
