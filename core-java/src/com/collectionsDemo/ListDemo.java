package com.collectionsDemo;

import java.util.ArrayList;
import java.util.List;

public class ListDemo {
    public static void main(String[] args) {
        List list = new ArrayList();
        list.add(10);
        list.add("hi");
        list.add(40);
        System.out.println(list);

        System.out.println("=====================");

        List<Integer> arr = new ArrayList<>();  //default size - 10 // (10 * 1.5) + 1
        arr.add(10);
        arr.add(20);
        arr.add(30);
        arr.add(40);
        arr.add(10);
        System.out.println(arr);

        ArrayList<String> arr1 = new ArrayList<>(20);

    }
}
