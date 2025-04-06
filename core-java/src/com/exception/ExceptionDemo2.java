package com.exception;

import java.util.Scanner;

public class ExceptionDemo2 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter the first value: ");
        int a = scanner.nextInt();
        System.out.println("Enter the second value");
        int b = scanner.nextInt();
        int sum = sum(a, b);
        System.out.println("the result is : " + sum);
        int div = div(a, b);
        System.out.println("div is : " + div);

    }

    public static int sum(int a, int b) {
        return a + b;
    }

    public static int div(int a, int b) {
//        return a / b;
        try {
            int res = a / b;
            return res;
        } catch (Exception e) {
            System.out.println("Invalid input");
            return 0;
        }
    }
}
