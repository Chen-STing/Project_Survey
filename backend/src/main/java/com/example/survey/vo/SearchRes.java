package com.example.survey.vo;

import java.util.List;

import com.example.survey.entity.Quiz;

public class SearchRes extends BasicRes{
	
	private Quiz quiz;
	
	private List<Quiz> quizList;

	public SearchRes() {
		super();
		
	}

	public SearchRes(int code, String message) {
		super(code, message);
		
	}

	public SearchRes(int code, String message, List<Quiz> quizList) {
		super(code, message);
		this.quizList = quizList;
	}
	
	public SearchRes(int code, String message, Quiz quiz) {
		super(code, message);
		this.quiz = quiz;
	}

	public List<Quiz> getQuizList() {
		return quizList;
	}

	public Quiz getQuiz() {
		return quiz;
	}
	
	
}
