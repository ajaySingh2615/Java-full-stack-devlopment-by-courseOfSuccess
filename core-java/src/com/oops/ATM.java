package com.oops;

public class ATM {

    // data hide
    private int bal = 10000;
    private String location = "agra";
    private String BankName = "HDFC";
    private String AccNo = "212345";

    public int getBal() {
        return bal;
    }

    public String getAccNo() {
        return AccNo;
    }

    public void details() {
        System.out.println(location);
    }
}
