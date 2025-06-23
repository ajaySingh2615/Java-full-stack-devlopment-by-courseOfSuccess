package org.sortoutinnovation.blogapplication.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be under 255 characters")
    private String title;

    @Column(length = 10000)
    @NotBlank(message = "content is required")
    private String content;

    @NotBlank(message = "Author is required")
    private String author;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
