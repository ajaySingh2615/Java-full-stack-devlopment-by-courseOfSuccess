package com.arrayspartone;

public class LinearSearchAlgo {
    public static void main(String[] args) {
        int[] arr = {2, 4, 6, 8, 10};
        int ele = 10;

        int result = linearSearchAlgo(arr, ele);
        if (result == -1) {
            System.out.println("element not found!");
        } else {
            System.out.println("element found at index " + result);
        }
    }

    public static int linearSearchAlgo(int[] arr, int element) {
        for (int i = 1; i <= arr.length; i++) {
            if (arr[i] == element) {
                return i;
            }
        }
        return -1;
    }
}
