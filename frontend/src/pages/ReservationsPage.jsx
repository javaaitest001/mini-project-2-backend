import { useEffect, useState } from 'react';
import { BellOff } from 'lucide-react';
import { api } from '../api/client.js';
import MatchCard from '../components/MatchCard.jsx';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);

  async function load() {
    setReservations(await api.reservations());
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(matchId) {
    await api.cancelReservation(matchId);
    await load();
  }

  return (
    <div className="page-stack">
      <div className="section-heading">
        <span>My Watchlist</span>
        <h1>예약 목록</h1>
      </div>
      {reservations.length === 0 ? (
        <section className="empty-state">
          <BellOff size={34} />
          <h2>예약한 경기가 없습니다</h2>
          <p>경기 일정에서 보고 싶은 경기를 예약해보세요.</p>
        </section>
      ) : (
        <div className="match-list">
          {reservations.map((reservation) => (
            <div className="reservation-row" key={reservation.id}>
              <MatchCard match={reservation.match} compact />
              <button className="secondary-button" onClick={() => cancel(reservation.match.id)}>예약 취소</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
