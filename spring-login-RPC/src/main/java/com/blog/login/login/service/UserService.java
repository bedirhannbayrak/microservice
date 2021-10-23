package com.blog.login.login.service;

import com.blog.login.login.model.User;
import com.blog.login.login.model.UserReq;
import com.blog.login.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public User saveUser(UserReq user) {
        try {
            return userRepository.save(User.builder().username(user.getUsername()).password(user.getPassword()).build());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public User login(UserReq userReq) {
        User user = userRepository.findByUsername(userReq.getUsername());
        System.out.println(user);
        return user;
    }

}
