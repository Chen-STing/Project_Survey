package com.example.survey.entity;

import com.example.survey.constants.ResMessage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;

@Entity
@IdClass(value = QuestionId.class)
@Table(name = "question")
public class Question {
	
	@Id
	@Column(name = "quiz_id")
	private int quizId;
	
	@Min(value = 1, message = ResMessage.ConstantsMessage.PARAM_ID_ERROR)
	@Id
	@Column(name = "quest_id")
	private int questId;
	
	@NotBlank(message = ResMessage.ConstantsMessage.PARAM_TITLE_ERROR)
	@Column(name = "question_title")
	private String questionTitle;
	
	@NotBlank(message = ResMessage.ConstantsMessage.PARAM_TYPE_ERROR)
	@Column(name = "type")
	private String type;
	
	// 只有 單、多選才有選項，文字、評量 沒有
	@Column(name = "options")
	private String options;

	public Question() {
		super();
	}

	public Question(int quizId, int questId, String questionTitle, String type, String options) {
		super();
		this.quizId = quizId;
		this.questId = questId;
		this.questionTitle = questionTitle;
		this.type = type;
		this.options = options;
	}
	
	public Question(int questId, String questionTitle, String type, String options) {
		super();
		this.questId = questId;
		this.questionTitle = questionTitle;
		this.type = type;
		this.options = options;
	}


	public int getQuestId() {
		return questId;
	}

	public int getQuizId() {
		return quizId;
	}

	public String getQuestionTitle() {
		return questionTitle;
	}

	public String getType() {
		return type;
	}

	public String getOptions() {
		return options;
	}

	
	
	
}
