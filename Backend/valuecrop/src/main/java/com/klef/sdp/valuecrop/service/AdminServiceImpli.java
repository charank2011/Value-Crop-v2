package com.klef.sdp.valuecrop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.sdp.valuecrop.entity.Admin;
import com.klef.sdp.valuecrop.repository.AdminRepository;
import com.klef.sdp.valuecrop.repository.FarmerRepository;
import com.klef.sdp.valuecrop.repository.CustomerRepository;
import com.klef.sdp.valuecrop.repository.ProductRepository;
import java.util.List;
import com.klef.sdp.valuecrop.entity.Farmer;
import com.klef.sdp.valuecrop.entity.Customer;
import com.klef.sdp.valuecrop.entity.Product;
@Service 
public class AdminServiceImpli implements AdminService{
	
	@Autowired
	public AdminRepository adminrepo;

	@Autowired
	public FarmerRepository farmerRepo;

	@Autowired
	public CustomerRepository customerRepo;

	@Autowired
	public ProductRepository productRepo;
	@Override
	public Admin verifyAdminLogin(String username, String password) throws Exception {
		if ("admin@gmail.com".equals(username)) {
            if ("admin".equals(password)) {
			    Admin hardcodedAdmin = new Admin();
			    hardcodedAdmin.setUsername(username);
			    hardcodedAdmin.setPassword(password);
			    return hardcodedAdmin;
            } else {
                throw new Exception("Password Incorrect");
            }
		}
		throw new Exception("Admin not found");
	}
	
	@Override
	public List<Farmer> viewAllFarmers() {
		return farmerRepo.findAll();
	}

	@Override
	public List<Customer> viewAllCustomers() {
		return customerRepo.findAll();
	}

	@Override
	public List<Product> viewAllProducts() {
		return productRepo.findAll();
	}

}
