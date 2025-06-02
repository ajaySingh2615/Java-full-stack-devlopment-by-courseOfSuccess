package org.example;

public class Test {
    public static void main(String[] args) throws ClassNotFoundException, InstantiationException, IllegalAccessException {
//        Car car = new Car(new KSeries());
//        car.setEngine(new MHawk());
//        car.drive();

        Class<?> aClass = Class.forName("org.example.Car");
        Object o = aClass.newInstance();

        Car car = (Car) o;
    }
}
