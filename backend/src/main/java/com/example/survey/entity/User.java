package com.example.survey.entity;

import com.example.survey.constants.ResMessage;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "user")
public class User {
		
		@Pattern(regexp = "[A-Za-z0-9]{6,12}", message = ResMessage.ConstantsMessage.PARAM_ACCOUNT_ERROR)
		@Id
		@Column(name = "account")
		private String account;
		
		@Pattern(regexp = "[A-Za-z0-9]{8,16}", message = ResMessage.ConstantsMessage.PARAM_PASSWORD_ERROR)
		@Column(name = "password")
		private String password;
		
		@NotBlank(message = ResMessage.ConstantsMessage.PARAM_EMAIL_ERROR)
		@Column(name = "email")
		private String email;

		public User() {
			super();
		}

		public User(String account,String password, String email) {
			super();
			this.account = account;
			this.password = password;
			this.email = email;
		}

		public String getAccount() {
			return account;
		}

		public String getPassword() {
			return password;
		}

		public String getEmail() {
			return email;
		}

		
		
		
}
