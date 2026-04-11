package com.klef.sdp.valuecrop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.klef.sdp.valuecrop.entity.Farmer;
import com.klef.sdp.valuecrop.entity.Product;
import com.klef.sdp.valuecrop.service.FarmerService;
import com.klef.sdp.valuecrop.security.JwtUtil;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins="*")
public class FarmerController {
	@Autowired
	public FarmerService fs;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	
	@RequestMapping(value="/signup",method=RequestMethod.POST)
	public ResponseEntity<String> signup(@RequestBody Farmer f) {
		try{
			String value = fs.signup(f);
		return ResponseEntity.status(200).body(value);
		}
		catch (Exception e) { 
			return ResponseEntity.status(500).body("Backendd not connectedd");
		}
	}
		
		@RequestMapping(value="/login",method=RequestMethod.POST)
		public ResponseEntity<?> login(@RequestBody Farmer f) {
			try{
				Farmer fmm = fs.login(f.getEmail(),f.getPassword());
				String token = jwtUtil.generateToken(f.getEmail(), "FARMER");
				Map<String, Object> response = new HashMap<>();
				response.put("token", token);
				response.put("user", fmm);
			    return ResponseEntity.status(200).body(response);
			}
			catch (Exception e) { 
                if ("Password Incorrect".equals(e.getMessage()) || "Account Pending Approval".equals(e.getMessage())) {
                    return ResponseEntity.status(401).body(e.getMessage());
                }
				return ResponseEntity.status(404).body(e.getMessage());
			}
        }
			
			
			@RequestMapping(value="/addproduct",method=RequestMethod.POST)
			public ResponseEntity<?> addproduct(@RequestBody Product p) {
				try {
					String  pr = fs.addproduct(p);
				return ResponseEntity.status(200).body(pr);
				}
				catch (Exception e)
				{
					return ResponseEntity.status(500).body("Internal server Error");
				}
			}
				
				@RequestMapping(value="/viewallproducts",method=RequestMethod.GET)
				public ResponseEntity<?> viewallproducts() {
					try {
						List<Product> ls = fs.Viewallproducts();
					return ResponseEntity.status(200).body(ls);
					}
					catch (Exception e)
					{
						return ResponseEntity.status(500).body("Internal server Error");
					}
				}
				
				@RequestMapping(value="/updateproduct",method=RequestMethod.PUT)
				public ResponseEntity<?> updateproduct(@RequestBody Product p) {
					try {
						String pr = fs.updateProduct(p);
						return ResponseEntity.status(200).body(pr);
					}
					catch (Exception e) {
						return ResponseEntity.status(500).body("Internal server Error");
					}
				}
				
				@RequestMapping(value="/deleteproduct/{id}",method=RequestMethod.DELETE)
				public ResponseEntity<?> deleteproduct(@PathVariable("id") Long id) {
					try {
						String pr = fs.deleteProduct(id);
						return ResponseEntity.status(200).body(pr);
					}
					catch (Exception e) {
						return ResponseEntity.status(500).body("Internal server Error");
					}
				}
				
				
}
