package com.klef.sdp.valuecrop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.sdp.valuecrop.entity.Farmer;
import com.klef.sdp.valuecrop.entity.Product;
import com.klef.sdp.valuecrop.repository.FarmerRepository;
import com.klef.sdp.valuecrop.repository.ProductRepository;

@Service
public class FarmerServiceImpli implements FarmerService{
	@Autowired
	FarmerRepository fr;
	

	@Override
	public String signup(Farmer f) {
		fr.save(f);
		return "Account created successfull ";
	}

	@Override
	public Farmer login(String email, String password) throws Exception {
			Farmer fm = fr.findByEmail(email);
			if (fm == null) throw new Exception("Farmer not found");
			if (!fm.getPassword().equals(password)) throw new Exception("Password Incorrect");
			if ("APPROVED".equals(fm.getStatus())) {
			    return fm;
			}
			throw new Exception("Account Pending Approval");
	}
   @Autowired
   ProductRepository pr; 
	@Override
	
	public String addproduct(Product p) {
		pr.save(p);
		
		return "Product added succesfully";
	}

	@Override
	public List<Product> Viewallproducts() {
		return pr.findAll();
	}
	
	@Override
	public String updateProduct(Product p) {
		pr.save(p);
		return "Product updated successfully";
	}

	@Override
	public String deleteProduct(Long id) {
		pr.deleteById(id);
		return "Product deleted successfully";
	}
	
	
	

}
