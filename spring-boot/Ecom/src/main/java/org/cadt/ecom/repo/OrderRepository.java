package org.cadt.ecom.repo;

import org.cadt.ecom.model.Orders;
import org.cadt.ecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    @Query(value = "select * from Orders o Join fetch o.user")
    List<Orders> findAllOrdersWithUsers();

    List<Orders> findByUser(User user);
}
