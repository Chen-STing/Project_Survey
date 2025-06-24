package com.example.survey.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.survey.service.ifs.FeedbackService;
import com.example.survey.vo.BasicRes;
import com.example.survey.vo.FeedbackRes;
import com.example.survey.vo.FillinReq;
import com.example.survey.vo.StatisticsRes;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
public class FeedbackController {
	
	@Autowired FeedbackService feedbackService;
	
	// 創建受訪資料
	@PostMapping(value = "feedback/fillin")
	public BasicRes fillin(@Valid @RequestBody FillinReq req) {
		return feedbackService.fillin(req);
	}
	
	// 獲取受訪資料
	@PostMapping(value = "feedback/get_feedback")
	public FeedbackRes feedbackByQuizId(@RequestParam(value = "quizId")int quizId) {
		return feedbackService.feedbackByQuizId(quizId);
	}
	
	// 獲取所有受訪資料
	@GetMapping(value = "feedback/get_all_feedback")
	public FeedbackRes feedback() {
		return feedbackService.feedback();
	}
	
	//獲取 單張問卷的 受訪統計資料
	@PostMapping(value = "feedback/get_statistics")
	public StatisticsRes statistics(@RequestParam(value = "quizId")int quizId) {
		return feedbackService.statistics(quizId);
	}
}
