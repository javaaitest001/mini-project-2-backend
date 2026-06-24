import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { api } from '../api/client.js';
import MatchCard from '../components/MatchCard.jsx';
import { useAuth } from '../main.jsx';

export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [reservedIds, setReservedIds] = useState([]);
  const { session } = useAuth();

  useEffect(() => {
    api.upcoming().then(setMatches);
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
      <section className="hero-news">
        <div>
          <span className="section-kicker"><Trophy size={18} /> 2026 Match Center</span>
          <h1>오늘 볼 경기와 내 팀 소식을 한 화면에서.</h1>
          <p>조별 순위, 일정, 스쿼드, 시청 예약을 빠르게 확인하는 월드컵 시즌 대시보드입니다.</p>
        </div>
      </section>
      <section className="content-band">
        <div className="section-heading">
          <span>Upcoming</span>
          <h2>다가오는 경기</h2>
        </div>
        <div className="match-grid">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} onReserve={reserve} reserved={reservedIds.includes(match.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
