package com.java.kltn.models.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {

    @NotBlank(message = "Mật khẩu cũ không được để trống")
    @JsonProperty("old_password")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 6, message = "Mật khẩu mới phải có ít nhất 6 ký tự")
    @JsonProperty("new_password")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống")
    @JsonProperty("confirm_password")
    private String confirmPassword;
}

