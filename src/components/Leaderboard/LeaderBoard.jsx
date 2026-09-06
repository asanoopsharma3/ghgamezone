import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaAngleDoubleRight,
} from "react-icons/fa";
import "./LeaderBoard.scss";
import { APP_CONFIG } from "../../config/app.config.js";
import { fetchSubscribedPlayers } from "../../services/leaderboardService.js";

const LeaderBoard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    let active = true;
    fetchSubscribedPlayers(APP_CONFIG.leaderboardPackage)
      .then((data) => {
        if (active) setPlayers(data.players || []);
      })
      .catch(() => {
        if (active) setPlayers([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="leaderboard">
      <div className="leaderboard-header">
        <div className="title">
          <FaTrophy className="trophy-icon" />
          <h3>SUBSCRIBED PLAYERS</h3>
        </div>

        <button
          className="icon-btn"
          aria-label="View subscribed players"
          onClick={() => navigate("/leaderboard")}
        >
          <FaAngleDoubleRight />
        </button>
      </div>

      <div className="players-list">
        {players && players.length > 0 ? (
          players.slice(0, 8).map((player) => (
            <div className="player-row" key={`${player.msisdn}-${player.rank}`}>
              <div className="player-info">
                <div className={`rank-badge rank-${player.rank}`}>
                  {player.rank}
                </div>
                <h4 className="player-name">{player.msisdn}</h4>
              </div>
              <span className="player-score">{player.packageName}</span>
            </div>
          ))
        ) : (
          <div className="empty-players-box">
            <p>No subscribed players yet</p>
          </div>
        )}
      </div>

      <button className="leaderboard-btn" onClick={() => navigate("/leaderboard")}>
        VIEW FULL LIST
      </button>
    </section>
  );
};

export default LeaderBoard;
