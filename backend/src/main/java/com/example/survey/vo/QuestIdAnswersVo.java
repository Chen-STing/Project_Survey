package com.example.survey.vo;

import java.util.List;

public class QuestIdAnswersVo {
	
	private int questId;
	
	private List<String> answers;


	public int getQuestId() {
		return questId;
	}

	public void setQuestId(int questId) {
		this.questId = questId;
	}

	public List<String> getAnswers() {
		return answers;
	}

	public void setAnswers(List<String> answers) {
		this.answers = answers;
	}

	public QuestIdAnswersVo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public QuestIdAnswersVo(int questId, List<String> answers) {
		super();
		this.questId = questId;
		this.answers = answers;
	}
	
	
	
}
