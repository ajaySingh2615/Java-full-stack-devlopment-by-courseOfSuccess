package org.example;

public class KSeries implements Engine {

    KSeries(){
        System.out.println("KSeries Constructor...");
    }

    @Override
    public int start() {
        System.out.println("start KSeries engine....");
        return 1;
    }
}
