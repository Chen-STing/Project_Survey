package com.example.survey.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.survey.service.ifs.QuizService;
import com.example.survey.vo.BasicRes;
import com.example.survey.vo.CreateReq;
import com.example.survey.vo.DeleteReq;
import com.example.survey.vo.GetQuestionsRes;
import com.example.survey.vo.SearchReq;
import com.example.survey.vo.SearchRes;
import com.example.survey.vo.UpdateReq;

import jakarta.validation.Valid;

@CrossOrigin
@RestController
public class QuizController {
	
	@Autowired QuizService quizService;
	
	// 創建問卷
	@PostMapping(value = "quiz/create")
	public BasicRes create(@Valid @RequestBody CreateReq req) {
		return quizService.create(req);
	}
	
	// 獲取 publish is true 問卷
	@PostMapping(value = "quiz/get_published")
	public SearchRes getAllPublishTrue(@RequestParam(value = "isPublish")boolean isPublish) {
		return quizService.getAllPublishTrue(isPublish);
	}
	
	// 獲取 單筆id 的問卷
	@PostMapping(value = "quiz/get_quiz")
	public SearchRes getQuizById(@RequestParam(value = "id")int id) {
		return quizService.getQuizById(id);
	}
	
	// 搜尋問卷 (標題關鍵字、開始結束日期) 僅限publish is true
	@PostMapping(value = "quiz/search")
	public SearchRes search(@RequestBody SearchReq req) {
		req.init();
		return quizService.search(req);
	}
	
	// 透過 quizId 拿到 該問卷所有選項
	// 呼叫此API  quiz/get_by_quiz_id?id=值 
	// 後面 ? key=value 
	@PostMapping(value = "quiz/get_by_quiz_id")
	public GetQuestionsRes getQuestionById(@RequestParam(value = "id")int id) {
		return quizService.getQuestionById(id);
	}
	
	// 更新 問卷
	@PostMapping(value = "quiz/update")
	public BasicRes update(@Valid @RequestBody UpdateReq req) {
		return quizService.update(req);
	}
	
	// 刪除 問卷
	@PostMapping(value = "quiz/delete")
	public BasicRes delete(@Valid @RequestBody DeleteReq req) {
		return quizService.delete(req);
	}
	
	// 透過 特定帳號 拿到問卷
	@PostMapping(value = "quiz/account")
	public SearchRes getQuizByAccount(@RequestParam(value = "account")String account) {
		return quizService.getQuizByAccount(account);
	}
}
