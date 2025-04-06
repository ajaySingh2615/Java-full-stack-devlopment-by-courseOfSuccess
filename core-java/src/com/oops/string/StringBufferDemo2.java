package com.oops.string;

public class StringBufferDemo2 {
    public static void main(String[] args) {
        String s1 = "mike";
        String s2 = "pen";

        System.out.println(s1 == s2);

        StringBuffer sb = new StringBuffer("hell89");
        StringBuffer newHello = sb.append("newHello");
        System.out.println(sb == newHello);

        StringBuilder stringBuilder = new StringBuilder("mikke");
        StringBuilder dkjf = stringBuilder.append("dkjf");
        System.out.println(stringBuilder == dkjf);

    }
}
