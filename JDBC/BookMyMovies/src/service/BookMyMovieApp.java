package service;

import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class BookMyMovieApp {
    public static void main(String[] args) {
        BookMyMovieSys mbs = new BookMyMovieSys();
        Scanner scanner = new Scanner(System.in);

        System.out.println("enter city: ");
        String city = scanner.next();
        mbs.displayTheaters(city);

        System.out.println("Enter Theater Id and Movie Id:");
        int theaterId = scanner.nextInt();
        int movieId = scanner.nextInt();
        mbs.displayShows(movieId, theaterId);

        System.out.println("Enter show id and number of seats:");
        int showId = scanner.nextInt();
        List<String> ss = Arrays.asList("A1, A2");
        mbs.bookTicket(1, showId, ss);
    }
}
