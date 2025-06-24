package com.example.survey.vo;

import com.example.survey.entity.User;

public class UserReq extends User{

	public UserReq() {
		super();
	}

	public UserReq(String account, String password, String email) {
		super(account, password, email);
	}
	
	
}
