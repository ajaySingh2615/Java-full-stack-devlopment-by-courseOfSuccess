package com.exception;

import java.io.File;
import java.util.Scanner;

public class TestException {
    public static void main(String[] args) {
        System.out.println("before exception");
        System.out.println("calculating.....");
        try {
            File file = new File("demo.text");
            Scanner scanner = new Scanner(file);
//            System.out.println(10/0);
        } catch (Exception e) {
            System.out.println(e);
        }
        System.out.println("after calculation");
        System.out.println("mike");
        System.out.println("mike");
        System.out.println("mike");
        System.out.println("mike");
        System.out.println("mike");
    }
}
