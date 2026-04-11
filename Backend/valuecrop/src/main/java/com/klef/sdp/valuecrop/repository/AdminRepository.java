package com.klef.sdp.valuecrop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.sdp.valuecrop.entity.Admin;
import com.klef.sdp.valuecrop.entity.Farmer;

public interface AdminRepository extends JpaRepository<Admin , String>{
	
	Admin findByUsernameAndPassword(String username , String password);
	

}
