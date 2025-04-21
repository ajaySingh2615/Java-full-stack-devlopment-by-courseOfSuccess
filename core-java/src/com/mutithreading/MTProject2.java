package com.mutithreading;

class MyThread2 extends Thread{

}

public class MTProject2 {
    public static void main(String[] args) {
        MyThread2 t = new MyThread2();
        t.start();
    }
}
