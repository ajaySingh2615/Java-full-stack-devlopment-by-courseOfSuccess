package com.oops.string;

public class StringBufferDemo {
    public static void main(String[] args) {
        StringBuffer stringBuffer = new StringBuffer("abcd");
        StringBuffer newStringBuffer = stringBuffer.append(stringBuffer);
        stringBuffer.append(stringBuffer.hashCode());
        System.out.println(newStringBuffer.hashCode());
    }
}
