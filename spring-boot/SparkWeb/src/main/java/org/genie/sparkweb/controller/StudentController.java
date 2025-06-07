package org.genie.sparkweb.controller;

import org.genie.sparkweb.dto.Student;
import org.genie.sparkweb.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    StudentService studentService;

    @GetMapping("/getAll")
    public List<Student> getAllStudent() {
        return studentService.getAllStudent();
    }

    @PostMapping("/save")
    public Student insertData(@RequestBody Student student) {
        System.out.println(student);
        studentService.saveStudent(student);
        return student;
    }

    @DeleteMapping("/{id}")
    public void deleteStudentById(@PathVariable int id){
        System.out.println("Student id " + id);
        studentService.deleteStudentById(id);
    }
}
