package com.example.survey.vo;

import java.time.LocalDateTime;
import java.util.List;

public class FeedbackUserInfoVo {
	
	private String userName;
	
	private String email;
	
	private int age;
	
	private String gender;
	
	private List<QuestionAnswerVo> questAnswerList;
	
	private LocalDateTime fillinTime;

	public FeedbackUserInfoVo() {
		super();
	}

	public FeedbackUserInfoVo(String userName, String email, int age, String gender,
			List<QuestionAnswerVo> questAnswerList, LocalDateTime fillinTime) {
		super();
		this.userName = userName;
		this.email = email;
		this.age = age;
		this.gender = gender;
		this.questAnswerList = questAnswerList;
		this.fillinTime = fillinTime;
	}

	public String getUserName() {
		return userName;
	}

	public String getEmail() {
		return email;
	}

	public int getAge() {
		return age;
	}

	public String getGender() {
		return gender;
	}

	public List<QuestionAnswerVo> getQuestAnswerList() {
		return questAnswerList;
	}

	public LocalDateTime getFillinTime() {
		return fillinTime;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public void setQuestAnswerList(List<QuestionAnswerVo> questAnswerList) {
		this.questAnswerList = questAnswerList;
	}

	public void setFillinTime(LocalDateTime fillinTime) {
		this.fillinTime = fillinTime;
	}
	
	
}
