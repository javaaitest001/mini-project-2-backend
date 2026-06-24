package com.worldcup.site.config;

import com.worldcup.site.entity.*;
import com.worldcup.site.repository.*;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository users;
    private final TeamRepository teams;
    private final VenueRepository venues;
    private final MatchRepository matches;
    private final StandingRepository standings;
    private final PlayerRepository players;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository users, TeamRepository teams, VenueRepository venues, MatchRepository matches,
                      StandingRepository standings, PlayerRepository players, PasswordEncoder encoder) {
        this.users = users;
        this.teams = teams;
        this.venues = venues;
        this.matches = matches;
        this.standings = standings;
        this.players = players;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() == 0) {
            createUser("admin@worldcup.local", "admin1234", "Admin", Role.ADMIN);
            createUser("fan@worldcup.local", "fan1234", "Match Fan", Role.USER);
        }
        if (teams.count() > 0) {
            return;
        }

        Venue azteca = venue("Estadio Azteca", "Mexico City", "Mexico");
        Venue toronto = venue("BMO Field", "Toronto", "Canada");
        Venue sofi = venue("SoFi Stadium", "Inglewood", "United States");
        Venue metlife = venue("MetLife Stadium", "East Rutherford", "United States");

        List<Team> seededTeams = List.of(
                team("Mexico", "MEX", "A", "🇲🇽", "CONCACAF"),
                team("South Africa", "RSA", "A", "🇿🇦", "CAF"),
                team("Korea Republic", "KOR", "A", "🇰🇷", "AFC"),
                team("Czechia", "CZE", "A", "🇨🇿", "UEFA"),
                team("Canada", "CAN", "B", "🇨🇦", "CONCACAF"),
                team("Bosnia and Herzegovina", "BIH", "B", "🇧🇦", "UEFA"),
                team("Qatar", "QAT", "B", "🇶🇦", "AFC"),
                team("Switzerland", "SUI", "B", "🇨🇭", "UEFA"),
                team("United States", "USA", "D", "🇺🇸", "CONCACAF"),
                team("Argentina", "ARG", "J", "🇦🇷", "CONMEBOL"),
                team("France", "FRA", "I", "🇫🇷", "UEFA"),
                team("Portugal", "POR", "K", "🇵🇹", "UEFA")
        );

        for (Team team : seededTeams) {
            standing(team);
        }

        match("MEX", "RSA", azteca, "2026-06-11T20:00:00-06:00", "A", MatchStatus.SCHEDULED, null, null, "Opening match in Mexico City");
        match("KOR", "CZE", azteca, "2026-06-11T23:00:00-06:00", "A", MatchStatus.SCHEDULED, null, null, "Group A night match");
        match("CAN", "BIH", toronto, "2026-06-12T20:00:00-04:00", "B", MatchStatus.SCHEDULED, null, null, "Canada opens at home");
        match("USA", "ARG", sofi, "2026-06-20T18:00:00-07:00", "D", MatchStatus.SCHEDULED, null, null, "Prime-time clash");
        match("FRA", "POR", metlife, "2026-06-25T17:00:00-04:00", "I", MatchStatus.SCHEDULED, null, null, "European heavyweight watch");

        playersFor("KOR", List.of("Son Heung-min", "Kim Min-jae", "Lee Kang-in"));
        playersFor("MEX", List.of("Santiago Gimenez", "Edson Alvarez", "Guillermo Ochoa"));
        playersFor("ARG", List.of("Lionel Messi", "Julian Alvarez", "Emiliano Martinez"));
        playersFor("FRA", List.of("Kylian Mbappe", "Antoine Griezmann", "Aurelien Tchouameni"));
    }

    private void createUser(String email, String password, String name, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setName(name);
        user.setRole(role);
        users.save(user);
    }

    private Venue venue(String name, String city, String country) {
        Venue venue = new Venue();
        venue.setName(name);
        venue.setCity(city);
        venue.setCountry(country);
        return venues.save(venue);
    }

    private Team team(String name, String code, String groupName, String flagEmoji, String confederation) {
        Team team = new Team();
        team.setName(name);
        team.setCode(code);
        team.setGroupName(groupName);
        team.setFlagEmoji(flagEmoji);
        team.setConfederation(confederation);
        return teams.save(team);
    }

    private void standing(Team team) {
        Standing standing = new Standing();
        standing.setTeam(team);
        standing.setGroupName(team.getGroupName());
        standings.save(standing);
    }

    private void match(String homeCode, String awayCode, Venue venue, String kickoff, String groupName,
                       MatchStatus status, Integer homeScore, Integer awayScore, String headline) {
        Match match = new Match();
        match.setHomeTeam(teams.findByCode(homeCode).orElseThrow());
        match.setAwayTeam(teams.findByCode(awayCode).orElseThrow());
        match.setVenue(venue);
        match.setKickoffAt(OffsetDateTime.parse(kickoff));
        match.setGroupName(groupName);
        match.setStatus(status);
        match.setHomeScore(homeScore);
        match.setAwayScore(awayScore);
        match.setHeadline(headline);
        matches.save(match);
    }

    private void playersFor(String code, List<String> names) {
        Team team = teams.findByCode(code).orElseThrow();
        int number = 7;
        for (String name : names) {
            Player player = new Player();
            player.setTeam(team);
            player.setName(name);
            player.setPosition("Squad");
            player.setShirtNumber(number++);
            players.save(player);
        }
    }
}
