package com.klef.sdp.valuecrop.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.klef.sdp.valuecrop.entity.Farmer;
import com.klef.sdp.valuecrop.entity.Product;

@Service
public interface FarmerService {
	public String signup(Farmer f );
	public Farmer login(String email, String password) throws Exception;
	public String addproduct(Product p);
	public List<Product> Viewallproducts();	
	public String updateProduct(Product p);
	public String deleteProduct(Long id);
}
