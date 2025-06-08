package org.genie.service;

import org.genie.entity.Employee;
import org.genie.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    EmployeeRepo employeeRepo;

    public List<Employee> getAllEmployee(){
        return employeeRepo.findAll();
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepo.save(employee);
    }
}
