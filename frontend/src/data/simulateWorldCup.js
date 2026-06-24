const groupLetters = 'ABCDEFGHIJKL'.split('');

function emptyRow(team) {
  return { team, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
}

function chance(teamA, teamB) {
  return 1 / (1 + Math.pow(10, (teamB.strength - teamA.strength) / 28));
}

function expectedGoals(team, opponent) {
  const base = 1.15 + (team.strength - opponent.strength) / 38;
  return Math.max(0.35, Math.min(3.4, base));
}

function randomGoals(expected) {
  const variance = Math.random() * 1.6 - 0.55;
  return Math.max(0, Math.round(expected + variance));
}

function settleDraw(a, b) {
  const aChance = chance(a, b);
  return Math.random() < aChance ? a : b;
}

function playMatch(home, away, knockout = false) {
  let homeGoals = randomGoals(expectedGoals(home, away));
  let awayGoals = randomGoals(expectedGoals(away, home));

  if (!knockout) {
    return { home, away, homeGoals, awayGoals, winner: homeGoals > awayGoals ? home : awayGoals > homeGoals ? away : null };
  }

  let method = 'FT';
  let winner = homeGoals > awayGoals ? home : awayGoals > homeGoals ? away : null;
  if (!winner) {
    winner = settleDraw(home, away);
    method = 'PEN';
  }
  return { home, away, homeGoals, awayGoals, winner, method };
}

function rankRows(rows) {
  return [...rows].sort((a, b) => {
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    return b.points - a.points
      || gdB - gdA
      || b.goalsFor - a.goalsFor
      || b.team.strength - a.team.strength;
  });
}

function applyResult(rows, result) {
  const home = rows.get(result.home.id);
  const away = rows.get(result.away.id);
  home.played += 1;
  away.played += 1;
  home.goalsFor += result.homeGoals;
  home.goalsAgainst += result.awayGoals;
  away.goalsFor += result.awayGoals;
  away.goalsAgainst += result.homeGoals;

  if (result.homeGoals > result.awayGoals) {
    home.wins += 1;
    away.losses += 1;
    home.points += 3;
  } else if (result.awayGoals > result.homeGoals) {
    away.wins += 1;
    home.losses += 1;
    away.points += 3;
  } else {
    home.draws += 1;
    away.draws += 1;
    home.points += 1;
    away.points += 1;
  }
}

function groupPairs(teams) {
  return [
    [teams[0], teams[1]],
    [teams[2], teams[3]],
    [teams[0], teams[2]],
    [teams[3], teams[1]],
    [teams[3], teams[0]],
    [teams[1], teams[2]]
  ];
}

function simulateGroup(teams) {
  const rows = new Map(teams.map((team) => [team.id, emptyRow(team)]));
  const matches = groupPairs(teams).map(([home, away]) => {
    const result = playMatch(home, away);
    applyResult(rows, result);
    return result;
  });
  return { rows: rankRows([...rows.values()]), matches };
}

function knockoutRound(name, teams) {
  const matches = [];
  const winners = [];
  for (let index = 0; index < teams.length; index += 2) {
    const result = playMatch(teams[index], teams[index + 1], true);
    matches.push(result);
    winners.push(result.winner);
  }
  return { name, matches, winners };
}

export function simulateWorldCup(teams) {
  const grouped = Object.groupBy(teams, (team) => team.group);
  const groups = {};
  const qualified = [];
  const thirdPlaceRows = [];

  groupLetters.forEach((letter) => {
    const result = simulateGroup(grouped[letter]);
    groups[letter] = result;
    qualified.push(result.rows[0].team, result.rows[1].team);
    thirdPlaceRows.push(result.rows[2]);
  });

  rankRows(thirdPlaceRows).slice(0, 8).forEach((row) => qualified.push(row.team));
  const seeded = [...qualified].sort((a, b) => b.strength - a.strength);
  const bracketStart = [];
  for (let i = 0; i < seeded.length / 2; i += 1) {
    bracketStart.push(seeded[i], seeded[seeded.length - 1 - i]);
  }

  const round32 = knockoutRound('Round of 32', bracketStart);
  const round16 = knockoutRound('Round of 16', round32.winners);
  const quarterFinals = knockoutRound('Quarter-finals', round16.winners);
  const semiFinals = knockoutRound('Semi-finals', quarterFinals.winners);
  const final = knockoutRound('Final', semiFinals.winners);

  return {
    groups,
    rounds: [round32, round16, quarterFinals, semiFinals, final],
    champion: final.winners[0]
  };
}
