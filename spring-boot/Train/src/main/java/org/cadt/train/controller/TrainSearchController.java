package org.cadt.train.controller;

import org.cadt.train.entity.TrainSchedule;
import org.cadt.train.service.TrainSearchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/search")
public class TrainSearchController {

    private TrainSearchService trainSearchService;

    public TrainSearchController(TrainSearchService trainSearchService) {
        this.trainSearchService = trainSearchService;
    }

    @GetMapping("/by-code")
    public List<TrainSchedule> findTrainByStationCode(@RequestParam String sourceCode,
                                                      @RequestParam String destinationCode) {
        return trainSearchService.findTrainByStationCode(sourceCode.toUpperCase(), destinationCode.toUpperCase());
    }

    @GetMapping("/by-name")
    public List<TrainSchedule> findTrainByStationName(@RequestParam String sourceName,
                                                      @RequestParam String destinationName) {
        return trainSearchService.findTrainByStationName(sourceName.toUpperCase(), destinationName.toUpperCase());
    }

}
