package com.example.survey.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@IdClass(value = FeedbackId.class)
@Table(name = "feedback")
public class Feedback {
	
	@Column(name = "user_name")
	private String userName;
	
	@Id
	@Column(name = "email")
	private String email;
	
	@Column(name = "age")
	private int age;
	
	@Id
	@Column(name = "quiz_id")
	private int quizId;
	
	@Id
	@Column(name = "question_id")
	private int questionId;
	
	@Column(name = "answers")
	private String answers;
	
	@Column(name = "gender")
	private String gender;
	
	@Column(name = "fillin_time")
	private LocalDateTime fillinTime;

	public Feedback() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Feedback(String userName, String email, int age, int quizId, int questionId, String answers,
			LocalDateTime fillinTime) {
		super();
		this.userName = userName;
		this.email = email;
		this.age = age;
		this.quizId = quizId;
		this.questionId = questionId;
		this.answers = answers;
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

	public int getQuizId() {
		return quizId;
	}

	public int getQuestionId() {
		return questionId;
	}

	public String getAnswers() {
		return answers;
	}

	public LocalDateTime getFillinTime() {
		return fillinTime;
	}
	
	
}
