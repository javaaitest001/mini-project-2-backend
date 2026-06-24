import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function SquadsPage() {
  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    api.teams().then((items) => {
      setTeams(items);
      setSelected(items[0] || null);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      api.players(selected.id).then(setPlayers);
    }
  }, [selected]);

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span>Squads</span>
        <h1>국가별 스쿼드</h1>
      </div>
      <section className="squad-layout">
        <div className="team-rail">
          {teams.map((team) => (
            <button
              key={team.id}
              className={selected?.id === team.id ? 'selected' : ''}
              onClick={() => setSelected(team)}
            >
              <span>{team.flagEmoji}</span>
              {team.name}
            </button>
          ))}
        </div>
        <div className="squad-panel">
          {selected && (
            <>
              <div className="squad-title">
                <span className="large-flag">{selected.flagEmoji}</span>
                <div>
                  <h2>{selected.name}</h2>
                  <p>Group {selected.groupName} · {selected.confederation}</p>
                </div>
              </div>
              <div className="player-list">
                {players.length === 0 && <p className="muted">등록된 선수가 없습니다.</p>}
                {players.map((player) => (
                  <article key={player.id} className="player-row">
                    <b>{player.shirtNumber ?? '-'}</b>
                    <div>
                      <strong>{player.name}</strong>
                      <span>{player.position} · {player.club || 'Club TBA'}</span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
