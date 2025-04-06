package com.oops.poly;

public class Notification extends Wish {

    String name = "simran";

    public static void main(String[] args) {
        Notification notification = new Notification();
        notification.notifyUser();
    }

    @Override
    public void greet() {
        System.out.println("ji" + name + " ji");
        super.greet();
    }

    public void notifyUser() {
        greet();
    }
}
