import { useMemo, useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import { previewTeams } from '../data/previewTeams.js';
import { simulateWorldCup } from '../data/simulateWorldCup.js';

function MatchResult({ match }) {
  return (
    <article className="bracket-match">
      <div className={match.winner?.id === match.home.id ? 'winner' : ''}>
        <span>{match.home.flag} {match.home.name}</span>
        <b>{match.homeGoals}</b>
      </div>
      <div className={match.winner?.id === match.away.id ? 'winner' : ''}>
        <span>{match.away.flag} {match.away.name}</span>
        <b>{match.awayGoals}</b>
      </div>
      {match.method === 'PEN' && <em>승부차기</em>}
    </article>
  );
}

export default function PreviewPage() {
  const [runId, setRunId] = useState(1);
  const result = useMemo(() => simulateWorldCup(previewTeams), [runId]);
  const groupedTeams = useMemo(() => Object.groupBy(previewTeams, (team) => team.group), []);
  const favorites = [...previewTeams].sort((a, b) => b.strength - a.strength).slice(0, 8);

  return (
    <div className="page-stack">
      <section className="preview-hero">
        <div>
          <span className="section-kicker"><Trophy size={18} /> World Cup Preview</span>
          <h1>{result.champion.flag} {result.champion.name}</h1>
          <p>이번 시뮬레이션 우승팀입니다. 전력 점수 기반이라 강팀이 유리하지만, 조별리그와 승부차기에서 이변도 나올 수 있어요.</p>
        </div>
        <button className="primary-button" onClick={() => setRunId((value) => value + 1)}>
          <RotateCcw size={17} />
          다시 돌리기
        </button>
      </section>

      <section className="preview-section">
        <div className="section-heading">
          <span>Power Ranking</span>
          <h2>우승 후보</h2>
        </div>
        <div className="favorite-grid">
          {favorites.map((team, index) => (
            <article className="favorite-card" key={team.id}>
              <b>{index + 1}</b>
              <span className="large-flag">{team.flag}</span>
              <div>
                <strong>{team.name}</strong>
                <span>{team.tier} · {team.strength}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="preview-section">
        <div className="section-heading">
          <span>Groups</span>
          <h2>조별 예상 순위</h2>
        </div>
        <div className="preview-group-grid">
          {Object.entries(result.groups).map(([group, groupResult]) => (
            <article className="preview-group" key={group}>
              <h3>Group {group}</h3>
              {groupResult.rows.map((row, index) => (
                <div className="preview-row" key={row.team.id}>
                  <b>{index + 1}</b>
                  <span>{row.team.flag} {row.team.name}</span>
                  <strong>{row.points}점</strong>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="preview-section">
        <div className="section-heading">
          <span>Knockout</span>
          <h2>토너먼트 예상 결과</h2>
        </div>
        <div className="bracket-board">
          {result.rounds.map((round) => (
            <article className="bracket-round" key={round.name}>
              <h3>{round.name}</h3>
              <div className="bracket-matches">
                {round.matches.map((match) => (
                  <MatchResult key={`${round.name}-${match.home.id}-${match.away.id}`} match={match} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="preview-section">
        <div className="section-heading">
          <span>Teams</span>
          <h2>전체 전력 점수</h2>
        </div>
        <div className="strength-grid">
          {Object.entries(groupedTeams).map(([group, teams]) => (
            <article className="strength-group" key={group}>
              <h3>Group {group}</h3>
              {teams.map((team) => (
                <div className="strength-row" key={team.id}>
                  <span>{team.flag} {team.name}</span>
                  <b>{team.strength}</b>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
