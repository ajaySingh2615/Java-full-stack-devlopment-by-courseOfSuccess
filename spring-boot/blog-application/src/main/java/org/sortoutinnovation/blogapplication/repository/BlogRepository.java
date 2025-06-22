package org.sortoutinnovation.blogapplication.repository;

import org.sortoutinnovation.blogapplication.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Long, Blog> {
    // You can add custom query methods later if needed
}
