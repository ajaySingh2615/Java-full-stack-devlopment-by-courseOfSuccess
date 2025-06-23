package org.sortoutinnovation.blogapplication.controller;

import jakarta.validation.Valid;
import org.sortoutinnovation.blogapplication.exception.ResourceNotFoundException;
import org.sortoutinnovation.blogapplication.model.Blog;
import org.sortoutinnovation.blogapplication.service.BlogService;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    // create a new bog
    @PostMapping
    public ResponseEntity<Blog> createBlog(@RequestBody @Valid Blog blog) {
        Blog savedBlog = blogService.createBlog(blog);
        return ResponseEntity.ok(savedBlog);
    }

    // Get all blogs
    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs(){
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    // Get blog by ID with exception handling
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        Blog blog = blogService.getBlogById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + id));
        return ResponseEntity.ok(blog);
    }

    // Delete by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id){
        Blog blog = blogService.getBlogById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + id));
        blogService.deleteBlogById(blog.getId());
        return ResponseEntity.noContent().build();
    }

    // update existing blog
    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable Long id, @RequestBody @Valid Blog blogRequest){
        Blog updatedBlog = blogService.updateBlog(id, blogRequest);
        return ResponseEntity.ok(updatedBlog);
    }

}
