package com.klef.sdp.valuecrop.service;

import com.klef.sdp.valuecrop.entity.Admin;

public interface AdminService {
	public Admin verifyAdminLogin(String username , String password) throws Exception;
	public java.util.List<com.klef.sdp.valuecrop.entity.Farmer> viewAllFarmers();
	public java.util.List<com.klef.sdp.valuecrop.entity.Customer> viewAllCustomers();
	public java.util.List<com.klef.sdp.valuecrop.entity.Product> viewAllProducts();
}
