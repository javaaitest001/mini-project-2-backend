package com.worldcup.site.repository;

import com.worldcup.site.entity.Match;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findAllByOrderByKickoffAtAsc();
    List<Match> findTop6ByKickoffAtAfterOrderByKickoffAtAsc(OffsetDateTime now);
}
