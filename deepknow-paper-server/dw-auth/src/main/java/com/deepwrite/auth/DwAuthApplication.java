package com.deepwrite.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;

@SpringBootApplication
@EnableDiscoveryClient
@EnableDubbo
@ComponentScan("com.deepwrite")
public class DwAuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(DwAuthApplication.class, args);
    }
}
