package com.example.survey.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.survey.entity.User;

import jakarta.transaction.Transactional;

@Repository
public interface UserDao extends JpaRepository<User, String>{
	
	@Modifying
	@Transactional
	@Query(value = "insert into user (account, password, email) values (?1, ?2, ?3)", nativeQuery = true)
	public void insert(String account, String password, String email);
	
	@Query(value = "select count(account) from user where account = ?1", nativeQuery = true)
	public int accountCount(String account);
}
