package org.example;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Test {
    public static void main(String[] args) throws Exception {
        //starting IOC
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("Beans.xml");

        Car car = applicationContext.getBean(Car.class);
        KSeries bean = applicationContext.getBean(KSeries.class);

        car.drive();
    }
}
