const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); 

const app = express();

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_USER_ID = process.env.DISCORD_USER_ID;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/discord-user', async (req, res) => {
  try {
    const response = await axios.get(`https://discord.com/api/v10/users/${DISCORD_USER_ID}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    });

    const user = response.data;

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    const bannerUrl = user.banner
      ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024`
      : null;

    res.json({ username: user.username, avatarUrl, bannerUrl });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar usuário do Discord' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
