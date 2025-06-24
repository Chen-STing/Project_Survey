package com.example.survey.entity;

import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import com.example.survey.constants.ResMessage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


@Entity
@Table(name = "quiz")
public class Quiz {
	
	@Id
	@Column(name = "id")
	private int id;
	
	@NotBlank(message = ResMessage.ConstantsMessage.PARAM_TITLE_ERROR)
	@Column(name = "title")
	private String title;
	
	@NotBlank(message = ResMessage.ConstantsMessage.PARAM_DESCRIPTION_ERROR)
	@Length(max = 200 , message = ResMessage.ConstantsMessage.PARAM_DESCRIPTION_SIZE_LONG)
	@Column(name = "description")
	private String description;
	
	@NotNull(message = ResMessage.ConstantsMessage.PARAM_DATE_ERROR)
	@Column(name = "start_date")
	private LocalDate startDate;
	
	@NotNull(message = ResMessage.ConstantsMessage.PARAM_DATE_ERROR)
	@Column(name = "end_date")
	private LocalDate endDate;
	
	@Column(name = "is_published")
	private boolean published;
	
	@NotNull(message = ResMessage.ConstantsMessage.ACCOUNT_NULL_ERROR)
	@Column(name = "user_account")
	private String userAccount;

	public Quiz() {
		super();
	}
	
	public Quiz(int id,String title,String description,LocalDate startDate,LocalDate endDate, boolean published, String userAccount) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.published = published;
		this.userAccount = userAccount;
	}
	

	public Quiz(String title,String description,LocalDate startDate,LocalDate endDate, boolean published, String userAccount) {
		super();
		this.title = title;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.published = published;
		this.userAccount = userAccount;
	}

	public int getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public boolean isPublished() {
		return published;
	}

	public String getUserAccount() {
		return userAccount;
	}
	
	
	
}
