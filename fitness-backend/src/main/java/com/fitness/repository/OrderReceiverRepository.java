package com.fitness.repository;

import com.fitness.entity.OrderReceiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OrderReceiverRepository extends JpaRepository<OrderReceiver, Long> {
    Optional<OrderReceiver> findByProductOrdersId(Long productOrdersId);
}
