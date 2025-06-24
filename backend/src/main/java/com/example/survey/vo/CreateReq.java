package com.example.survey.vo;

import java.time.LocalDate;
import java.util.List;

import com.example.survey.constants.ResMessage;
import com.example.survey.entity.Question;
import com.example.survey.entity.Quiz;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public class CreateReq extends Quiz{
	
	
	@Valid
	@NotEmpty(message = ResMessage.ConstantsMessage.PARAM_QUESTION_LIST_ERROR)
	private List<Question> questionList;

	public CreateReq() {
		super();
	}


	public CreateReq(String title, String description, LocalDate startDate, LocalDate endDate, boolean published,
			String userAccount, List<Question> questionList) {
		super(title, description, startDate, endDate, published, userAccount);
		this.questionList = questionList;
	}



	public CreateReq(List<Question> questionList) {
		super();
		this.questionList = questionList;
	}


	public CreateReq(String title, String description, LocalDate startDate, LocalDate endDate, boolean published,
			String userAccount) {
		super(title, description, startDate, endDate, published, userAccount);
	}


	public List<Question> getQuestionList() {
		return questionList;
	}
	
	
	

}
