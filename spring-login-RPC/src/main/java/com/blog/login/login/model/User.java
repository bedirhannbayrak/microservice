package com.blog.login.login.model;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity(name = "users")
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private int id;

    @Column(unique = true,nullable = false)
    @NotBlank
    @Size(min = 6)
    private String username;


    @Column(nullable = false)
    @NotBlank
    @Size(min = 6)
    private String password;

}
