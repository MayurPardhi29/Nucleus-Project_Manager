//package com.mayur.nucleusbackend.util;
//
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//
//@Component
//public class JwtUtil {
//
//    @Value("${jwt.secret:ChangeMeInProdChangeMeInProdChangeMeInProd}")
//    private String SECRET;
//
//    @Value("${jwt.expiration:36000000}")
//    private long EXPIRATION; // default 10 hours
//
//    public String generateToken(String username) {
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
//                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public String extractUsername(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    public boolean validateToken(String token, String username) {
//        try {
//            String sub = extractUsername(token);
//            return sub.equals(username) && !isTokenExpired(token);
//        } catch (JwtException | IllegalArgumentException ex) {
//            return false;
//        }
//    }
//
//    public boolean isTokenExpired(String token) {
//        Claims claims = Jwts.parserBuilder()
//                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//        return claims.getExpiration().before(new Date());
//    }
//
//    public long getExpiration() {
//        return EXPIRATION;
//    }
//}
