package org.sortoutinnovation.blogapplication.service.impl;

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
}
