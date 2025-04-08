package com.exception;

public class FinallyKeywordExample3 {
    public static void main(String[] args) {
        int i = m1();
        System.out.println(i);
    }

    public static int m1() {
        try {
            System.out.println("try block");
            System.exit(0);
            return 10;
        } catch (ArithmeticException e) {
            System.out.println("catch block");
            return 20;
        } finally {
            System.out.println("finally block");
            return 99;
        }
    }
}
