package com.example.survey.entity;

import java.io.Serializable;

@SuppressWarnings("serial")
public class FeedbackId implements Serializable{
	
	private String email;
	
	private int quizId;
	
	private int questionId;

	public FeedbackId() {
		super();
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getQuizId() {
		return quizId;
	}

	public void setQuizId(int quizId) {
		this.quizId = quizId;
	}

	public int getQuestionId() {
		return questionId;
	}

	public void setQuestionId(int questionId) {
		this.questionId = questionId;
	}
	
	
}
