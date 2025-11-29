import { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  // Массив загруженных игр
  const [games, setGames] = useState([]);

  // ID игр для загрузки
  const gameIds = [730, 570, 578080, 1808500, 2507950, 1172470, 3564740, 431960, 2807960, 3419430];

  // Загрузка игр с бэкенда
  const fetchGames = async () => {
    const results = [];

    for (const appid of gameIds) {
      try {
        const res = await fetch(`http://localhost:5000/details/${appid}`);
        
        if (!res.ok) continue;

        const data = await res.json();
        
        if (data.name && !data.name.includes("недоступна")) {
          results.push(data);
        }
      } catch (err) {
        // Игнорируем ошибки
      }
    }

    setGames(results);
  };

  // Загружаем игры при первом рендере
  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="main">
      <h1 className="main-text">Топ-10 игр Steam</h1>
      
      <div className="games-grid">
        {games.map((game) => (
          <div key={game.appid} className="game-card">
            {game.header_image && (
              <img 
                src={game.header_image} 
                alt={game.name} 
                className="game-image"
              />
            )}
            <h3 className="game-title">{game.name}</h3>
            
            {game.players !== null && (
              <div className="players-info">
                <span className="players-count">{game.players}</span>
                <span className="players-label"> игроков онлайн</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;