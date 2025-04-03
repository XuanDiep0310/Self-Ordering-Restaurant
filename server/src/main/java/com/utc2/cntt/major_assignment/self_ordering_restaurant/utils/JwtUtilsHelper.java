package com.utc2.cntt.major_assignment.self_ordering_restaurant.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtilsHelper {

    @Value("${jwt.privateKey}")
    private String privateKey;

    // Thời gian token hết hạn (24 giờ)
    private static final long JWT_EXPIRATION = 86400000;

    // Hàm sinh ra token dựa trên secret key với thời gian hết hạn
    public String generateToken(String username, String role) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public boolean verifyToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
            // Sử dụng cú pháp mới nhất của JJWT (>= 0.12.x)
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            // Nếu không có ngoại lệ được ném ra, JWT hợp lệ
            return true;
        } catch (Exception e) {
            System.out.println("Token verification failed: " + e.getMessage());
            return false;
        }
    }


    public String extractUsername(String token) {
        try {
            // Tạo khóa từ privateKey đã được mã hóa base64
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));

            // Sử dụng API mới của JJWT 0.12.x
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } catch (Exception e) {
            System.out.println("Error extracting username: " + e.getMessage());
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.get("role", String.class);
        } catch (Exception e) {
            System.out.println("Error extracting role: " + e.getMessage());
            return null;
        }
    }
}
