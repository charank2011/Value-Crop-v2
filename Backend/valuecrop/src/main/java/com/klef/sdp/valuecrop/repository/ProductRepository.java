package com.klef.sdp.valuecrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.sdp.valuecrop.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
	

}
