package com.mutithreading;

class MyThread extends Thread {
    //task/job

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("child thread " + i);
        }
    }
}

public class ThreadDemo {
    public static void main(String[] args) {
        MyThread t = new MyThread();

        t.start();

        for (int i = 0; i < 5; i++) {
            System.out.println("mike " + i);
        }
    }
}
