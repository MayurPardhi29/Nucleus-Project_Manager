package com.mayur.nucleusbackend.security;

import com.mayur.nucleusbackend.entity.User;
import com.mayur.nucleusbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository
                .findByUsernameAndDeletedAtIsNull(
                        username
                )
                .orElseThrow(
                        () -> new UsernameNotFoundException(
                                "Invalid username or password"
                        )
                );

        if (!user.isActive()) {
            throw new UsernameNotFoundException(
                    "Invalid username or password"
            );
        }

        // FIX: Return the User entity itself since it implements UserDetails
        return user;
    }
}