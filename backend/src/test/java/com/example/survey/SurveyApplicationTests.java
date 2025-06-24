package com.example.survey;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.survey.dao.FeedbackDao;
import com.example.survey.dao.QuestionDao;
import com.example.survey.dao.QuizDao;
import com.example.survey.entity.Question;
import com.example.survey.service.ifs.QuizService;
import com.example.survey.vo.CreateReq;
import com.example.survey.vo.genderStatistic;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
class SurveyApplicationTests {
	
	@Autowired QuizService quizService;
	@Autowired QuizDao quizDao;
	@Autowired FeedbackDao feedbackDao;
	@Autowired QuestionDao questionDao;

	@Test
	void contextLoads() {

	}
	
	@Test
	void test1() throws JsonProcessingException {
	
		ObjectMapper mapper = new ObjectMapper();
		String str = mapper.writeValueAsString(List.of("AAA", "BBB", "CCC"));
		List<Question> list = new ArrayList<>();
		list.add(new Question(1,"題目","Single",str));
		CreateReq req = new CreateReq("問卷標題","敘述",LocalDate.of(2025, 3, 25),LocalDate.of(2025, 3, 31),true,"ooo12345", list);
		quizService.create(req);
	}
	


}
