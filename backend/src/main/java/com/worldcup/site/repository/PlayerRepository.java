package com.worldcup.site.repository;

import com.worldcup.site.entity.Player;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamIdOrderByShirtNumberAscNameAsc(Long teamId);
}
