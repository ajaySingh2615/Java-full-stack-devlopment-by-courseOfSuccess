package org.sortoutinnovation.blogapplication.service.impl;

import org.sortoutinnovation.blogapplication.exception.ResourceNotFoundException;
import org.sortoutinnovation.blogapplication.model.Blog;
import org.sortoutinnovation.blogapplication.repository.BlogRepository;
import org.sortoutinnovation.blogapplication.service.BlogService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;

    public BlogServiceImpl(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }


    @Override
    public Blog createBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    @Override
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    @Override
    public void deleteBlogById(Long id) {
        blogRepository.deleteById(id);
    }

    @Override
    public Blog updateBlog(Long id, Blog blogRequest) {
        Blog existingBlog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with ID: " + id));
        existingBlog.setTitle(blogRequest.getTitle());
        existingBlog.setContent(blogRequest.getContent());
        existingBlog.setAuthor(blogRequest.getAuthor());
        return blogRepository.save(existingBlog);
    }
}
