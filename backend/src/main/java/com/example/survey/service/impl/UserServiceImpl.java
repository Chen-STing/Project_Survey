package com.example.survey.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.survey.constants.ResMessage;
import com.example.survey.dao.UserDao;
import com.example.survey.service.ifs.UserService;
import com.example.survey.vo.BasicRes;
import com.example.survey.vo.UserReq;

public class UserServiceImpl implements UserService{
	
	@Autowired UserDao userDao;

	@Override
	public BasicRes insert(UserReq req) {
		// 驗證帳號有無重複
		int count = userDao.accountCount(req.getAccount());
		if(count == 1) {
			return new BasicRes(ResMessage.ACCOUNT_EXIST.getCode(), ResMessage.ACCOUNT_EXIST.getMessage());
		}
		
		return null;
	}

}
