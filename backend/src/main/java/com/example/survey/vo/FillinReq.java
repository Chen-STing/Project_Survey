package com.example.survey.vo;

import java.util.List;

import com.example.survey.constants.ResMessage;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class FillinReq {
	
	@Min(value = 1, message = ResMessage.ConstantsMessage.PARAM_ID_ERROR)
	private int quizId;
	
	private String name;
	
	@NotBlank(message = ResMessage.ConstantsMessage.EMAIL_IS_NECESSARY)
	private String email;
	
	private String gender;
	
	private int age;
	
	private List<QuestIdAnswersVo> answerList;

	public FillinReq() {
		super();
	}


	public FillinReq(@Min(value = 1, message = "Param id error!!") int quizId, String name,
			@NotBlank(message = "Email is necessary!!") String email, String gender, int age,
			List<QuestIdAnswersVo> answerList) {
		super();
		this.quizId = quizId;
		this.name = name;
		this.email = email;
		this.gender = gender;
		this.age = age;
		this.answerList = answerList;
	}

	public int getQuizId() {
		return quizId;
	}

	public void setQuizId(int quizId) {
		this.quizId = quizId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public List<QuestIdAnswersVo> getAnswerList() {
		return answerList;
	}

	public void setAnswerList(List<QuestIdAnswersVo> answerList) {
		this.answerList = answerList;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}
	
	
	
	
	
}
