const venue = (name, city, country) => ({ name, city, country });
const team = (id, name, code, groupName, flagEmoji, confederation) => ({ id, name, code, groupName, flagEmoji, confederation });

export const demoTeams = [
  team(1, 'Mexico', 'MEX', 'A', '🇲🇽', 'CONCACAF'),
  team(2, 'South Africa', 'RSA', 'A', '🇿🇦', 'CAF'),
  team(3, 'Korea Republic', 'KOR', 'A', '🇰🇷', 'AFC'),
  team(4, 'Czechia', 'CZE', 'A', '🇨🇿', 'UEFA'),
  team(5, 'Canada', 'CAN', 'B', '🇨🇦', 'CONCACAF'),
  team(6, 'Bosnia and Herzegovina', 'BIH', 'B', '🇧🇦', 'UEFA'),
  team(7, 'Qatar', 'QAT', 'B', '🇶🇦', 'AFC'),
  team(8, 'Switzerland', 'SUI', 'B', '🇨🇭', 'UEFA'),
  team(9, 'United States', 'USA', 'D', '🇺🇸', 'CONCACAF'),
  team(10, 'Argentina', 'ARG', 'J', '🇦🇷', 'CONMEBOL'),
  team(11, 'France', 'FRA', 'I', '🇫🇷', 'UEFA'),
  team(12, 'Portugal', 'POR', 'K', '🇵🇹', 'UEFA')
];

const findTeam = (code) => demoTeams.find((item) => item.code === code);

export const demoMatches = [
  {
    id: 1,
    homeTeam: findTeam('MEX'),
    awayTeam: findTeam('RSA'),
    venue: venue('Estadio Azteca', 'Mexico City', 'Mexico'),
    kickoffAt: '2026-06-11T20:00:00-06:00',
    groupName: 'A',
    status: 'SCHEDULED',
    headline: 'Opening match in Mexico City'
  },
  {
    id: 2,
    homeTeam: findTeam('KOR'),
    awayTeam: findTeam('CZE'),
    venue: venue('Estadio Azteca', 'Mexico City', 'Mexico'),
    kickoffAt: '2026-06-11T23:00:00-06:00',
    groupName: 'A',
    status: 'SCHEDULED',
    headline: 'Group A night match'
  },
  {
    id: 3,
    homeTeam: findTeam('CAN'),
    awayTeam: findTeam('BIH'),
    venue: venue('BMO Field', 'Toronto', 'Canada'),
    kickoffAt: '2026-06-12T20:00:00-04:00',
    groupName: 'B',
    status: 'SCHEDULED',
    headline: 'Canada opens at home'
  },
  {
    id: 4,
    homeTeam: findTeam('USA'),
    awayTeam: findTeam('ARG'),
    venue: venue('SoFi Stadium', 'Inglewood', 'United States'),
    kickoffAt: '2026-06-20T18:00:00-07:00',
    groupName: 'D',
    status: 'SCHEDULED',
    headline: 'Prime-time clash'
  },
  {
    id: 5,
    homeTeam: findTeam('FRA'),
    awayTeam: findTeam('POR'),
    venue: venue('MetLife Stadium', 'East Rutherford', 'United States'),
    kickoffAt: '2026-06-25T17:00:00-04:00',
    groupName: 'I',
    status: 'SCHEDULED',
    headline: 'European heavyweight watch'
  }
];

export const demoStandings = demoTeams.map((item, index) => ({
  id: item.id,
  team: item,
  groupName: item.groupName,
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0
}));

export const demoPlayers = [
  ['KOR', 'Son Heung-min', 'Forward', 7, 'Tottenham Hotspur'],
  ['KOR', 'Kim Min-jae', 'Defender', 4, 'Bayern Munich'],
  ['KOR', 'Lee Kang-in', 'Midfielder', 18, 'Paris Saint-Germain'],
  ['MEX', 'Santiago Gimenez', 'Forward', 11, 'AC Milan'],
  ['MEX', 'Edson Alvarez', 'Midfielder', 4, 'West Ham United'],
  ['ARG', 'Lionel Messi', 'Forward', 10, 'Inter Miami'],
  ['ARG', 'Julian Alvarez', 'Forward', 9, 'Atletico Madrid'],
  ['FRA', 'Kylian Mbappe', 'Forward', 10, 'Real Madrid'],
  ['FRA', 'Aurelien Tchouameni', 'Midfielder', 8, 'Real Madrid'],
  ['POR', 'Cristiano Ronaldo', 'Forward', 7, 'Al Nassr']
].map(([code, name, position, shirtNumber, club], id) => ({
  id: id + 1,
  team: findTeam(code),
  name,
  position,
  shirtNumber,
  club
}));
