package com.utc2.cntt.major_assignment.self_ordering_restaurant;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class JwtSecretKeyGenerator {
    public static void main(String[] args) {
        SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        String encrypted = Encoders.BASE64.encode(secretKey.getEncoded());
        System.out.println(encrypted);
    }
}
