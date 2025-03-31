package com.typesofvariable;

public class StaticDemo {
    static String name = "mike"; //instance variable

    public static void main(String[] args) {
//        StaticDemo ob1 = new StaticDemo();
        System.out.println(StaticDemo.name);

        StaticDemo.name = "raj";
        System.out.println(StaticDemo.name);
        System.out.println("-------");

//        StaticDemo ob2 = new StaticDemo();
        System.out.println(StaticDemo.name);
    }

    public void m1(){
        System.out.println(name);
    }
}
