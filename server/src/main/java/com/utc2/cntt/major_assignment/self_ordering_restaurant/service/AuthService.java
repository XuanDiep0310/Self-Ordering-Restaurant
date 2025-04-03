package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.LoginRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.LoginResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Users;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.UserRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.security.CustomUserDetailsService;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl.AuthServiceImpl;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.utils.JwtUtilsHelper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService implements AuthServiceImpl {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtilsHelper jwtUtilsHelper;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                throw new IllegalArgumentException("Username and password are required");
            }
            System.out.println("Login attempt for username: " + loginRequest.getUsername());

            // Lấy thông tin người dùng trước để kiểm tra
            Users user = userRepository.findByUsername(loginRequest.getUsername());
            if (user == null) {
                throw new UsernameNotFoundException("User not found with username: " + loginRequest.getUsername());
            }

            // Xác thực người dùng với username và password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword()
                    )
            );

            // Thiết lập context xác thực
            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("User successfully authenticated: " + user.getUsername());

            // Tạo JWT token với vai trò của người dùng
            String token = jwtUtilsHelper.generateToken(user.getUsername(), String.valueOf(user.getUserType()));
            System.out.println("Token generated for user: " + user.getUsername());

            // Trả về thông tin đăng nhập kèm token
            return new LoginResponseDTO(user.getUsername(), token, String.valueOf(user.getUserType()));
        } catch (UsernameNotFoundException e) {
            System.out.println("Login failed: " + e.getMessage());
            throw e;
        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials: " + e.getMessage());
            throw e;
        } catch (AuthenticationException e) {
            System.out.println("Authentication error: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("Unexpected error during login: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("An error occurred during login", e);
        }
    }

    @Override
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
