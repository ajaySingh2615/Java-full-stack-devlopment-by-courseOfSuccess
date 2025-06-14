package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Entity representing users in the system
 * Maps to the 'users' table in the database
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(name = "name", length = 100)
    private String name;

    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(name = "email", unique = true, length = 100)
    private String email;

    @Size(max = 255, message = "Password must not exceed 255 characters")
    @Column(name = "password", length = 255)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", referencedColumnName = "role_id")
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    @Column(name = "phone_number", unique = true, length = 15)
    private String phoneNumber;

    @Size(max = 100, message = "Google ID must not exceed 100 characters")
    @Column(name = "google_id", unique = true, length = 100)
    private String googleId;

    @Email(message = "Please provide a valid Google email address")
    @Size(max = 100, message = "Google email must not exceed 100 characters")
    @Column(name = "google_email", length = 100)
    private String googleEmail;

    @Size(max = 255, message = "Profile picture URL must not exceed 255 characters")
    @Column(name = "profile_picture", length = 255)
    private String profilePicture;

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Address> addresses;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Order> orders;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Review> reviews;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Wishlist> wishlistItems;

    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY)
    private Set<Product> createdProducts;

    // Constructors for common use cases
    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public User(String name, String email, String googleId, String googleEmail, String profilePicture, Role role) {
        this.name = name;
        this.email = email;
        this.googleId = googleId;
        this.googleEmail = googleEmail;
        this.profilePicture = profilePicture;
        this.role = role;
    }
} 