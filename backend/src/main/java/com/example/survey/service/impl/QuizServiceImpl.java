package com.example.survey.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.survey.constants.QuestionType;
import com.example.survey.constants.ResMessage;
import com.example.survey.dao.QuestionDao;
import com.example.survey.dao.QuizDao;
import com.example.survey.entity.Question;
import com.example.survey.entity.Quiz;
import com.example.survey.service.ifs.QuizService;
import com.example.survey.vo.BasicRes;
import com.example.survey.vo.CreateReq;
import com.example.survey.vo.DeleteReq;
import com.example.survey.vo.GetQuestionsRes;
import com.example.survey.vo.SearchReq;
import com.example.survey.vo.SearchRes;
import com.example.survey.vo.UpdateReq;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

@Service
public class QuizServiceImpl implements QuizService{
	
	@Autowired QuestionDao questionDao;
	@Autowired QuizDao quizDao;
	
	// 創建問卷(quiz、question)
	// @Transactional 只抓取 RunTimeException 的錯誤，使用rollback 回到上一父層 Exception，能抓取整個類別錯誤
	@Transactional(rollbackFor = Exception.class)
	// 清除暫存資料: 只有 cacheNames 沒有 key，會把 cacheNames 是 quiz_search 的所有暫存資料清除
	// 如果是 cacheNames + key，則是只清除特定的暫存資料； key 的參數值一樣使用 #p0 來表示，但通常不會只清除特定資料
	// allEntries: 強制刪除指定的 cacheNames 底下所有 key 對應的暫存資料，預設是 false
	@CacheEvict(cacheNames = "get_all_true", allEntries = true)
	@Override
	public BasicRes create(@Valid CreateReq req) {
		// 檢查日期 開始日期不能大於結束日期
		if(req.getStartDate().isAfter(req.getEndDate())) {
			return new BasicRes(ResMessage.PARAM_DATE_ERROR.getCode(), ResMessage.PARAM_DATE_ERROR.getMessage());
		}
		// 檢查 問題選項
		BasicRes checkRes = checkQuestions(req.getQuestionList());
		if(checkRes != null) {
			return checkRes;
		}
		try {
			// 存進資料庫
			quizDao.insert(req.getTitle(), req.getDescription(), req.getStartDate(), req.getEndDate(), req.isPublished(), req.getUserAccount());
			int quizId = quizDao.selectMaxQuizId();
			for(Question item : req.getQuestionList()) {
				questionDao.insert(quizId, item.getQuestId() , item.getQuestionTitle(), item.getType(), item.getOptions());
			}
		} catch (Exception e) {
			// 將錯誤給丟出去外面，@Transactional 事務 才會生效
			throw e;
		}
		
		return new BasicRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage());
	}
	
	// 獲取 quiz publish is true 的表
	@Override
	public SearchRes getAllPublishTrue(boolean isPublish) {
		List<Quiz> list = quizDao.getAllPublishTrue(isPublish);
		return new SearchRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(), list);
	}
	
	
	// 獲取 特定id 問卷
	@Override
	public SearchRes getQuizById(int id) {
		Quiz quiz = quizDao.selectQuizId(id);
		return new SearchRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(), quiz);
	}

	// 獲取 特定帳號 的問卷
	@Override
	public SearchRes getQuizByAccount(String account) {
		List<Quiz> list = quizDao.getQuizByAccount(account);
		return new SearchRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(), list);
	}

	// 獲取 單張quiz 全部的 question
	@Override
	public GetQuestionsRes getQuestionById(int id) {
		if(id <= 0) {
			return new GetQuestionsRes(ResMessage.PARAM_ID_ERROR.getCode(), ResMessage.PARAM_ID_ERROR.getMessage());
		}
		List<Question> list = questionDao.getByQuizId(id);
		return new GetQuestionsRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(), list);
	}
	
	// 更新 quiz (先刪除舊有的，再創建新的)
	@Transactional(rollbackFor = Exception.class)
	@Override
	public BasicRes update(UpdateReq req) {
		// 檢查 quiz id 是否存在
		int quizId = req.getId();
		int count = quizDao.selectCountById(quizId);
		if(count != 1) {
			return new BasicRes(ResMessage.ID_NOT_FOUND.getCode(), ResMessage.ID_NOT_FOUND.getMessage());
		}
		// 檢查日期 開始日期不能大於結束日期
		if(req.getStartDate().isAfter(req.getEndDate())) {
			return new BasicRes(ResMessage.PARAM_DATE_ERROR.getCode(), ResMessage.PARAM_DATE_ERROR.getMessage());
		}
		// 檢查 問題選項
		BasicRes checkRes = checkQuestions(req.getQuestionList());
		if(checkRes != null) {
			return checkRes;
		}
		// 檢查 Question裡的quizId 與 Quiz的id 是否一致
		for(Question item : req.getQuestionList()) {
			if(item.getQuizId() != quizId) {
				return new BasicRes(ResMessage.QUIZ_ID_MISMATCH.getCode(), ResMessage.QUIZ_ID_MISMATCH.getMessage());
			}
		}
		try {
			// 更新問卷 > 刪除問卷所有的問題 > 並新增所有問題
			// 1 更新quiz
			quizDao.updateById(quizId, req.getTitle(), req.getDescription(), req.getStartDate(),//
					req.getEndDate(), req.isPublished(), req.getUserAccount());
			// 2 刪除舊有question
			questionDao.deleteByQuizId(quizId);
			// 3 新增所有問題
			for(Question item : req.getQuestionList()) {
				questionDao.insert(quizId, item.getQuestId() , item.getQuestionTitle(), item.getType(), item.getOptions());
			}
			
		} catch (Exception e) {
			throw e;
		}
		return new BasicRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage());
	}
	
	// 搜尋 問卷
	/**
	 * 1. cacheNames 可以當成是書本目錄的"章"，key 可以當成是書本目錄的"節"<br>
	 * 2. cacheNames 等號後面的字串名稱自定義，可以多個，多個時要使用大括號{}，例如: cacheNames = {"A", "B"}<br>
	 * 3. key 等號後面的字串，因為 req 是物件，使用 #req 會取不到參數值，
	 *     簡單點的方法是使用位置 #p0 來表示方法中第一個參數<br>
	 * 4. Cache 不支援 concat("字串1", "字串2", "字串3") 這種寫法<br>
	 *    4.1 多參數的串接，不使用 concat，直接在字串中使用加號(+)串多個參數，字串中使用單引號來表示字串<br>
	 *    4.2 concat 中非字串參數值要使用方法 toString() 轉成字串<br>
	 * 5. unless 可以翻成排除的意思，後面的字串是指會排除符合條件的 --> 排除 res 不成功，即只暫存成功時的資料<br>
	 * 6. #result: 表示方法返回的結果；即使是不同方法有不同的返回資料型態，也通用<br>
	 */
	@Cacheable(cacheNames = "get_all_true", //
			key = "#p0.quizTitle + '-' + #p0.startDate.toString() + '-' + #p0.endDate.toString()")
	@Override
	public SearchRes search(SearchReq req) {
		// 轉換值
		String quizTitle = req.getQuizTitle();
		LocalDate startDate = req.getStartDate();
		LocalDate endDate = req.getEndDate();
		// ------- 若是 SearchReq 有設置 給定預設值 則不需要以下處理 --------
		// 若是 null 或是 空白字串時，一律都轉成 空字串
		if(!StringUtils.hasText(quizTitle)) {
			quizTitle = "";
		}
		// 若 開始時間 為null 不設置，則改成最早的時間 
		if(startDate == null) {
			startDate = LocalDate.of(1970, 1, 1);
		}
		// 若 結束時間 為null 不設置，則改成最晚的時間
		if(endDate == null) {
			endDate = LocalDate.of(2999, 12, 31);
		}
		// -------------- 有給定預設值 則不用 -------------
		List<Quiz> list = quizDao.search(quizTitle, startDate, endDate);
		return new SearchRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(), list);
	}
	
	// 刪除問卷
	@Transactional(rollbackFor = Exception.class)
	@Override
	public BasicRes delete(DeleteReq req) {
		try {
			quizDao.delete(req.getQuizIdList());
			questionDao.delete(req.getQuizIdList());
		} catch (Exception e) {
			throw e;
		}
		return new BasicRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage());
	}

	
	private BasicRes checkQuestions(List<Question> list) {
		for(Question item : list) {
			// 檢查 題目類型
			if(!QuestionType.checkType(item.getType())) {
				return new BasicRes(ResMessage.QUESTION_TYPE_ERROR.getCode(), ResMessage.QUESTION_TYPE_ERROR.getMessage());
			}
			// 檢查 單選題或多選題 不得為 null、空字串、空白
			if(item.getType().equalsIgnoreCase(QuestionType.SINGLE.getType())// 
					|| item.getType().equalsIgnoreCase(QuestionType.MULTI.getType())) {
				if(!StringUtils.hasText(item.getOptions())) {
					return new BasicRes(ResMessage.OPTIONS_ERROR.getCode(), ResMessage.OPTIONS_ERROR.getMessage());
				}
			}
			// 檢查 文字題或評量題 不得有值
			if(item.getType().equalsIgnoreCase(QuestionType.TEXT.getType())// 
					|| item.getType().equalsIgnoreCase(QuestionType.STAR.getType())) {
				if(StringUtils.hasText(item.getOptions())) {
					return new BasicRes(ResMessage.OPTIONS_ERROR.getCode(), ResMessage.OPTIONS_ERROR.getMessage());
				}
			}
			// 若 type = Text、Star， 不需要後續檢查
			if(item.getType().equalsIgnoreCase(QuestionType.TEXT.getType())//
					|| item.getType().equalsIgnoreCase(QuestionType.STAR.getType())) {
				return null;
			}
			// 將選項字串轉成 List<String>: 要先確定當初創建問卷時，前端的多個選項是陣列，且使用 Stringify 轉成字串型態
			// 前端選項原本格式(陣列): ["aa","bb","cc"]
			// 檢查 單選、多選題 選項至少有2個
			ObjectMapper mapper = new ObjectMapper();
			try {
				List<String> optionsList = mapper.readValue(item.getOptions(), new TypeReference<>(){});
				if(item.getType().equalsIgnoreCase(QuestionType.SINGLE.getType())//
						|| item.getType().equalsIgnoreCase(QuestionType.MULTI.getType())) {
					if(optionsList.size() < 2) {
						return new BasicRes(ResMessage.OPTIONS_SIZE_ERROR.getCode(), ResMessage.OPTIONS_SIZE_ERROR.getMessage());
					}
				}
			} catch (Exception e) {
				return new BasicRes(ResMessage.OPTIONS_PARSE_ERROR.getCode(), ResMessage.OPTIONS_PARSE_ERROR.getMessage());
			}
		}
		return null;
		
	}

}
