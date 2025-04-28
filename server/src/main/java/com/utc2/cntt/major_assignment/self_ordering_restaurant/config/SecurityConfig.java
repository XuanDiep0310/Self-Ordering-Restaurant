package com.utc2.cntt.major_assignment.self_ordering_restaurant.config;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.security.CustomJwtFilter;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Autowired
    CustomJwtFilter customJwtFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Đặt OPTIONS lên đầu tiên để đảm bảo nó được xử lý trước
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/customers/**").permitAll()
                        .requestMatchers("/api/payment/**").permitAll()
                        .requestMatchers("/api/orders/**").permitAll()
                        .requestMatchers("/api/notifications/**").permitAll()
                        .requestMatchers("/api/dishes/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/api/tables/**").permitAll()
                        .requestMatchers("/api/feedback/**").permitAll()
                        .requestMatchers("/error").permitAll()

                        // Staff endpoints
                        .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN")

                        // Admin endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Còn lại yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                .addFilterBefore(customJwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép tất cả các origin
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));

        // Cho phép tất cả các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Cho phép tất cả các header phổ biến
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));

        // Cho phép header Authorization được hiển thị cho frontend
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        // Cho phép credentials
        configuration.setAllowCredentials(true);

        // Cấu hình thời gian cache cho preflight
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}