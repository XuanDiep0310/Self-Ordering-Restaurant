package com.utc2.cntt.major_assignment.self_ordering_restaurant.service;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.LoginRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.request.UserRequestDTO.RegisterRequestDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.AuthResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.dto.response.LoginResponseDTO;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Staff;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.Users;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.StaffStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.UserStatus;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.entity.enums.UserType;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.exception.ResourceExistsException;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.StaffRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.repository.UserRepository;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.service.impl.AuthServiceImpl;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.utils.JwtUtilsHelper;
import com.utc2.cntt.major_assignment.self_ordering_restaurant.utils.ValidationUtils;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AuthService implements AuthServiceImpl {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private JwtUtilsHelper jwtUtilsHelper;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    @Transactional
    public AuthResponseDTO registerStaff(RegisterRequestDTO request) {
        // Kiểm tra dữ liệu đầu vào bổ sung
        if(!ValidationUtils.isValidUsername(request.getUsername())) {
            throw new ValidationException("Invalid username format");
        }

        if (!ValidationUtils.isValidEmail(request.getEmail())) {
            throw new ValidationException("Invalid email format");
        }

        if (!ValidationUtils.isValidPhone(request.getPhone())) {
            throw new ValidationException("Invalid phone number format");
        }

        if (!ValidationUtils.isPasswordLongEnough(request.getPassword(), 8)) {
            throw new ValidationException("Password must be at least 8 characters");
        }

        // Kiểm tra password strength nếu cần
        if (!ValidationUtils.isStrongPassword(request.getPassword())) {
            throw new ValidationException("Password must include uppercase, lowercase, digit and special character");
        }

        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceExistsException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceExistsException("Email already exists");
        }

        Users user = new Users();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setUserType(UserType.STAFF);
        user.setStatus(UserStatus.Active);
        user.setCreateAt(LocalDateTime.now());

        Users savedUser = userRepository.save(user);

        // Create staff profile instead of customer profile
        Staff staff = new Staff();
        staff.setUser(savedUser);
        staff.setFullname(request.getFullname());
        staff.setHireDate(LocalDate.now());
        staff.setPosition(request.getPosition() != null ? request.getPosition() : "New Staff");
        staff.setSalary(request.getSalary() != null ? request.getSalary() : 0L);
        staff.setStatus(StaffStatus.Active);
        staffRepository.save(staff);

        // Generate tokens
        String accessToken = jwtUtilsHelper.generateToken(savedUser.getUsername(), String.valueOf(savedUser.getUserType()));

        // Return response
        AuthResponseDTO response = new AuthResponseDTO();
        response.setAccessToken(accessToken);
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setPhone(savedUser.getPhone());
        response.setUserType(savedUser.getUserType().name());

        return response;
    }
}
