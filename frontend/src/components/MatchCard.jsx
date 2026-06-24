import { Bell, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function formatKickoff(value) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default function MatchCard({ match, onReserve, reserved = false, compact = false }) {
  const score = match.status === 'FINISHED'
    ? `${match.homeScore ?? 0} : ${match.awayScore ?? 0}`
    : 'VS';

  return (
    <article className={`match-card ${compact ? 'compact' : ''}`}>
      <div className="match-meta">
        <span>Group {match.groupName}</span>
        <span>{match.status}</span>
      </div>
      <div className="scoreline">
        <div>
          <span className="flag">{match.homeTeam.flagEmoji}</span>
          <strong>{match.homeTeam.name}</strong>
        </div>
        <b>{score}</b>
        <div>
          <span className="flag">{match.awayTeam.flagEmoji}</span>
          <strong>{match.awayTeam.name}</strong>
        </div>
      </div>
      <p className="headline">{match.headline}</p>
      <div className="match-details">
        <span><Clock size={16} />{formatKickoff(match.kickoffAt)}</span>
        <span><MapPin size={16} />{match.venue.name}</span>
      </div>
      <div className="card-actions">
        <Link to={`/matches/${match.id}`} className="secondary-button">상세</Link>
        {onReserve && match.status !== 'FINISHED' && (
          <button className={reserved ? 'reserved-button' : 'primary-button'} onClick={() => onReserve(match.id)} disabled={reserved}>
            <Bell size={17} />
            {reserved ? '예약됨' : '예약'}
          </button>
        )}
      </div>
    </article>
  );
}
