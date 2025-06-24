package com.example.survey.service.ifs;

import com.example.survey.vo.BasicRes;
import com.example.survey.vo.CreateReq;
import com.example.survey.vo.DeleteReq;
import com.example.survey.vo.GetQuestionsRes;
import com.example.survey.vo.SearchReq;
import com.example.survey.vo.SearchRes;
import com.example.survey.vo.UpdateReq;

public interface QuizService {
	
	// 創建問卷
	public BasicRes create(CreateReq req);
	
	// 得到 publish is true 問卷
	public SearchRes getAllPublishTrue(boolean isPublish); 
	
	// 得到 特定帳號 問卷
	public SearchRes getQuizByAccount(String account);
	
	// 得到 id 問卷
	public SearchRes getQuizById(int id);
	
	// 搜尋問卷 (標題、開始日期、結束日期)
	public SearchRes search(SearchReq req);
	
	// 獲取所有 問卷選項 (id)
	public GetQuestionsRes getQuestionById(int id);
	
	// 更新 問卷
	public BasicRes update(UpdateReq req);
	
	// 刪除 問卷
	public BasicRes delete(DeleteReq req);
	
}
