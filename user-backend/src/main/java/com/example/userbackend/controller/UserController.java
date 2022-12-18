package com.example.userbackend.controller;

import com.example.userbackend.model.dto.UserDto;
import com.example.userbackend.model.request.CreateUserRequest;
import com.example.userbackend.model.request.UpdateAvatarRequest;
import com.example.userbackend.model.request.UpdatePasswordRequest;
import com.example.userbackend.model.request.UpdateUserRequest;
import com.example.userbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // Lấy danh sách user
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<UserDto> userDtos = userService.getUsers();
        return ResponseEntity.ok(userDtos);
    }

    // Tìm kiếm user theo tên
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUser(@RequestParam String name) {
        List<UserDto> userDtos = userService.searchUser(name);
        return ResponseEntity.ok(userDtos);
    }

    // Lấy chi tiết user theo id
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    // Tạo user mới
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        UserDto userDto = userService.createUser(request);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    // Xóa user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Cập nhật thông tin user
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id,
                                        @RequestBody UpdateUserRequest request) {
        UserDto userDto = userService.updateUser(id, request);
        return ResponseEntity.ok(userDto);
    }

    // Cập nhật mật khẩu mới
    @PutMapping("/users/{id}/update-password")
    public ResponseEntity<?> updatePassword(@PathVariable int id,
                                            @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(id, request);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Quên mật khẩu
    @PostMapping("/users/{id}/forgot-password")
    public ResponseEntity<?> updatePassword(@PathVariable int id) {
        String password = userService.forgotPassword(id);
        return ResponseEntity.ok(password);
    }

    // Upload ảnh
    // c1 : Lưu trực tiếp vào database
    // c2 : Lưu ảnh vào 1 folder ở server -> lưu path image vào database
    // Trong trường hợp k có database : Lưu ảnh vào 1 folder ở server
    // -> sử dụng userId, fileId để tìm kiếm trong folder

    // uploads
    // 1, 2, 3 : folder tương ứng với userId
    // trong folder userId là các ảnh mà user đó upload


    // Upload file
    @PostMapping("/users/{id}/files")
    public ResponseEntity<?> uploadFile(@PathVariable int id, @ModelAttribute("file") MultipartFile file) {
        String filePath = userService.uploadFile(id, file);
        return ResponseEntity.ok(filePath);
    }

    // Xem ảnh -> byte[]
    @GetMapping("/users/{id}/files/{fileId}")
    public ResponseEntity<?> readFile(@PathVariable int id, @PathVariable String fileId) {
        byte[] bytes = userService.readFile(id, fileId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(bytes);
    }

    // Lấy danh sách ảnh
    @GetMapping("/users/{id}/files")
    public ResponseEntity<?> getFiles(@PathVariable int id) {
        List<String> files = userService.getFiles(id);
        return ResponseEntity.ok(files); // 200
    }

    // Xóa ảnh
    @DeleteMapping("/users/{id}/files/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable int id, @PathVariable String fileId) {
        userService.deleteFile(id, fileId);
        return ResponseEntity.noContent().build(); // 204
    }

    //Thay doi avartar cua user
    @PutMapping("/users/{id}/update-avatar")
    public ResponseEntity<?> updateAvarta(@PathVariable int id, @RequestBody UpdateAvatarRequest request) {
        userService.updateAvatar(id, request);
        return ResponseEntity.noContent().build(); // 204
    }
}

