package com.pragesh.merogunaso.service;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8081", "http://192.168.1.70:8081", "http://192.168.1.106:8081") // Cors Allowing my front-end
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}