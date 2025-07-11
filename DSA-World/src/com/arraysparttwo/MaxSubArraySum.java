package com.arraysparttwo;

public class MaxSubArraySum {
    public static void main(String[] args) {
        int[] arr = {1, -2, 6, -1, 3};

        int maxSum = maxSubArraySum(arr);
        System.out.println("max sum = " + maxSum);
    }

    // prefix subArraySum 
    public static int prefixSubArraySum(int[] arr) {
        int ms = Integer.MIN_VALUE;
 
        int[] prefix = new int[arr.length];

        prefix[0] = arr[0];
        //calculate prefix array
        for (int i = 1; i < prefix.length; i++) {
            prefix[i] = arr[i] + prefix[i - 1];
        }

        for (int i = 0; i < arr.length; i++) {
            int sum = 0;
            for (int j = i; j < arr.length; j++) {
                for (int k = i; k <= j; k++) {
                    sum += arr[k];
                }
                System.out.println(sum);
                if (sum > ms) {
                    ms = sum;
                }
            }
        }
        return ms;
    }

    // Brute force
    public static int maxSubArraySum(int[] arr) {
        int ms = Integer.MIN_VALUE;

        for (int i = 0; i < arr.length; i++) {
            int sum = 0;
            for (int j = i; j < arr.length; j++) {
                for (int k = i; k <= j; k++) {
                    sum += arr[k];
                }
                System.out.println(sum);
                if (sum > ms) {
                    ms = sum;
                }
            }
        }
        return ms;
    }
}
