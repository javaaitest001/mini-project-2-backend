import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bell, MapPin } from 'lucide-react';
import { api } from '../api/client.js';
import { formatKickoff } from '../components/MatchCard.jsx';
import { useAuth } from '../main.jsx';

export default function MatchDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [reserved, setReserved] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    api.match(id).then(setMatch);
    if (session) {
      api.reservations().then((items) => setReserved(items.some((item) => String(item.match.id) === String(id))));
    } else {
      setReserved(false);
    }
  }, [id, session]);

  if (!match) {
    return <div className="loading">불러오는 중...</div>;
  }

  async function reserve() {
    if (!session) {
      window.location.href = '/login';
      return;
    }
    await api.reserve(match.id);
    setReserved(true);
  }

  return (
    <div className="page-stack">
      <section className="detail-header">
        <span>Group {match.groupName} · {match.status}</span>
        <h1>{match.homeTeam.name} vs {match.awayTeam.name}</h1>
        <p>{match.headline}</p>
      </section>
      <section className="detail-score">
        <div>
          <span className="large-flag">{match.homeTeam.flagEmoji}</span>
          <h2>{match.homeTeam.name}</h2>
        </div>
        <strong>{match.status === 'FINISHED' ? `${match.homeScore} : ${match.awayScore}` : 'VS'}</strong>
        <div>
          <span className="large-flag">{match.awayTeam.flagEmoji}</span>
          <h2>{match.awayTeam.name}</h2>
        </div>
      </section>
      <section className="info-strip">
        <span>{formatKickoff(match.kickoffAt)}</span>
        <span><MapPin size={18} />{match.venue.name}, {match.venue.city}</span>
        {match.status !== 'FINISHED' && (
          <button className={reserved ? 'reserved-button' : 'primary-button'} onClick={reserve} disabled={reserved}>
            <Bell size={17} />
            {reserved ? '예약됨' : '시청 예약'}
          </button>
        )}
      </section>
    </div>
  );
}
