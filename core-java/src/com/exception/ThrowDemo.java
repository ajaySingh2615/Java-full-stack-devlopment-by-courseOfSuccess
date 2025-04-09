package com.exception;

public class ThrowDemo {
    public static void main(String[] args) {
        div(10, 2);
        div(10, 0);
    }

    public static int div(int div, int divisor) {
        if (divisor == 0) {
            throw new ArithmeticException("cannot divide by zero");
        }
        return div / divisor;
    }
}
