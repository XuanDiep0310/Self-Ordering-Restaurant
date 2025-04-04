package com.utc2.cntt.major_assignment.self_ordering_restaurant.utils;

import java.util.regex.Pattern;

/**
 * Utility class for validation patterns and methods
 */
public class ValidationUtils {

    // Regex patterns
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    public static final String PHONE_REGEX = "^(\\+\\d{1,3}( )?)?((\\(\\d{1,3}\\))|\\d{1,3})[- .]?\\d{3,4}[- .]?\\d{4}$"; // Hỗ trợ nhiều định dạng số điện thoại
    public static final String USERNAME_REGEX = "^[a-zA-Z0-9_]{3,50}$"; // Ví dụ: chỉ chấp nhận chữ, số và dấu gạch dưới, độ dài 3-50
    public static final String PASSWORD_REGEX = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$"; // Mật khẩu mạnh

    // Compiled patterns cho hiệu suất tốt hơn khi sử dụng nhiều lần
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
    private static final Pattern PHONE_PATTERN = Pattern.compile(PHONE_REGEX);
    private static final Pattern USERNAME_PATTERN = Pattern.compile(USERNAME_REGEX);
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    /**
     * Kiểm tra email có đúng định dạng
     * @param email chuỗi email cần kiểm tra
     * @return true nếu email hợp lệ, false nếu không hợp lệ
     */
    public static boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Kiểm tra số điện thoại có đúng định dạng
     * @param phone chuỗi số điện thoại cần kiểm tra
     * @return true nếu số điện thoại hợp lệ, false nếu không hợp lệ
     */
    public static boolean isValidPhone(String phone) {
        if (phone == null) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * Kiểm tra username có đúng định dạng
     * @param username chuỗi username cần kiểm tra
     * @return true nếu username hợp lệ, false nếu không hợp lệ
     */
    public static boolean isValidUsername(String username) {
        if (username == null) {
            return false;
        }
        return USERNAME_PATTERN.matcher(username).matches();
    }

    /**
     * Kiểm tra password có đủ mạnh
     * @param password chuỗi password cần kiểm tra
     * @return true nếu password đủ mạnh, false nếu không đủ mạnh
     */
    public static boolean isStrongPassword(String password) {
        if (password == null) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }

    /**
     * Kiểm tra độ dài của password
     * @param password chuỗi password cần kiểm tra
     * @param minLength độ dài tối thiểu
     * @return true nếu password đủ dài, false nếu quá ngắn
     */
    public static boolean isPasswordLongEnough(String password, int minLength) {
        return password != null && password.length() >= minLength;
    }
}
