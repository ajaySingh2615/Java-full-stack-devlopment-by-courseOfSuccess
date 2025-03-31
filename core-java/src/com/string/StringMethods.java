package com.string;

import java.util.Arrays;

public class StringMethods {
    public static void main(String[] args) {
        String s = "ajay singh";
        System.out.println(s.length());

        String s1 = "ajay";
        String s2 = "singh";
        String s3 = s1.concat(s2);
        System.out.println(s1.concat(s3));

        //String to char
        String s4 = "ajay Singh";
        char[] charArray = s4.toCharArray();
        System.out.println(Arrays.toString(charArray));

        //chatAt
        String s5 = "ajay singh";
        System.out.println(s5.charAt(2));

        //compare
        String s6 = "hello";
        String s7 = "hello";
        System.out.println(s6.equals(s7));
        System.out.println(s6==s7);

        String s8 = new String("Hello");
        String s9 = new String("Hello");
        System.out.println(s8==s9);
        System.out.println(s8.equals(s9));
    }
}
