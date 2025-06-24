package com.example.survey.vo;

import java.time.LocalDate;

import org.springframework.util.StringUtils;

public class SearchReq {
	
	private String quizTitle;
	
	private LocalDate startDate; 
	
	private LocalDate endDate;
	
	public void init() {
		if(!StringUtils.hasText(quizTitle)) {
			quizTitle = "";
		}
        if (this.startDate == null) {
        	this.startDate = LocalDate.of(1970, 1, 1);
        }
        if (this.endDate == null) {
        	this.endDate = LocalDate.of(2999, 12, 31);
        }
    }
	
	public SearchReq(String quizTitle, LocalDate startDate, LocalDate endDate) {
		super();
		this.quizTitle = quizTitle;
		this.startDate = startDate;
		this.endDate = endDate;
		
	}

	public SearchReq() {
		super();

	}

	public String getQuizTitle() {
		return quizTitle;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}
	
	

}
