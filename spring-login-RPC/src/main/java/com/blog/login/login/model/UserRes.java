package com.blog.login.login.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRes {
    public String status;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Integer id;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String username;
}
