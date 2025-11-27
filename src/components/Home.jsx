import React from "react";
import getSteamGames from "../api/steam";
import { useEffect,useState } from "react";

const Home = () =>{
    const [games , setGames] = useState([])
    
    useEffect(() => {
        async function fetchGames(){
            const data = await getSteamGames()
            setGames(data)
        }
        fetchGames()
    }, []);

    return(
        <>
            <div>
                <h1>MetaStats — Игровые тренды</h1>
                <p>Игры с самым большим онлайном</p>
            
                {games.map((game) => (
                    <div key={game.id}>
                        <h2>{game.name}</h2>
                        <h3>{game.online}</h3>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Home;