package com.oops.poly;

public class Notification extends Wish {
    public static void main(String[] args) {
        Notification notification = new Notification();
        notification.notifyUser();
    }

    public void notifyUser() {
        greet();
    }
}
