package com.blog.login.login.repository;

import com.blog.login.login.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
     public User findByUsername(String username);
}
