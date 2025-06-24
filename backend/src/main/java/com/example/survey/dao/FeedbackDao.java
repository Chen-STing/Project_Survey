package com.example.survey.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.survey.entity.Feedback;
import com.example.survey.entity.FeedbackId;
import com.example.survey.vo.FeedbackDto;
import com.example.survey.vo.genderStatistic;

import jakarta.transaction.Transactional;

@Repository
public interface FeedbackDao extends JpaRepository<Feedback, FeedbackId>{
	
	@Query(value = "select count(quiz_id) from feedback where quiz_id = ?1 and email = ?2", nativeQuery = true)
	public int selectCount(int quizId, String email);
	
	@Modifying
	@Transactional
	@Query(value = "insert into feedback (quiz_id, question_id, user_name, email, age, gender, answers, fillin_time)"
			+ " values (:quizId, :questionId, :name, :email, :age, :gender, :answers, now())", nativeQuery = true)
	public void insert(//
			@Param("quizId")int quizId, //
			@Param("questionId")int questionId, //
			@Param("name")String name, //
			@Param("email")String email, //
			@Param("gender")String gender, //
			@Param("age")int age, //
			@Param("answers")String answers);
	
	/**
	 * join 多張表，要另外創建 裝資料的容器(DTO)</br>
	 * 新建立的 DTO 沒有被spring boot託管(Annotation @)，只能通過 new 來新建，且必須有完整路徑</br>
	 * 因為new 非 SQL語法，所以 nativeQuery = false</br>
	 */
	@Query(value = "select new com.example.survey.vo.FeedbackDto("//
			+ " Qz.id, Qz.title, Qz.description,"//
			+ " Fb.userName, Fb.email, Fb.age, Fb.gender, Fb.answers, Fb.fillinTime,"//
			+ " Qt.questId, Qt.questionTitle)"//
			+ " from Quiz as Qz join Question as Qt on Qz.id = Qt.quizId"//
			+ " join Feedback as Fb on Qz.id = Fb.quizId where Qt.questId = Fb.questionId and Qz.id = ?1", nativeQuery = false)
	public List<FeedbackDto> selectFeedbackByQuizId(int quizId);
	
	// 取得所有回饋資料
	@Query(value = "select new com.example.survey.vo.FeedbackDto("//
			+ " Qz.id, Qz.title, Qz.description,"//
			+ " Fb.userName, Fb.email, Fb.age, Fb.gender, Fb.answers, Fb.fillinTime,"//
			+ " Qt.questId, Qt.questionTitle)"//
			+ " from Quiz as Qz join Question as Qt on Qz.id = Qt.quizId"//
			+ " join Feedback as Fb on Qz.id = Fb.quizId where Qt.questId = Fb.questionId", nativeQuery = false)
	public List<FeedbackDto> selectFeedback();
	
	
	// 取得 該問卷 所有受訪資料
	@Query(value = "select user_name, email, age, quiz_id, question_id, answers, fillin_time, gender from feedback where quiz_id = ?1", nativeQuery = true)
	public List<Feedback> selectByQuizId(int quizId);
	
	@Query(value = "select count(quiz_id) from feedback where quiz_id = ?1 and question_id = 1", nativeQuery = true)
	public int countQuizCount(int quizId);
	
	// 取得單張問卷中，受訪者的男女性別數
	@Query(value = "select gender,ceil(count(gender)/?2) from feedback where quiz_id = ?1 group by gender", nativeQuery = true)
	public List<genderStatistic> selectGenderAmount(int quizId, int questionCount);
	
	// 取得單張問卷中，受訪者的年齡分布數
	@Query(value = "select ceil(count(age)/?2),"
			+ " (select ceil(count(age)/?2) from feedback where quiz_id = ?1 and age > 20 and age <= 40),"
			+ " (select ceil(count(age)/?2) from feedback where quiz_id = ?1 and age > 40 and age <= 60),"
			+ " (select ceil(count(age)/?2) from feedback where quiz_id = ?1 and age > 60)"
			+ " from feedback where quiz_id = ?1 and age <= 20", nativeQuery = true)
	public List<String> selectAgeDistributed(int quizId, int questionCount);
}
