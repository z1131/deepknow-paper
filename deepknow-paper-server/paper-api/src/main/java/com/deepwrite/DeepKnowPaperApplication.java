package com.deepwrite;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan("com.deepwrite")
@MapperScan("com.deepwrite.core.mapper")
public class DeepKnowPaperApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeepKnowPaperApplication.class, args);
    }
}
