package com.collections.wrapperdemo;

public class MethodDemo {
    public static void main(String[] args) {
        String num = "123";
        int val = Integer.parseInt(num);
        System.out.println(val);

        int n = 10;
        String s = Integer.toString(n);
        System.out.println(n);

        Integer a = 10;
        Integer b = 10;
//        Integer c = new Integer(10);

        System.out.println("compare " + Integer.compare(a, b));

        Integer i = Integer.valueOf("123");
        System.out.println(i);
    }
}
