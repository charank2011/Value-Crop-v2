package com.klef.sdp.valuecrop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.klef.sdp.valuecrop.entity.Customer;
import com.klef.sdp.valuecrop.repository.CustomerRepository;

@Service
public class CustomerServiceImpli implements CustomerService {
	@Autowired
	CustomerRepository cr;

	@Override
	public String signup(Customer c) {
		cr.save(c);
		return "Customer Account created successfully";
	}

	@Override
	public Customer login(String email, String password) throws Exception {
		Customer c = cr.findByEmail(email);
		if (c == null) throw new Exception("Customer not found");
		if (!c.getPassword().equals(password)) throw new Exception("Password Incorrect");
		return c;
	}
}
