package com.exception;

public class TryWithMultipleCatch {
    public static void main(String[] args) {
        try {
            m1();
        } catch (ArithmeticException e) {
            e.printStackTrace();
        } catch (ArrayIndexOutOfBoundsException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static int m1() {
        int[] arr = new int[2];

        if (arr.length > 3) {
            return arr[4];  // Array index out of bound
        } else return arr[0] / arr[1]; // Arithmetic Exception
    }
}
