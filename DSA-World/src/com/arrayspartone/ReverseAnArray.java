package com.arrayspartone;

public class ReverseAnArray {
    public static void main(String[] args) {
        int[] arr = {2, 4, 6, 8, 10};

        reverseAnArray(arr);

//        System.out.println(Arrays.toString(arr));
        for (int ele : arr) {
            System.out.print(ele + " ");
        }
    }

    public static void reverseAnArray(int[] arr) {
        int start = 0;
        int end = arr.length - 1;

        while (start < end) {
            int temp = arr[start];
            arr[start] = arr[end];
            arr[end] = temp;
            start++;
            end--;
        }
    }
}
