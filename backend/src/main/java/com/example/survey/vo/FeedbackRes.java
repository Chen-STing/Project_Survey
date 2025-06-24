package com.example.survey.vo;

import java.util.List;

public class FeedbackRes extends BasicRes{
	
	private String title;
	
	private String description;
	
	private List<FeedbackUserInfoVo> userFeedbackList;

	public FeedbackRes(int code, String message, String title, String description, List<FeedbackUserInfoVo> userFeedbackList) {
		super(code, message);
		this.title = title;
		this.description = description;
		this.userFeedbackList = userFeedbackList;
	}

	public FeedbackRes() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FeedbackRes(int code, String message) {
		super(code, message);
		// TODO Auto-generated constructor stub
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public List<FeedbackUserInfoVo> getUserFeedbackList() {
		return userFeedbackList;
	}
	
	
}
