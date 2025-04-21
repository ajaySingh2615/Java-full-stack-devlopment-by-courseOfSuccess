package com.mutithreading;

class MyThead3 extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + " " + i);

            // call yield to give chance
            Thread.yield();
        }
    }
}

public class YieldDemo {
    public static void main(String[] args) {
        Thread t1 = new MyThead3();
        t1.start();

        for (int i = 0; i < 5; i++) {
            System.out.println("main thread");
        }
    }
}
