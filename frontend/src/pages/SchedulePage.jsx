import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import MatchCard from '../components/MatchCard.jsx';
import { useAuth } from '../main.jsx';

export default function SchedulePage() {
  const [matches, setMatches] = useState([]);
  const [reservedIds, setReservedIds] = useState([]);
  const { session } = useAuth();

  useEffect(() => {
    api.matches().then(setMatches);
    if (session) {
      api.reservations().then((items) => setReservedIds(items.map((item) => item.match.id)));
    } else {
      setReservedIds([]);
    }
  }, [session]);

  async function reserve(matchId) {
    if (!session) {
      window.location.href = '/login';
      return;
    }
    await api.reserve(matchId);
    setReservedIds((ids) => [...new Set([...ids, matchId])]);
  }

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span>Fixtures</span>
        <h1>경기 일정</h1>
      </div>
      <div className="match-list">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} onReserve={reserve} reserved={reservedIds.includes(match.id)} compact />
        ))}
      </div>
    </div>
  );
}
