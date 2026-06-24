package com.worldcup.site.repository;

import com.worldcup.site.entity.Standing;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StandingRepository extends JpaRepository<Standing, Long> {
    List<Standing> findAllByOrderByGroupNameAscPointsDescGoalsForDesc();
}
