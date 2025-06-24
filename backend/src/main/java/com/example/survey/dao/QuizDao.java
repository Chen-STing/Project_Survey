package com.example.survey.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.survey.entity.Quiz;

import jakarta.transaction.Transactional;

@Repository
public interface QuizDao extends JpaRepository<Quiz, Integer>{
	
	// 新增 quiz 資料
	@Modifying
	@Transactional
	@Query(value = "insert into quiz (title, description, start_date, end_date, is_published, user_account)"
			+ " values (:title, :description, :startDate, :endDate, :published, :userAccount)", nativeQuery = true)
	public void insert(//
			@Param("title")String title,//
			@Param("description")String description,//
			@Param("startDate")LocalDate startDate,//
			@Param("endDate")LocalDate endDate,//
			@Param("published")boolean published,//
			@Param("userAccount")String userAccount);
	
	// 獲取最新id 流水號
	@Query(value = "select max(id) from quiz", nativeQuery = true)
	public int selectMaxQuizId();
	
	// 透過 id 拿到特定的 問卷
	@Query(value = "select id, title, description, start_date, end_date, is_published, user_account from quiz"
			+ " where id = ?1", nativeQuery = true)
	public Quiz selectQuizId(int id);
	
	// 只拿到 publish is true 的問卷
	@Query(value = "select id, title, description, start_date, end_date, is_published, user_account" + 
	" from quiz where is_published = ?1", nativeQuery = true)
	public List<Quiz> getAllPublishTrue(boolean isPublish);
	
	// 獲取 特定 帳號的 quiz
	@Query(value = "select id, title, description, start_date, end_date, is_published, user_account" + 
			" from quiz where user_account = ?1", nativeQuery = true)
			public List<Quiz> getQuizByAccount(String account);
	
	// 搜尋 標題、開始日期、結束日期
	@Query(value = "select id, title, description, start_date, end_date, is_published, user_account from quiz" + 
	" where title like %?1% and start_date >= ?2 and end_date <= ?3 and is_published = true", nativeQuery = true)
	public List<Quiz> search(String quizTitle, LocalDate startDate, LocalDate endDate);
	
	// 驗證 id 是否存在
	@Query(value = "select count(id) from quiz where id = ?1", nativeQuery = true)
	public int selectCountById(int id);
	
	// 驗證 id, 日期 及 publish is true
	@Query(value = "select count(id) from quiz where id = ?1 and ?2 >= start_date and" + 
	" ?2 <= end_date and is_published = true", nativeQuery = true)
	public int selectCountById(int id, LocalDate now);
	
	// 更新 quiz 資料
	@Modifying
	@Transactional
	@Query(value = "update quiz set title = :title, description = :description, start_date = :startDate," +
	" end_date = :endDate, is_published = :published, user_account = :userAccount where id = :id", nativeQuery = true)
	public void updateById(//
			@Param("id")int id,//
			@Param("title")String title,//
			@Param("description")String description,//
			@Param("startDate")LocalDate startDate,//
			@Param("endDate")LocalDate endDate,//
			@Param("published")boolean published,//
			@Param("userAccount")String userAccount);
	
	// 刪除 quiz 資料
	@Modifying
	@Transactional
	@Query(value = "delete from quiz where id in (?1)", nativeQuery = true)
	public void delete(List<Integer> idList);
	
}
