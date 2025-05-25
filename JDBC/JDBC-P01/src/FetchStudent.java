import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class FetchStudent {
    public static void main(String[] args) {
        
        String url = "jdbc:mysql://localhost:3306/spark";
        String username = "root";
        String password = "password";

        String query = "select * from students";
        try {
            //1. load karo
//            Class.forName("com.mysql.cj.jdbc.Driver");
            //2. connection bana rahe hai
            Connection connection = DriverManager.getConnection(url, username, password);
            //3. create statement
            Statement statement = connection.createStatement();
            //4. execute
            ResultSet executeQuery = statement.executeQuery(query);
            //5. get result
            System.out.println("Id | Name | Age | Course");
            System.out.println("------------------------------");
            while (executeQuery.next()) {
                System.out.println(executeQuery.getInt("id" ) + " | " + 
                                executeQuery.getString("name" ) + " | " + 
                                executeQuery.getInt("age") + " | " +
                                executeQuery.getString("course") + " | ");
            }


        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
