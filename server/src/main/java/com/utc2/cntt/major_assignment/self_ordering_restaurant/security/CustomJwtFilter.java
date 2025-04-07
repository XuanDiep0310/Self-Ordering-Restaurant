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

    // Whitelist paths that don't need authentication
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
        String method = request.getMethod();

        // Enhanced debug logging
        System.out.println("Request: " + method + " " + requestPath);

        // Always skip authentication for OPTIONS requests (CORS preflight)
        if ("OPTIONS".equals(method)) {
            System.out.println("Skipping filter for OPTIONS request");
            return true;
        }

        // Check if path is in whitelist
        boolean shouldSkip = AUTH_WHITELIST.stream()
                .anyMatch(path -> pathMatcher.match(path, requestPath));

        System.out.println("Path in whitelist? " + shouldSkip);
        return shouldSkip;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // Bỏ qua request OPTIONS
            if (request.getMethod().equals("OPTIONS")) {
                filterChain.doFilter(request, response);
                return;
            }

            // Ghi log URL đang được truy cập
            System.out.println("JWT Filter processing request to: " + request.getRequestURI());

            String token = getTokenFromHeader(request);
            // Ghi log token (ẩn một phần để bảo mật)
            if (token != null) {
                System.out.println("Token from request: " + token.substring(0, Math.min(15, token.length())) + "...");
            } else {
                System.out.println("No token found in request");
            }

            if(token != null && jwtUtilsHelper.verifyToken(token)) {
                String username = jwtUtilsHelper.extractUsername(token);
                String role = jwtUtilsHelper.extractRole(token);
                System.out.println("Token valid for user: " + username + " with role: " + role);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    // Ghi log chi tiết về userDetails
                    System.out.println("UserDetails loaded: " + userDetails.getUsername());
                    System.out.println("Authorities: " + userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Authentication set in SecurityContext");
                } else {
                    System.out.println("Username null or authentication already in context");
                }
            } else if (token != null) {
                System.out.println("Token validation failed");
            }
        } catch (Exception e) {
            System.out.println("Authentication error: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("Authorization header: " + bearerToken);

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}