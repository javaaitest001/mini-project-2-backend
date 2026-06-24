package com.worldcup.site.controller;

import com.worldcup.site.repository.*;
import java.time.OffsetDateTime;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicDataController {
    private final TeamRepository teams;
    private final MatchRepository matches;
    private final StandingRepository standings;
    private final PlayerRepository players;

    public PublicDataController(TeamRepository teams, MatchRepository matches, StandingRepository standings, PlayerRepository players) {
        this.teams = teams;
        this.matches = matches;
        this.standings = standings;
        this.players = players;
    }

    @GetMapping("/teams")
    public Object teams() { return teams.findAll(); }

    @GetMapping("/matches")
    public Object matches() { return matches.findAllByOrderByKickoffAtAsc(); }

    @GetMapping("/matches/upcoming")
    public Object upcoming() { return matches.findTop6ByKickoffAtAfterOrderByKickoffAtAsc(OffsetDateTime.now()); }

    @GetMapping("/matches/{id}")
    public Object match(@PathVariable Long id) { return matches.findById(id).orElseThrow(); }

    @GetMapping("/standings")
    public Object standings() { return standings.findAllByOrderByGroupNameAscPointsDescGoalsForDesc(); }

    @GetMapping("/teams/{teamId}/players")
    public Object squad(@PathVariable Long teamId) { return players.findByTeamIdOrderByShirtNumberAscNameAsc(teamId); }
}
