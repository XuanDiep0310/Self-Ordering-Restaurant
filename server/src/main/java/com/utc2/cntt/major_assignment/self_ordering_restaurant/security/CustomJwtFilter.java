package com.utc2.cntt.major_assignment.self_ordering_restaurant.security;

import com.utc2.cntt.major_assignment.self_ordering_restaurant.utils.JwtUtilsHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class CustomJwtFilter extends OncePerRequestFilter {
    @Autowired
    JwtUtilsHelper jwtUtilsHelper;

    @Autowired
    CustomUserDetailsService userDetailsService;

    // Danh sách các đường dẫn không cần xác thực
    private static final List<String> AUTH_WHITELIST = Arrays.asList(
            "/api/auth/**",
            "/api/customers/**",
            "/api/payment/**",
            "/api/orders/**",
            "/api/notifications/**",
            "/error"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String requestPath = request.getServletPath();
        // Bỏ qua filter nếu đường dẫn trong danh sách trắng
        return AUTH_WHITELIST.stream()
                .anyMatch(path -> pathMatcher.match(path, requestPath));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = getTokenFromHeader(request);
            if(token != null && jwtUtilsHelper.verifyToken(token)) {
                String username = jwtUtilsHelper.extractUsername(token);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    System.out.println("Authentication set for user: " + username + " with roles: " + userDetails.getAuthorities());
                }
            }
        } catch (Exception e) {
            System.out.println("Could not set user authentication in security context: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        System.out.println("Authorization header: " + header);
        if(StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("Token extracted: " + token.substring(0, Math.min(token.length(), 10)) + "...");
            return token;
        }
        return null;
    }
}
