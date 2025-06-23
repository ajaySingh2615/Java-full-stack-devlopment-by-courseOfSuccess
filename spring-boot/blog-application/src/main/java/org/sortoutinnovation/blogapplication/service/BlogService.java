package org.sortoutinnovation.blogapplication.service;

import jakarta.validation.Valid;
import org.sortoutinnovation.blogapplication.model.Blog;

import java.util.List;
import java.util.Optional;

public interface BlogService {
    Blog createBlog(Blog blog);

    List<Blog> getAllBlogs();

    Optional<Blog> getBlogById(Long id);

    void deleteBlogById(Long id);

    Blog updateBlog(Long id, @Valid Blog blogRequest);
}
