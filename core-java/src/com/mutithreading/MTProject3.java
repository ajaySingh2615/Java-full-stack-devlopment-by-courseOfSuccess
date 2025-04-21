package com.mutithreading;

public class MTProject3 {
    public static void main(String[] args) {
        Thread t1 = new Thread(new MyRunnable());

        System.out.println(Thread.currentThread());

        String t1name = t1.getName();
        System.out.println("default name " + t1name);

        t1.setName("My-thread-t1");

        System.out.println("default name" + t1.getName());
    }
}
