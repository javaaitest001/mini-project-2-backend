package com.worldcup.site.repository;

import com.worldcup.site.entity.Team;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByGroupNameOrderByNameAsc(String groupName);
    Optional<Team> findByCode(String code);
}
