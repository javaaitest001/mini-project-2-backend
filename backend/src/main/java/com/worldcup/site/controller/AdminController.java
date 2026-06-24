package com.worldcup.site.controller;

import com.worldcup.site.entity.*;
import com.worldcup.site.repository.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final TeamRepository teams;
    private final MatchRepository matches;
    private final StandingRepository standings;
    private final PlayerRepository players;
    private final VenueRepository venues;

    public AdminController(TeamRepository teams, MatchRepository matches, StandingRepository standings,
                           PlayerRepository players, VenueRepository venues) {
        this.teams = teams;
        this.matches = matches;
        this.standings = standings;
        this.players = players;
        this.venues = venues;
    }

    @PostMapping("/teams")
    public Team saveTeam(@RequestBody Team team) { return teams.save(team); }

    @PostMapping("/matches")
    public Match saveMatch(@RequestBody Match match) { return matches.save(match); }

    @PostMapping("/standings")
    public Standing saveStanding(@RequestBody Standing standing) { return standings.save(standing); }

    @PostMapping("/players")
    public Player savePlayer(@RequestBody Player player) { return players.save(player); }

    @PostMapping("/venues")
    public Venue saveVenue(@RequestBody Venue venue) { return venues.save(venue); }
}
