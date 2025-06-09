package org.cadt.train.repo;

import org.cadt.train.entity.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainScheduleRepository extends JpaRepository<TrainSchedule, Long> {
}
