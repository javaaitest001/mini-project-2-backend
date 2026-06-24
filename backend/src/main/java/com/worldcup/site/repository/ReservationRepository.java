package com.worldcup.site.repository;

import com.worldcup.site.entity.Reservation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserEmailOrderByMatchKickoffAtAsc(String email);
    Optional<Reservation> findByUserEmailAndMatchId(String email, Long matchId);
}
