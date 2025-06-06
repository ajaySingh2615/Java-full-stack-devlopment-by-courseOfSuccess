package org.genie.sparkweb.service;

import org.genie.sparkweb.dto.Student;
import org.genie.sparkweb.repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    StudentRepo studentRepo;

    public List<Student> getAllStudent(){
        return studentRepo.getAllStudent();
    }

    public void saveStudent(Student student) {
        studentRepo.saveStudent(student);
    }
}
