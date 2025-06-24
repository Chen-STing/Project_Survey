package com.example.survey.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.survey.constants.QuestionType;
import com.example.survey.constants.ResMessage;
import com.example.survey.dao.FeedbackDao;
import com.example.survey.dao.QuestionDao;
import com.example.survey.dao.QuizDao;
import com.example.survey.entity.Feedback;
import com.example.survey.entity.Question;
import com.example.survey.service.ifs.FeedbackService;
import com.example.survey.vo.BasicRes;
import com.example.survey.vo.FeedbackDto;
import com.example.survey.vo.FeedbackRes;
import com.example.survey.vo.FeedbackUserInfoVo;
import com.example.survey.vo.FillinReq;
import com.example.survey.vo.OptionCountVo;
import com.example.survey.vo.QuestIdAnswersVo;
import com.example.survey.vo.QuestionAnswerVo;
import com.example.survey.vo.StatisticsRes;
import com.example.survey.vo.StatisticsResVo;
import com.example.survey.vo.genderStatistic;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FeedbackServiceImpl implements FeedbackService {

	private ObjectMapper mapper = new ObjectMapper();

	@Autowired
	FeedbackDao feedbackDao;

	@Autowired
	QuizDao quizDao;

	@Autowired
	QuestionDao questionDao;

	@Override
	public BasicRes fillin(FillinReq req) {
		// 檢查 quiz 填寫時間是否有效
		int quizId = req.getQuizId();
		int count = quizDao.selectCountById(quizId, LocalDate.now());
		if (count != 1) {
			return new BasicRes(ResMessage.OUT_OF_FILLIN_DATE_RANGE.getCode(),
					ResMessage.OUT_OF_FILLIN_DATE_RANGE.getMessage());
		}
		// 檢查回饋資料 同個email 同份問卷只能填寫一次
		count = feedbackDao.selectCount(quizId, req.getEmail());
		if (count != 0) {
			return new BasicRes(ResMessage.EMAIL_DUPLICATED.getCode(), ResMessage.EMAIL_DUPLICATED.getMessage());
		}
		// 檢查答案
		List<QuestIdAnswersVo> answerList = req.getAnswerList();
		List<Question> questionlist = questionDao.getByQuizId(quizId);
		// 比對問題與答案
		for (Question questItem : questionlist) {
			int questId = questItem.getQuestId();
			String type = questItem.getType();
			List<String> optionsList = new ArrayList<>();
			try {
				// 只轉換 單選&多選
				if (type.equalsIgnoreCase(QuestionType.SINGLE.getType())
						|| type.equalsIgnoreCase(QuestionType.MULTI.getType())) {
					// 數組字符串 轉換回=> 數組
					optionsList = mapper.readValue(questItem.getOptions(), new TypeReference<>() {
					});
				}
			} catch (Exception e) {
				return new BasicRes(ResMessage.OPTIONS_PARSE_ERROR.getCode(),
						ResMessage.OPTIONS_PARSE_ERROR.getMessage());
			}
			for (QuestIdAnswersVo voItem : answerList) {
				List<String> answers = new ArrayList<>();
				// 當題號相同時，把回答的值 賦予給容器中
				if (questId == voItem.getQuestId()) {
					answers = voItem.getAnswers();
					
					// 跳過 type Text、Star，因為無選項比對
					if (type.equalsIgnoreCase(QuestionType.TEXT.getType())
							|| type.equalsIgnoreCase(QuestionType.STAR.getType())) {
						continue;
					}
					// 單選時，答案不能有多個
					if (type.equalsIgnoreCase(QuestionType.SINGLE.getType()) && answers.size() > 1) {
						return new BasicRes(ResMessage.ONE_OPTION_IS_ALLOWED.getCode(),
								ResMessage.ONE_OPTION_IS_ALLOWED.getMessage());
						
					}
					// 比對同一題答案 是否在選項裡
					boolean checkRes = checkAnswer(optionsList, answers);
					if (!checkRes) {
						return new BasicRes(ResMessage.ANSWERS_OPTION_MISMATCH.getCode(),
								ResMessage.ANSWERS_OPTION_MISMATCH.getMessage());
						
					}
				}
			}

		}
		// 存資料
		for (QuestIdAnswersVo voItem : answerList) {
			// 將 List 轉換成 字串
			try {

				String answerStr = mapper.writeValueAsString(voItem.getAnswers());
				feedbackDao.insert(quizId, voItem.getQuestId(), req.getName(), req.getEmail(), req.getGender(),
						req.getAge(), answerStr);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
				return new BasicRes(ResMessage.ANSWER_PARSE_ERROR.getCode(),
						ResMessage.ANSWER_PARSE_ERROR.getMessage());
			} catch (Exception e) {
				throw e;
			}
		}
		return new BasicRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage());
	}

	@Override
	public FeedbackRes feedbackByQuizId(int quizId) {
		// 驗證 id
		if (quizId <= 0) {
			return new FeedbackRes(ResMessage.QUIZ_ID_MISMATCH.getCode(), ResMessage.QUIZ_ID_MISMATCH.getMessage());
		}
		// 撈資料
		List<FeedbackDto> res = feedbackDao.selectFeedbackByQuizId(quizId);
		// 整理資料 key 放 email
		String quizTitle = "";
		String quizDescription = "";
		Map<String, List<QuestionAnswerVo>> map = new HashMap<>();
		for (FeedbackDto dto : res) {
			quizTitle = dto.getTitle();
			quizDescription = dto.getDescription();
			String email = dto.getEmail();
			List<QuestionAnswerVo> voList = new ArrayList<>();
			if (map.containsKey(email)) {
				// 若 有對應到的key，把 value 取出
				voList = map.get(email);
			}
			QuestionAnswerVo vo = new QuestionAnswerVo();
			vo.setQuestId(dto.getQuestId());
			vo.setQuestionTitle(dto.getQuestionTitle());
			try {
				List<String> answetList = mapper.readValue(dto.getAnswers(), new TypeReference<>() {
				});
				vo.setAnswers(answetList);
			} catch (Exception e) {
				return new FeedbackRes(ResMessage.ANSWER_PARSE_ERROR.getCode(),
						ResMessage.ANSWER_PARSE_ERROR.getMessage());
			}
			voList.add(vo);
			map.put(dto.getEmail(), voList);
		}
		// 把資料 放進 格式
		List<FeedbackUserInfoVo> feedbackList = new ArrayList<>();
		a: for (FeedbackDto dto : res) {
			String email = dto.getEmail();
			for (FeedbackUserInfoVo vo : feedbackList) {
				if (email.equalsIgnoreCase(vo.getEmail())) {
					continue a;
				}
			}
			FeedbackUserInfoVo feedbackVo = new FeedbackUserInfoVo();
			feedbackVo.setUserName(dto.getUserName());
			feedbackVo.setEmail(dto.getEmail());
			feedbackVo.setGender(dto.getGender());
			feedbackVo.setAge(dto.getAge());
			feedbackVo.setFillinTime(dto.getFillinTime());
			feedbackVo.setQuestAnswerList(map.get(dto.getEmail()));
			feedbackList.add(feedbackVo);
		}
		return new FeedbackRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(), quizTitle,
				quizDescription, feedbackList);
	}

	@Override
	public FeedbackRes feedback() {
		// 撈資料
		List<FeedbackDto> res = feedbackDao.selectFeedback();
		// 整理資料 key 放 email
		String quizTitle = "";
		String quizDescription = "";
		Map<String, List<QuestionAnswerVo>> map = new HashMap<>();
		for (FeedbackDto dto : res) {
			quizTitle = dto.getTitle();
			quizDescription = dto.getDescription();
			String email = dto.getEmail();
			List<QuestionAnswerVo> voList = new ArrayList<>();
			if (map.containsKey(email)) {
				// 若 有對應到的key，把 value 取出
				voList = map.get(email);
			}
			QuestionAnswerVo vo = new QuestionAnswerVo();
			vo.setQuestId(dto.getQuestId());
			vo.setQuestionTitle(dto.getQuestionTitle());
			try {
				List<String> answetList = mapper.readValue(dto.getAnswers(), new TypeReference<>() {
				});
				vo.setAnswers(answetList);
			} catch (Exception e) {
				return new FeedbackRes(ResMessage.ANSWER_PARSE_ERROR.getCode(),
						ResMessage.ANSWER_PARSE_ERROR.getMessage());
			}
			voList.add(vo);
			map.put(dto.getEmail(), voList);
		}
		// 把資料 放進 格式
		List<FeedbackUserInfoVo> feedbackList = new ArrayList<>();
		a: for (FeedbackDto dto : res) {
			String email = dto.getEmail();
			for (FeedbackUserInfoVo vo : feedbackList) {
				if (email.equalsIgnoreCase(vo.getEmail())) {
					continue a;
				}
			}
			FeedbackUserInfoVo feedbackVo = new FeedbackUserInfoVo();
			feedbackVo.setUserName(dto.getUserName());
			feedbackVo.setEmail(dto.getEmail());
			feedbackVo.setGender(dto.getGender());
			feedbackVo.setAge(dto.getAge());
			feedbackVo.setFillinTime(dto.getFillinTime());
			feedbackVo.setQuestAnswerList(map.get(dto.getEmail()));
			feedbackList.add(feedbackVo);
		}
		return new FeedbackRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(), quizTitle,
				quizDescription, feedbackList);
	}

	// 撈取統計數據
	@Override
	public StatisticsRes statistics(int quizId) {
		// 從 question 找選項
		List<Question> questionList = questionDao.getByQuizId(quizId);
		List<StatisticsResVo> statisticsVoList = new ArrayList<>();
		// <問題編號, 多個選項>
		Map<Integer, List<String>> questIdOptionsMap = new HashMap<>();
		for (Question item : questionList) {
			// 將DB中 question 資訊設定到 StatisticsResVo 中
			// 先暫時排除 統計選項
			StatisticsResVo vo = new StatisticsResVo(item.getQuestId(), item.getQuestionTitle(), item.getType());
			statisticsVoList.add(vo);
			// 找出每一題 非文字題 的選項
			if (item.getType().equalsIgnoreCase(QuestionType.SINGLE.getType()) || item.getType().equalsIgnoreCase(QuestionType.MULTI.getType())) {
				// 將選項字串 轉換成 List<String>
				try {
					List<String> optionList = mapper.readValue(item.getOptions(), new TypeReference<>() {});
					questIdOptionsMap.put(item.getQuestId(), optionList);
				} catch (Exception e) {
					return new StatisticsRes(ResMessage.OPTIONS_PARSE_ERROR.getCode(),
							ResMessage.OPTIONS_PARSE_ERROR.getMessage());
				}
			}else if (item.getType().equalsIgnoreCase(QuestionType.STAR.getType())) {
				List<String> optionList = new ArrayList<>(List.of("1","2","3","4","5"));
				questIdOptionsMap.put(item.getQuestId(), optionList);
			}else {
				questIdOptionsMap.put(item.getQuestId(), null);
			}

		}
		Map<Integer, List<String>> questIdAnswersMap = getAnswers(quizId);
		if(questIdAnswersMap == null) {
			return new StatisticsRes(ResMessage.ANSWER_PARSE_ERROR.getCode(), ResMessage.ANSWER_PARSE_ERROR.getMessage());
		}
		// 計算回答次數
		Map<Integer, List<OptionCountVo>> map = computeAnswer(questIdOptionsMap, questIdAnswersMap);
		for(StatisticsResVo vo : statisticsVoList) {
			int questId = vo.getQuesId();
			vo.setOptionCountList(map.get(questId));
		}
		// 該問卷 所填寫的總問卷數
		int feedbackCount = feedbackDao.countQuizCount(quizId);
		// 首先 拿到該問卷的總共題數
		int questionQuantity = questionDao.selectQuestionCount(quizId);				
		// 拿到受訪者的性別男女筆數
		List<genderStatistic> genderList = feedbackDao.selectGenderAmount(quizId, questionQuantity);
		// 拿到受訪者的年齡分布
		List<String> ageList = feedbackDao.selectAgeDistributed(quizId, questionQuantity);
		return new StatisticsRes(ResMessage.SUCCESS.getCode(), ResMessage.SUCCESS.getMessage(),feedbackCount, genderList, ageList, statisticsVoList);
	}

	private boolean checkAnswer(List<String> optionsList, List<String> answers) {
		// 切串接的字串 若有用:標示選項答案作為分隔符，沒有則無影響
//		List<String> newOptionsList = new ArrayList<>();
//		for(String item : optionsList) {
//			String[] strArray = item.split(":");
//			newOptionsList.addAll(List.of(strArray));
//		}
		// 比對選項 和 答案
		for (String answer : answers) {
			// 若遇到不對，就中斷 回傳false
			if (!optionsList.contains(answer)) {
				return false;
			}
		}
		return true;
	}

	private Map<Integer, List<OptionCountVo>> computeAnswer(Map<Integer, List<String>> questIdOptionsMap,
			Map<Integer, List<String>> questIdAnswersMap) {
		// 問題編號,
		Map<Integer, List<OptionCountVo>> map = new HashMap<>();
		for (Map.Entry<Integer, List<String>> mapItem : questIdOptionsMap.entrySet()) {
			List<OptionCountVo> optionCountVoList = new ArrayList<>();
			int questId = mapItem.getKey();
			List<String> optionsList = mapItem.getValue();
			// 若是 非單選、多選， 就為null值，則直接跳過
			if(optionsList == null) {
				map.put(questId, null);
				continue;
			}
			// 答案包含 全部類型
			if (questIdAnswersMap.containsKey(questId)) {
				List<String> answersList = questIdAnswersMap.get(questId);
				int size = answersList.size();
				for (String option : optionsList) {
					answersList.removeAll(List.of(option));
					int optionSize = size - answersList.size();
					OptionCountVo vo = new OptionCountVo(option, optionSize);
					// 改變原本 answersList size 大小
					size = size - optionSize;
					optionCountVoList.add(vo);
				}
			}
			// 答案
			map.put(questId, optionCountVoList);
			
		}
		return map;
	}

	private Map<Integer, List<String>> getAnswers(int quizId) {
		// 取答案
		List<Feedback> feedbackList = feedbackDao.selectByQuizId(quizId);
		// <問題編號, 多個答案>
		Map<Integer, List<String>> questIdAnswersMap = new HashMap<>();
		for (Feedback item : feedbackList) {
			if (StringUtils.hasText(item.getAnswers())) {
				int questId = item.getQuestionId();
				// 將選項字串 轉換成 List<String>
				try {
					List<String> answersList = mapper.readValue(item.getAnswers(), new TypeReference<>() {
					});
					if (questIdAnswersMap.containsKey(questId)) {
						// 取出已存在 map中 的answers
						List<String> list = questIdAnswersMap.get(questId);
						// 把兩個相加
						list.addAll(answersList);
						// 把結果放回 map
						questIdAnswersMap.put(questId, list);
					} else {
						questIdAnswersMap.put(questId, answersList);
					}
				} catch (Exception e) {
					return null;
				}
			}
		}
		return questIdAnswersMap;
	}

}
