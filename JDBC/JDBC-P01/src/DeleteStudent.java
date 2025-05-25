import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class DeleteStudent {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/spark";
        String username = "root";
        String password = "password";

        String deleteQuery = "Delete from students where id=?";
        //jdbc -> hibernate -> jpa
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            PreparedStatement preparedStatement = connection.prepareStatement(deleteQuery);
            preparedStatement.setInt(1, 5);
            int update = preparedStatement.executeUpdate();
            if(update>0){
                System.out.println("Data deleted");
            }else{
                System.out.println("data not found!");
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
