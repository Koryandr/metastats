import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/details/:appid", async (req, res) => {
  const { appid } = req.params;

  try {
    const gameResponse = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const gameData = await gameResponse.json();
    const game = gameData[appid];

    if (!game || !game.success) {
      return res.json({
        appid,
        name: `Игра ${appid} недоступна`,
        header_image: null,
        players: null
      });
    }

    let players = null;
    try {
      const playersResponse = await fetch(
        `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`
      );
      const playersData = await playersResponse.json();
      players = playersData.response?.player_count || null;
    } catch (err) {
      // Игнорируем ошибку получения онлайна
    }
    
    res.json({
      appid,
      name: game.data.name,
      header_image: game.data.header_image,
      players: players
    });

  } catch (err) {
    res.status(500).json({
      appid,
      name: `Ошибка загрузки`,
      header_image: null,
      players: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});