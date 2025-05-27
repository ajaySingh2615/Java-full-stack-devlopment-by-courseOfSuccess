package service;

import config.DataBaseConfig;

import java.sql.*;
import java.util.List;
import java.util.Scanner;

public class BookMyMovieSys {
    Scanner scanner = new Scanner(System.in);

    //display movies
    public void displayMovies() {
        try {
            Connection connection = DataBaseConfig.getConnection();
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("select * from movies");
            System.out.println("----------Available Movies------------");
            while (resultSet.next()) {
                System.out.println(resultSet.getInt("movie_id") +
                        ". " + resultSet.getString("title") +
                        " (" + resultSet.getString("genre") + ")");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // show theater in a city
    public void displayTheaters(String city){
        try{
            Connection connection = DataBaseConfig.getConnection();
            PreparedStatement statement = connection.prepareStatement("select * from theaters where city = ?");
            statement.setString(1, city);
            ResultSet resultSet = statement.executeQuery();
            System.out.println("Theaters in " + city + ":");
            while (resultSet.next()){
                System.out.println(resultSet.getInt("theater_id") +
                        ". " + resultSet.getString("name"));
            }

        }catch (SQLException e){
            e.printStackTrace();
        }
    }

    // display show
    public void displayShows(int movieId, int theaterId){
        try{
            Connection connection = DataBaseConfig.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement("select * from shows where movieId = ? AND theater_id = ?");
            statement.setInt(1, movieId);
            statement.setInt(2, theaterId);
            ResultSet resultSet = statement.executeQuery();
            System.out.println("Available shows: ");
            while (resultSet.next()){
                System.out.println(resultSet.getInt("show_id") +
                        ". " + resultSet.getString("timing") +
                        " - Seats Available: " + resultSet.getString("available_seats"));
            }

        }catch (SQLException e){
            e.printStackTrace();
        }
    }

    // Book Ticket
    public void bookTicket(int userId, int showId, List<String> selectedSeats){
        try{
            Connection connection = DataBaseConfig.getConnection();
            connection.setAutoCommit(false);

            // check if seats are availble
            boolean alreadyBookedSeat = false;
            for (String seat: selectedSeats){
                PreparedStatement preparedStatement = connection.prepareStatement("select * from seat where seat_number = ? and show_id = ?");
                preparedStatement.setString(1, seat);
                preparedStatement.setInt(2, showId);
                ResultSet resultSet = preparedStatement.executeQuery();
                if(resultSet.next() && resultSet.getBoolean("is_booked")){
                    alreadyBookedSeat = true;
                    System.out.println("seat " + seat + " is already booked. Choose another seat");
                }
            }
            if(alreadyBookedSeat){
                System.out.println("Booking Failed! some seats are already Booked.");
                connection.rollback();
                return;
            }

            for(String seat: selectedSeats){
                PreparedStatement preparedStatement = connection.prepareStatement("UPDATE seat set is_booked=TRUE where seat_number = ? AND show_id = ?");
                preparedStatement.setString(1, seat);
                preparedStatement.setInt(2, showId);
                preparedStatement.executeUpdate();
            }

            double seatPrice = 200.0;
            double totalPrice = selectedSeats.size() * seatPrice;
            PreparedStatement preparedStatement = connection.prepareStatement(
                    "insert into bookings (user_id, show_id, seats_booked, total_price) values (?,?,?,?)");
            preparedStatement.setInt(1, userId);
            preparedStatement.setInt(2, showId);
            preparedStatement.setString(3, String.join(",", selectedSeats));
            preparedStatement.setDouble(4, totalPrice);
            preparedStatement.executeUpdate();
            connection.commit();
            System.out.println("Booking Successfully, Seats: " + selectedSeats + " | Total Price: " + totalPrice);
        }
        catch (SQLException e){
            e.printStackTrace();
        }
    }
}
