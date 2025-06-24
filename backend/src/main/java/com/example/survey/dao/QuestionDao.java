package com.example.survey.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.survey.entity.Question;
import com.example.survey.entity.QuestionId;

import jakarta.transaction.Transactional;

@Repository
public interface QuestionDao extends JpaRepository<Question, QuestionId>{
	
	@Modifying
	@Transactional
	@Query(value = "insert into question (quiz_id, quest_id, question_title, type, options)"
			+ " values (:quizId, :questId, :questionTitle, :type, :options)", nativeQuery = true)
	public void insert(//
			@Param("quizId")int quizId,//
			@Param("questId")int questId,//
			@Param("questionTitle")String questionTitle,//
			@Param("type")String type,//
			@Param("options")String options);
	
	@Query(value = "select quiz_id, quest_id, question_title, type, options from question where quiz_id = ?1", nativeQuery = true)
	public List<Question> getByQuizId(int quizId);
	
	@Modifying
	@Transactional
	@Query(value = "delete from question where quiz_id = ?1", nativeQuery = true)
	public void deleteByQuizId(int quizId);
	
	@Modifying
	@Transactional
	@Query(value = "delete from question where quiz_id in (?1)", nativeQuery = true)
	public void delete(List<Integer> quizIdList);
	
	// 查詢該問卷有 幾道題目
	@Query(value = "select count(quest_id) from question where quiz_id = ?1", nativeQuery = true)
	public int selectQuestionCount(int quizId);
}
