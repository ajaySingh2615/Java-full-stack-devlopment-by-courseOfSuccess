package com.arrayspartone;

public class LargestNumber {
    public static void main(String[] args) {
        int[] arr = {1, 2, 6, 3, 5};

        try {
            int largestNumber = largestNumber(arr);
            System.out.println("Largest number: " + largestNumber);
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public static int largestNumber(int[] arr) {
        if (arr == null || arr.length == 0) {
            throw new IllegalArgumentException("Array should not be empty");
        }

        int largest = Integer.MIN_VALUE;

        for (int i : arr) {
            if (i > largest) {
                largest = i;
            }
        }

        return largest;
    }
}
