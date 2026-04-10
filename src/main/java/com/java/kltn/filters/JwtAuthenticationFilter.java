package com.java.kltn.filters;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.java.kltn.services.impl.CustomUserDetailsService;
import com.java.kltn.services.impl.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String uri = request.getRequestURI();       // robust hơn servletPath
        final String method = request.getMethod();

        try {
            // 1) Bỏ qua các path public / preflight / error
            if (isBypass(uri, method)) {
                filterChain.doFilter(request, response);
                return;
            }
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);
        
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            
            if (jwtService.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
        } catch (Exception ex) {
            // Đừng gửi 401 cho mọi lỗi bắt được; dọn context và cho chain xử lý /error
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
        }

    }

    private boolean isBypass(String uri, String method) {
        // During testing: bypass all /api/** endpoints
        if (uri.contains("/auth/login") || uri.contains("/auth/register")) return true;
        if (uri.endsWith("/auth/send-otp")) return true;
        if( uri.endsWith("/api/v1/auth/verify-otp")) return true;
        if( uri.endsWith("/api/v1/auth/reset-password-otp")) return true;
        if( uri.endsWith("/api/v1/auth/refresh-token")) return true;
        if (uri.startsWith("/uploads")) return true; // ảnh public
        if ("OPTIONS".equals(method)) return true; // CORS preflight
        if ("/error".equals(uri))     return true; // error forward

        return false;
    }
}


