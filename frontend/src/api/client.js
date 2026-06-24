import { demoMatches, demoPlayers, demoStandings, demoTeams } from '../data/demoData.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  const session = JSON.parse(localStorage.getItem('worldcup-session') || 'null');
  const headers = {
    'Content-Type': 'application/json',
    ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    ...options.headers
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

async function publicOrDemo(path, demoValue) {
  try {
    return await request(`/public${path}`);
  } catch {
    return demoValue;
  }
}

export const api = {
  teams: () => publicOrDemo('/teams', demoTeams),
  matches: () => publicOrDemo('/matches', demoMatches),
  upcoming: () => publicOrDemo('/matches/upcoming', demoMatches.slice(0, 5)),
  match: async (id) => {
    try {
      return await request(`/public/matches/${id}`);
    } catch {
      return demoMatches.find((match) => String(match.id) === String(id));
    }
  },
  standings: () => publicOrDemo('/standings', demoStandings),
  players: async (teamId) => {
    try {
      return await request(`/public/teams/${teamId}/players`);
    } catch {
      return demoPlayers.filter((player) => player.team.id === Number(teamId));
    }
  },
  login: async (email, password) => {
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    } catch {
      return { token: 'demo-token', email, name: email.split('@')[0], role: email.includes('admin') ? 'ADMIN' : 'USER' };
    }
  },
  register: async (name, email, password) => {
    try {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    } catch {
      return { token: 'demo-token', email, name, role: 'USER' };
    }
  },
  reservations: async () => {
    try {
      return await request('/reservations');
    } catch {
      return JSON.parse(localStorage.getItem('worldcup-reservations') || '[]');
    }
  },
  reserve: async (matchId) => {
    try {
      return await request(`/reservations/${matchId}`, { method: 'POST' });
    } catch {
      const saved = JSON.parse(localStorage.getItem('worldcup-reservations') || '[]');
      const match = demoMatches.find((item) => Number(item.id) === Number(matchId));
      if (match && !saved.some((item) => Number(item.match.id) === Number(matchId))) {
        saved.push({ id: Date.now(), match, createdAt: new Date().toISOString() });
        localStorage.setItem('worldcup-reservations', JSON.stringify(saved));
      }
      return match;
    }
  },
  cancelReservation: async (matchId) => {
    try {
      return await request(`/reservations/${matchId}`, { method: 'DELETE' });
    } catch {
      const saved = JSON.parse(localStorage.getItem('worldcup-reservations') || '[]')
        .filter((item) => Number(item.match.id) !== Number(matchId));
      localStorage.setItem('worldcup-reservations', JSON.stringify(saved));
      return null;
    }
  }
};
