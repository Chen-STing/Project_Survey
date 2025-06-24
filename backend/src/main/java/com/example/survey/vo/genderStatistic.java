package com.example.survey.vo;

import java.math.BigDecimal;

public class genderStatistic {
	
	private String gender;
	
	private BigDecimal count;

	public genderStatistic() {
		super();
		// TODO Auto-generated constructor stub
	}

	public genderStatistic(String gender, BigDecimal count) {
		super();
		this.gender = gender;
		this.count = count;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public BigDecimal getCount() {
		return count;
	}

	public void setCount(BigDecimal count) {
		this.count = count;
	}
	
	
}
