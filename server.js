import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Прокси сервер работает!");
});

app.get("/details/:appid", async (req, res) => {
  const { appid } = req.params;
  console.log(`📥 Запрос для игры: ${appid}`);

  try {
    // Запрос информации об игре
    const gameResponse = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const gameData = await gameResponse.json();
    const game = gameData[appid];

    if (!game || !game.success) {
      console.log(`❌ Игра ${appid} не найдена`);
      return res.json({
        appid,
        name: `Игра ${appid} недоступна`,
        header_image: null,
        players: null
      });
    }

    // Запрос количества игроков онлайн
    let players = null;
    try {
      const playersResponse = await fetch(
        `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`
      );
      const playersData = await playersResponse.json();
      players = playersData.response?.player_count || null;
    } catch (err) {
      console.log(`⚠️ Не удалось получить онлайн для ${appid}`);
    }

    console.log(`✅ Игра найдена: ${game.data.name} (Онлайн: ${players || 'N/A'})`);
    
    res.json({
      appid,
      name: game.data.name,
      header_image: game.data.header_image,
      players: players
    });

  } catch (err) {
    console.error(`💥 Ошибка:`, err.message);
    res.status(500).json({
      appid,
      name: `Ошибка загрузки`,
      header_image: null,
      players: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Сервер запущен!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🎮 Тест: http://localhost:${PORT}/details/730\n`);
});