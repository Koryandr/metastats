import { useEffect, useState } from "react";

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gameIds = [730, 570, 578080, 1808500, 2507950, 1172470, 3564740, 431960, 2807960, 3419430];

  const fetchGames = async () => {
    console.log("🔄 Начинаем загрузку игр...");
    setLoading(true);
    setError(null);
    const results = [];

    for (const appid of gameIds) {
      try {
        console.log(`📡 Запрос: http://localhost:5000/details/${appid}`);
        const res = await fetch(`http://localhost:5000/details/${appid}`);
        
        if (!res.ok) {
          console.warn(`⚠️ Игра ${appid}: статус ${res.status}`);
          continue;
        }

        const data = await res.json();
        console.log(`✅ Данные для ${appid}:`, data);
        
        if (data.name && !data.name.includes("недоступна")) {
          results.push(data);
        }
      } catch (err) {
        console.error(`❌ Ошибка для ${appid}:`, err);
        setError(err.message);
      }
    }

    console.log(`🎮 Всего загружено игр: ${results.length}`);
    setGames(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const formatPlayers = (count) => {
    if (!count) return "N/A";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#1a1a2e", minHeight: "100vh" }}>
      <h1 style={{ color: "#fff", textAlign: "center" }}>🎮 Топ-10 игр Steam</h1>
      
      {loading && <p style={{ color: "#fff", textAlign: "center" }}>⏳ Загрузка игр...</p>}
      
      {error && <p style={{ color: "red", textAlign: "center" }}>❌ Ошибка: {error}</p>}
      
      {!loading && games.length === 0 && (
        <p style={{ color: "orange", textAlign: "center" }}>
          😔 Игры не загрузились. Проверь консоль (F12).
        </p>
      )}
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "20px", 
        marginTop: "30px",
        maxWidth: "1400px",
        margin: "30px auto"
      }}>
        {games.map((game) => (
          <div 
            key={game.appid} 
            style={{ 
              border: "1px solid #333", 
              padding: "15px", 
              borderRadius: "12px",
              backgroundColor: "#16213e",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              transition: "transform 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {game.header_image && (
              <img 
                src={game.header_image} 
                alt={game.name} 
                style={{ 
                  width: "100%", 
                  borderRadius: "8px", 
                  marginBottom: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }} 
              />
            )}
            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#fff" }}>
              {game.name}
            </h3>
            
            {game.players !== null && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                backgroundColor: "#0f3460",
                borderRadius: "6px"
              }}>
                <span style={{ fontSize: "20px" }}>👥</span>
                <span style={{ color: "#4ecca3", fontWeight: "bold", fontSize: "16px" }}>
                  {formatPlayers(game.players)}
                </span>
                <span style={{ color: "#aaa", fontSize: "12px" }}>игроков онлайн</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;