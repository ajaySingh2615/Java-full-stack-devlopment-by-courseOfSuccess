package com.typesofvariable;

public class InstanceDemo {
    // instance variable
    String name = "mike";


    public static void main(String[] args) {
        InstanceDemo s1 = new InstanceDemo();
        System.out.println(s1.name);

        InstanceDemo s2 = new InstanceDemo();
        s2.name = "aman";
        System.out.println(s2.name);

        InstanceDemo s3 = new InstanceDemo();
        System.out.println(s3.name);

    }
}
