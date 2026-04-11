package com.klef.sdp.valuecrop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="farmer_table")

public class Farmer {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	
	private Long id;
	
	@Column(nullable=false)
	private String name;
	@Column(nullable=false)
	private String password; 
	@Column(unique=true,nullable=false)
	private String email;
	@Override
	public String toString() {
		return "Farmer [id=" + id + ", name=" + name + ", password=" + password + ", email=" + email + ", contact="
				+ contact + ", gender=" + gender + ", age=" + age + ", address=" + address + "]";
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	@Column(unique=true,nullable = false)
	private String contact;
	@Column (nullable=false)
	private String gender; 
	@Column (nullable=false)
	private int age; 
	@Column(nullable=false)
	private String address;
	
	@Column(nullable=false)
	private String status = "PENDING";
	
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
}
