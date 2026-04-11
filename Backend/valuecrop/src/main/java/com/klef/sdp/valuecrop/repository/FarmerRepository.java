package com.klef.sdp.valuecrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.sdp.valuecrop.entity.Farmer;

public interface FarmerRepository extends JpaRepository<Farmer , Long >{

	Farmer findByIdAndPassword(Long id , String password);
	Farmer findByEmailAndPassword(String email , String password);
	Farmer findByEmail(String email);
	
	
}
