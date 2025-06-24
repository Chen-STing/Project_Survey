package com.example.survey.vo;

import java.util.List;

import com.example.survey.constants.ResMessage;

import jakarta.validation.constraints.NotEmpty;

public class DeleteReq {
	
	@NotEmpty(message = ResMessage.ConstantsMessage.PARAM_QUIZ_ID_LIST_ERROR)
	private List<Integer> quizIdList;

	public List<Integer> getQuizIdList() {
		return quizIdList;
	}

	public void setQuizIdList(List<Integer> quizIdList) {
		this.quizIdList = quizIdList;
	}
	
	
}
