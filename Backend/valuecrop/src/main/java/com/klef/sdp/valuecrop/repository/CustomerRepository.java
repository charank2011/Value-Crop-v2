package com.klef.sdp.valuecrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.sdp.valuecrop.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
	Customer findByEmailAndPassword(String email, String password);
	Customer findByEmail(String email);

}
