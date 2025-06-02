package org.example;

public class KSeries implements Engine {
    @Override
    public int start() {
        System.out.println("start KSeries....");
        return 1;
    }
}
