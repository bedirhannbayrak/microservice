package com.blog.login.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

@Configuration
public class Config {

    @Bean
    ConnectionFactory connectionFactory() {
        return new ConnectionFactory();
    }

    @Bean
    Connection connection() throws IOException, TimeoutException {
            return connectionFactory().newConnection();
    }

    @Bean
    Channel channel() throws IOException, TimeoutException {
            return connection().createChannel();
    }

    @Bean
    ObjectMapper objectMapper() {

        return new ObjectMapper();
    }



}
