package org.example;

public class Car {
    Engine engine;

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
        this.engine = engine;
    }
}
