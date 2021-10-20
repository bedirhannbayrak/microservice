package com.blog.login.login.service;

import com.blog.login.login.model.User;
import com.blog.login.login.model.UserReq;
import com.blog.login.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public void saveUser(UserReq user) {
        userRepository.save(User.builder().username(user.getUsername()).password(user.getPassword()).build());
    }

    public User login(UserReq userReq) {
        User user = userRepository.findByUsername(userReq.getUsername());
        System.out.println(user);
        return user;
    }

}
