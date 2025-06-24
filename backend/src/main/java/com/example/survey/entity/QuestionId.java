package com.example.survey.entity;

import java.io.Serializable;

@SuppressWarnings("serial")
public class QuestionId implements Serializable{
	
	private int questId;
	
	private int quizId;

	public QuestionId() {
		super();
	}


	public int getQuestId() {
		return questId;
	}

	public void setQuestid(int questId) {
		this.questId = questId;
	}

	public int getQuizId() {
		return quizId;
	}

	public void setQuizId(int quizId) {
		this.quizId = quizId;
	}
	
	
}
