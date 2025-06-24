package com.example.survey.service.ifs;

import com.example.survey.vo.BasicRes;
import com.example.survey.vo.FeedbackRes;
import com.example.survey.vo.FillinReq;
import com.example.survey.vo.StatisticsRes;

public interface FeedbackService {
	
	public BasicRes fillin(FillinReq req);
	
	public FeedbackRes feedbackByQuizId(int quizId);
	
	public FeedbackRes feedback();
	
	public StatisticsRes statistics(int quizId);
}
