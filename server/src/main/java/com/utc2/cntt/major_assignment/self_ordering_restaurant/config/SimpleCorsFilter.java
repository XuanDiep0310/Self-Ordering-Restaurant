package com.utc2.cntt.major_assignment.self_ordering_restaurant.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        // Ghi log để debug
        System.out.println("CORS Filter processing: " + request.getMethod() + " " + request.getRequestURI());

        // Cấu hình CORS headers cho response
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // Nếu là OPTIONS request, trả về OK ngay lập tức
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            System.out.println("Responding to OPTIONS request with 200 OK");
            response.setStatus(HttpServletResponse.SC_OK);
            return; // Kết thúc xử lý ngay, không chuyển xuống chain
        }

        // Tiếp tục chuỗi filter
        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}