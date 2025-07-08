package com.arrayspartone;

public class BinarySearchAlgorithm {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int key = 10;

        int result = binarySearchAlgorithm(arr, key);
        if (result == -1) {
            System.out.println("key not found!");
        } else {
            System.out.println("key found at index " + result);
        }

    }

    public static int binarySearchAlgorithm(int[] arr, int key) {
        int start = 0;
        int end = arr.length - 1;

        while (start <= end) {
            int mid = (start + end) / 2;

            if (arr[mid] == key) {
                return mid;
            } else if (arr[mid] > key) {
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        }
        return -1;
    }

}
