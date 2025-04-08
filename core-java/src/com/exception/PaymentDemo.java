package com.exception;

public class PaymentDemo {
    public static void main(String[] args) {
        payment(100);
    }

    public static void payment(int price) {
        int bal = 200;
        System.out.println("transaction initiating...");
        System.out.println("select bank ---- sbi");
        System.out.println("making payment");
        try {
            bal = bal - price;
            System.out.println(10 / 0);
        } catch (Exception e) {
            System.out.println("payment fail");
            e.printStackTrace();
        }
        finally {
            if(bal<200){
                System.out.println("Payment done....");
            }
        }
    }
}
