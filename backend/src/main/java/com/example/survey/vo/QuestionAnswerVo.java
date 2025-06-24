package com.example.survey.vo;

import java.util.List;

public class QuestionAnswerVo extends QuestIdAnswersVo{
	
	private String questionTitle;

	public QuestionAnswerVo(int questId, String questionTitle, List<String> answers) {
		super(questId, answers);
		this.questionTitle = questionTitle;
	}

	public QuestionAnswerVo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getQuestionTitle() {
		return questionTitle;
	}

	public void setQuestionTitle(String questionTitle) {
		this.questionTitle = questionTitle;
	}
	
	
	
}
