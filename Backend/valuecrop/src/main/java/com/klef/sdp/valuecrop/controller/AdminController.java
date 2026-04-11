package com.klef.sdp.valuecrop.controller;

import java.net.ResponseCache;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.klef.sdp.valuecrop.entity.Admin;
import com.klef.sdp.valuecrop.service.AdminService;
import com.klef.sdp.valuecrop.security.JwtUtil;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping ("/admincontroller")
@CrossOrigin(origins="*")
public class AdminController {
	@Autowired
	public AdminService adminservice;
	
	@Autowired
	private JwtUtil jwtUtil; 
	
	@Autowired
	public com.klef.sdp.valuecrop.repository.FarmerRepository farmerRepo;

	@RequestMapping(value="/login",method = RequestMethod.POST)
	public ResponseEntity<?> verifyadminlogin(@RequestBody Admin a) {
		try {
			Admin ab = adminservice.verifyAdminLogin(a.getUsername(), a.getPassword());
			String token = jwtUtil.generateToken(ab.getUsername(), "ADMIN");
			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("user", ab);
			return ResponseEntity.status(200).body(response);
		}
		catch (Exception e){
            if ("Password Incorrect".equals(e.getMessage())) {
                return ResponseEntity.status(401).body(e.getMessage());
            }
			return ResponseEntity.status(404).body(e.getMessage());
		}
	}

	@RequestMapping(value="/approvefarmer/{id}",method = RequestMethod.PUT)
	public ResponseEntity<?> approveFarmer(@PathVariable("id") Long id) {
		java.util.Optional<com.klef.sdp.valuecrop.entity.Farmer> op = farmerRepo.findById(id);
		if(op.isPresent()) {
			com.klef.sdp.valuecrop.entity.Farmer f = op.get();
			f.setStatus("APPROVED");
			farmerRepo.save(f);
			return ResponseEntity.status(200).body("Farmer Approved");
		}
		return ResponseEntity.status(404).body("Farmer not found");
	}
	
	@RequestMapping(value="/pendingfarmers", method = RequestMethod.GET)
	public ResponseEntity<?> getPendingFarmers() {
	    java.util.List<com.klef.sdp.valuecrop.entity.Farmer> all = farmerRepo.findAll();
	    all.removeIf(f -> !"PENDING".equals(f.getStatus()));
	    return ResponseEntity.status(200).body(all);
	}
	@RequestMapping(value="/viewallproducts", method=RequestMethod.GET)
	public ResponseEntity<?> viewAllProducts() {
		return ResponseEntity.status(200).body(adminservice.viewAllProducts());
	}

	@RequestMapping(value="/viewallfarmers", method=RequestMethod.GET)
	public ResponseEntity<?> viewAllFarmers() {
		return ResponseEntity.status(200).body(adminservice.viewAllFarmers());
	}

	@RequestMapping(value="/viewallcustomers", method=RequestMethod.GET)
	public ResponseEntity<?> viewAllCustomers() {
		return ResponseEntity.status(200).body(adminservice.viewAllCustomers());
	}

}
