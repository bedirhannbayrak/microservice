package com.blog.login.login;

import com.blog.login.login.model.User;
import com.blog.login.login.model.UserReq;
import com.blog.login.login.model.UserRes;
import com.blog.login.login.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;

import java.io.IOException;

@SpringBootApplication
@RequiredArgsConstructor
public class LoginApplication {

    private static final String RPC_QUEUE_NAME = "rpc_queue";
    private final Channel channel;
    private final ObjectMapper objectMapper;
    private final UserService userService;

    public static void main(String[] args) throws Exception {

        ConfigurableApplicationContext context = SpringApplication.run(LoginApplication.class,
                args);
        context.close();
    }

    private void runDemo() throws Exception {
        setupCallbacks();
    }

    private void setupCallbacks() {
        try {
            channel.queueDeclare(RPC_QUEUE_NAME, false, false, false, null);
            channel.queuePurge(RPC_QUEUE_NAME);

            channel.basicQos(1);

            System.out.println(" [x] Awaiting RPC requests");

            Object monitor = new Object();
            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                AMQP.BasicProperties replyProps = new AMQP.BasicProperties
                        .Builder()
                        .correlationId(delivery.getProperties().getCorrelationId())
                        .build();

                String response = "";
                String requestType = "";
                UserReq userReq = null;
                User user;

                try {
                    String message = new String(delivery.getBody(), "UTF-8");
                    System.out.println(" [.] " + message);
                    userReq = objectMapper.readValue(message, UserReq.class);
                    requestType = userReq.getRequestType();

                } catch (RuntimeException e) {
                    System.out.println(" [.] " + e.toString());
                } finally {
                    if (requestType.equals("login")) {
                        response = "giriş işlemi başarılı";
                        user = userService.login(userReq);
                        UserRes userRes;
                        if (user != null && user.getPassword().equals(userReq.getPassword())) {
                            userRes =
                                    UserRes.builder().username(user.getUsername()).id(user.getId()).status("success").build();
                            response = objectMapper.writeValueAsString(userRes);
                        }else {
                            userRes = UserRes.builder().status("fail").build();
                            response = objectMapper.writeValueAsString(userRes);
                        }
                        channel.basicPublish("", delivery.getProperties().getReplyTo(), replyProps, response.getBytes("UTF-8"));
                        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                    }else if (requestType.equals("register")) {
                        user = userService.saveUser(userReq);
                        if (user != null) {
                            response = objectMapper.writeValueAsString(UserRes.builder()
                                    .status("success")
                                    .username(user.getUsername())
                                    .id(user.getId())
                                    .build());
                        }else{
                            response = objectMapper.writeValueAsString(UserRes.builder().status("fail").build());
                        }

                        channel.basicPublish("", delivery.getProperties().getReplyTo(), replyProps, response.getBytes("UTF-8"));
                        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                    }else {
                        response = objectMapper.writeValueAsString(UserRes.builder().status("Bilinmeyen bir istek").build());
                        channel.basicPublish("", delivery.getProperties().getReplyTo(), replyProps, response.getBytes("UTF-8"));
                        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                    }
                    synchronized (monitor) {
                        monitor.notify();
                    }
                }
            };

            channel.basicConsume(RPC_QUEUE_NAME, false, deliverCallback, (consumerTag -> {
                System.out.println("deliver callback test");
            }));

            while (true) {
                synchronized (monitor) {
                    try {
                        monitor.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Bean
    public ApplicationRunner runner() {
        return args -> runDemo();
    }

}