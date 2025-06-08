package org.cadt.train.repo;

import org.cadt.train.entity.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainScheduleRepository extends JpaRepository<TrainSchedule, Long> {
}
