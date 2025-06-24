package com.example.survey.vo;

public class OptionCountVo {
	
	private String option;
	
	private int count;

	public OptionCountVo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public OptionCountVo(String option, int count) {
		super();
		this.option = option;
		this.count = count;
	}

	public String getOption() {
		return option;
	}

	public void setOption(String option) {
		this.option = option;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}
	
	
}
