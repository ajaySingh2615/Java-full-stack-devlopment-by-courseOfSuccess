package com.mutithreading;

class MyThread4 extends Thread {
    @Override
    public void run() {

        int[] arr = {1, 2, 3, 4, 5};
        int sum = 0;

        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName());
            sum += arr[i];
        }
        System.out.println("sum of array " + sum);
    }
}

public class MultipleThread {
    public static void main(String[] args) {
        MyThread4 t1 = new MyThread4();
        MyThread4 t2 = new MyThread4();

        t1.start();
        t2.start();
    }
}
