package org.genie.myfirstapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyFirstAppApplication {

    public static void main(String[] args) {
        System.out.println("Hello, this is my first application");
        SpringApplication.run(MyFirstAppApplication.class, args);
    }

}
