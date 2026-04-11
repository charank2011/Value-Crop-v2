package com.klef.sdp.valuecrop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.klef.sdp.valuecrop.entity.Customer;
import com.klef.sdp.valuecrop.service.CustomerService;
import com.klef.sdp.valuecrop.security.JwtUtil;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/customer")
public class CustomerController {

	@Autowired
	public CustomerService cs;
	
	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody Customer c) {
		try{
			String value = cs.signup(c);
			return ResponseEntity.status(200).body(value);
		} catch (Exception e) { 
			return ResponseEntity.status(500).body("Internal Error");
		}
	}
		
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Customer c) {
		try{
			Customer cm = cs.login(c.getEmail(), c.getPassword());
			String token = jwtUtil.generateToken(c.getEmail(), "BUYER");
			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("user", cm);
			return ResponseEntity.status(200).body(response);
		} catch (Exception e) { 
            if ("Password Incorrect".equals(e.getMessage())) {
                return ResponseEntity.status(401).body(e.getMessage());
            }
			return ResponseEntity.status(404).body(e.getMessage());
		}
	}
}
