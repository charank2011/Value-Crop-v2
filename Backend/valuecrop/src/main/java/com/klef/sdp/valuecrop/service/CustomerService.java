package com.klef.sdp.valuecrop.service;

import com.klef.sdp.valuecrop.entity.Customer;

public interface CustomerService {
	public String signup(Customer c);
	public Customer login(String email, String password) throws Exception;
}
