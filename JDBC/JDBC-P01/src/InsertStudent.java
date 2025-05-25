import java.sql.*;

public class InsertStudent {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/spark";
        String username = "root";
        String password = "password";

        String insertQuery = "insert into students(name, age, course) values (?,?,?)";

        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            PreparedStatement preparedStatement = connection.prepareStatement(insertQuery);
            //1
            preparedStatement.setString(1, "prem");
            preparedStatement.setInt(2, 21);
            preparedStatement.setString(3, "JFS");
            //2
            preparedStatement.setString(1, "faraz");
            preparedStatement.setInt(2, 44);
            preparedStatement.setString(3, "DSC");

            preparedStatement.executeUpdate();

            System.out.println("data inserted.....");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
