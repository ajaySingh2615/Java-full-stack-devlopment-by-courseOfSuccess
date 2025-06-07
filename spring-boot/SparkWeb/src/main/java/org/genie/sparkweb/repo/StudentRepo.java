package org.genie.sparkweb.repo;

import org.genie.sparkweb.dto.Student;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class StudentRepo {

    List<Student> studentList = new ArrayList<>();

    public List<Student> getAllStudent() {
        Student s1 = new Student(1, "Ayush", "delhi", "JFS");
        Student s2 = new Student(2, "Ravi", "Mumbai", "JFS");
        Student s3 = new Student(3, "Priya", "Bangalore", "JFS");
        Student s4 = new Student(4, "Anjali", "Chennai", "JFS");
        Student s5 = new Student(5, "Rahul", "Kolkata", "JFS");
        Student s6 = new Student(6, "Sneha", "Hyderabad", "JFS");
        Student s7 = new Student(7, "Amit", "Pune", "JFS");
        Student s8 = new Student(8, "Neha", "Ahmedabad", "JFS");
        Student s9 = new Student(9, "Vikram", "Jaipur", "JFS");
        Student s10 = new Student(10, "Kiran", "Lucknow", "JFS");
        Student s11 = new Student(11, "Meena", "Chandigarh", "JFS");

        studentList.add(s1);
        studentList.add(s2);
        studentList.add(s3);
        studentList.add(s4);
        studentList.add(s5);
        studentList.add(s6);
        studentList.add(s7);
        studentList.add(s8);
        studentList.add(s9);
        studentList.add(s10);
        studentList.add(s11);

        return studentList;
    }

    public void saveStudent(Student student) {
        studentList.add(student);
        System.out.println("student saved!");
    }

    public void deleteStudentById(int id) {
        for (Student student : studentList) {
            if (student.getId() == id) {
                studentList.remove(student);
                System.out.println("Student Deleted!");
            }
        }
    }
}
