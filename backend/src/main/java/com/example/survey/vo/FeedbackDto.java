package com.example.survey.vo;

import java.time.LocalDateTime;

// 命名 DTO 表示這些資料從 DB而來，一個Entity只能裝載一張表，想要進行跨表操作，要借用DTO

public class FeedbackDto {
	
	private int quizId;
	
	private String title;
	
	private String description;
	
	private String userName;
	
	private String email;
	
	private int age;
	
	private String gender;
	
	private int questId;
	
	private String questionTitle;
	
	private String answers;
	
	private LocalDateTime fillinTime;

	public FeedbackDto() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FeedbackDto(int quizId, String title, String description, String userName, String email, int age,
			String gender, String answers, LocalDateTime fillinTime, int questId, String questionTitle) {
		super();
		this.quizId = quizId;
		this.title = title;
		this.description = description;
		this.userName = userName;
		this.email = email;
		this.age = age;
		this.gender = gender;
		this.questId = questId;
		this.questionTitle = questionTitle;
		this.answers = answers;
		this.fillinTime = fillinTime;
	}

	public int getQuizId() {
		return quizId;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
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

	public int getQuestId() {
		return questId;
	}

	public String getQuestionTitle() {
		return questionTitle;
	}

	public String getAnswers() {
		return answers;
	}

	public LocalDateTime getFillinTime() {
		return fillinTime;
	}
	
	
	
}