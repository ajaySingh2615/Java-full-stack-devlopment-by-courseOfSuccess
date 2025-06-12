package org.cadt.ecom.service;

import org.cadt.ecom.model.User;
import org.cadt.ecom.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        try{
            User newUser = userRepository.save(user);
            System.out.println(newUser + " register successfully!");
            return newUser;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public User loginUser(String email, String password) {
        //check if user is there or not
        User user = userRepository.findByEmail(email);
        if(user != null && user.getPassword().equals(password)){
            return user;
        }
        return null; //invalid credentials
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
