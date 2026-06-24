import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    api.standings().then(setStandings);
  }, []);

  const groups = useMemo(() => standings.reduce((acc, item) => {
    acc[item.groupName] = [...(acc[item.groupName] || []), item];
    return acc;
  }, {}), [standings]);

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span>Tables</span>
        <h1>조별 순위</h1>
      </div>
      <div className="standings-grid">
        {Object.entries(groups).map(([groupName, rows]) => (
          <section className="table-panel" key={groupName}>
            <h2>Group {groupName}</h2>
            <table>
              <thead>
                <tr>
                  <th>팀</th>
                  <th>경기</th>
                  <th>승</th>
                  <th>무</th>
                  <th>패</th>
                  <th>득실</th>
                  <th>승점</th>
                </tr>
              </thead>
              <tbody>
                {[...rows].sort((a, b) => b.points - a.points).map((row) => (
                  <tr key={row.id}>
                    <td><span className="flag">{row.team.flagEmoji}</span>{row.team.name}</td>
                    <td>{row.played}</td>
                    <td>{row.wins}</td>
                    <td>{row.draws}</td>
                    <td>{row.losses}</td>
                    <td>{row.goalsFor - row.goalsAgainst}</td>
                    <td><strong>{row.points}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </div>
  );
}
