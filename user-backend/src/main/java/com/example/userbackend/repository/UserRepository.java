package com.example.userbackend.repository;

import com.example.userbackend.database.UserDatabase;
import com.example.userbackend.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {
    public List<User> findAll() {
        return UserDatabase.users;
    }

    public Optional<User> findById(int id) {
        return UserDatabase.users
                .stream()
                .filter(user -> user.getId() == id)
                .findFirst();
    }

    public Optional<User> findByEmail(String email) {
        return UserDatabase.users
                .stream()
                .filter(user -> user.getEmail().equals(email))
                .findFirst();
    }

    public void deleteById(int id) {
        UserDatabase.users.removeIf(user -> user.getId() == id);
    }

    public void save(User user) {
        UserDatabase.users.add(user);
    }
}
