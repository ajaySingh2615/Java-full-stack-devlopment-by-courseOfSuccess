package com.collections.wrapperdemo;

public class AutoBoxingDemo {
    public static void main(String[] args) {
        int a = 10;
        Integer i = a; //autoboxing Integer -> Primitive mein convert krna
        // if Primitive se Integer mein convert krna hai (unboxing)
        System.out.println(i);

        int b = i;
        System.out.println(b);
    }
}
