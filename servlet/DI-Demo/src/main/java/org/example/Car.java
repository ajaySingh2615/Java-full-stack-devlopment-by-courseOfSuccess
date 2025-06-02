package org.example;

public class Car {
    Engine engine;

    Car(Engine engine) {
        System.out.println("Argument constructor...");
        this.engine = engine;
    }

    public void drive() {
        int start = engine.start();
        if (start >= 1) {
            System.out.println("Car is running");
        }
    }

    public Engine getEngine() {
        return engine;
    }

    public void setEngine(Engine engine) {
        System.out.println("Setter method....");
        this.engine = engine;
    }
}
