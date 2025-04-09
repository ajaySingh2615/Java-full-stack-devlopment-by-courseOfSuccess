package com.exception;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class ExceptionDemo3 {
    public static void main(String[] args) {
        m1();
    }

    public static void m1() {
        try {
            m2();
        } catch (Exception e) {
//            System.out.println(e.getMessage());
            System.out.println(e.toString());
        }
    }

    public static void m2() {
        try {
            m3();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void m3() throws FileNotFoundException {
        m4();
    }

    public static void m4() throws FileNotFoundException {
//        throw new ArithmeticException("Zero Divide");
        File file = new File("demo.txt");
        Scanner scanner = new Scanner(file);
    }
}
