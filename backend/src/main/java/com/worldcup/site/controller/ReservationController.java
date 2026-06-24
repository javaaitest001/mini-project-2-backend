package com.worldcup.site.controller;

import com.worldcup.site.entity.Reservation;
import com.worldcup.site.repository.MatchRepository;
import com.worldcup.site.repository.ReservationRepository;
import com.worldcup.site.repository.UserRepository;
import com.worldcup.site.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationRepository reservations;
    private final UserRepository users;
    private final MatchRepository matches;

    public ReservationController(ReservationRepository reservations, UserRepository users, MatchRepository matches) {
        this.reservations = reservations;
        this.users = users;
        this.matches = matches;
    }

    @GetMapping
    public Object mine(@AuthenticationPrincipal UserPrincipal principal) {
        return reservations.findByUserEmailOrderByMatchKickoffAtAsc(principal.getUsername());
    }

    @PostMapping("/{matchId}")
    public Object reserve(@PathVariable Long matchId, @AuthenticationPrincipal UserPrincipal principal) {
        return reservations.findByUserEmailAndMatchId(principal.getUsername(), matchId)
                .orElseGet(() -> {
                    Reservation reservation = new Reservation();
                    reservation.setUser(users.findByEmail(principal.getUsername()).orElseThrow());
                    reservation.setMatch(matches.findById(matchId).orElseThrow());
                    return reservations.save(reservation);
                });
    }

    @DeleteMapping("/{matchId}")
    public void cancel(@PathVariable Long matchId, @AuthenticationPrincipal UserPrincipal principal) {
        reservations.findByUserEmailAndMatchId(principal.getUsername(), matchId)
                .ifPresent(reservations::delete);
    }
}
