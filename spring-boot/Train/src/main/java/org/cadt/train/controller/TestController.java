package org.cadt.train.controller;

import org.cadt.train.entity.Station;
import org.cadt.train.entity.Train;
import org.cadt.train.entity.TrainSchedule;
import org.cadt.train.repo.StationRepository;
import org.cadt.train.repo.TrainRepository;
import org.cadt.train.repo.TrainScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    StationRepository stationRepository;

    @Autowired
    TrainRepository trainRepository;

    @Autowired
    TrainScheduleRepository trainScheduleRepository;

    @GetMapping
    public void test() {
        Station delhi = new Station(null, "New Delhi", "NDLS");
        Station mumbai = new Station(null, "Mumbai Central", "BCT");
        Station chennai = new Station(null, "Chennai Central", "MAS");
        Station kolkata = new Station(null, "Kolkata Station", "KOAA");
        Station bangalore = new Station(null, "Bengaluru City", "SBC");
        Station hyderabad = new Station(null, "Hyderabad Deccan", "HYB");
        Station jaipur = new Station(null, "Jaipur Junction", "JP");
        Station varanasi = new Station(null, "Varanasi Junction", "BSB");
        Station lucknow = new Station(null, "Lucknow NR", "LKO");
        Station pune = new Station(null, "Pune Junction", "PUNE");
        Station ahmedabad = new Station(null, "Ahmedabad Junction", "ADI");

        stationRepository.saveAll(List.of(delhi, mumbai, chennai, kolkata, bangalore, hyderabad, jaipur,
                varanasi, lucknow, pune, ahmedabad));

        Train rajdhani = new Train(null, "Rajdhani Express", "12306", null);
        Train shatabdi = new Train(null, "Shatabdi Express", "12009", null);
        Train duronto = new Train(null, "Duronto Express", "12259", null);
        Train garibrath = new Train(null, "Garib Rath Express", "12947", null);

        trainRepository.saveAll(List.of(rajdhani, shatabdi, duronto, garibrath));

        TrainSchedule schedule1 = new TrainSchedule(null, rajdhani, delhi, mumbai, "06:00",
                "14:00");
        TrainSchedule schedule2 = new TrainSchedule(null, shatabdi, chennai, bangalore, "07:30",
                "12:00");
        TrainSchedule schedule3 = new TrainSchedule(null, duronto, kolkata, delhi, "05:45",
                "15:30");
        TrainSchedule schedule4 = new TrainSchedule(null, garibrath, lucknow, ahmedabad, "09:15",
                "20:40");

        trainScheduleRepository.saveAll(List.of(schedule1, schedule2, schedule3, schedule4));

        System.out.println("data inserted in database...");
    }
}
