package com.example.survey.constants;

public enum ResMessage {
	
	SUCCESS(200, "Success!!"),//
	PARAM_DATE_ERROR(400, "Param date error!!"),//
	QUESTION_TYPE_ERROR(400, "Question type error!!"),//
	OPTIONS_ERROR(400, "Option error!!"),//
	OPTIONS_PARSE_ERROR(400, "Option parse error!!"),//
	OPTIONS_SIZE_ERROR(400, "Option size error!!"),//
	SQL_ERROR(400, "Sql error!!"),//
	PARAM_ID_ERROR(400, "Param id error!!"),//
	QUIZ_ID_MISMATCH(400, "Quiz id mismatch!!"),//
	ID_NOT_FOUND(404, "Id not found!!"),//
	ACCOUNT_EXIST(400, "Account exist!!"),//
	ACCOUNT_NOT_FOUND(404, "Account not found!!"),//
	OUT_OF_FILLIN_DATE_RANGE(400, "Out of fillin date range!!"),//
	EMAIL_DUPLICATED(400, "Email duplicated!!"),//
	ANSWERS_OPTION_MISMATCH(400, "Answers option mismatch!!"),//
	ONE_OPTION_IS_ALLOWED(400, "One option is allowed!!"),//
	ANSWER_PARSE_ERROR(400, "Answer parse error!!"),//
	;
	
	private int code;
	
	private String message;

	private ResMessage(int code, String message) {
		this.code = code;
		this.message = message;
	}

	public int getCode() {
		return code;
	}

	public String getMessage() {
		return message;
	}
	
	public static class ConstantsMessage {
		
		public static final String PARAM_TITLE_ERROR = "Param title error!!";
		public static final String PARAM_DESCRIPTION_ERROR = "Param description error!!";
		public static final String PARAM_DESCRIPTION_SIZE_LONG = "Param description size error!!";
		public static final String PARAM_DATE_ERROR = "Param date error!!";
		public static final String PARAM_ID_ERROR = "Param id error!!";
		public static final String PARAM_TYPE_ERROR = "Param type error!!";
		public static final String PARAM_QUESTION_LIST_ERROR = "Param question list error!!";
		public static final String ACCOUNT_NULL_ERROR = "Account not null error!!";
		public static final String PARAM_ACCOUNT_ERROR = "Param account error!!";
		public static final String PARAM_PASSWORD_ERROR = "Param password error!!";
		public static final String PARAM_EMAIL_ERROR = "Param email error!!";
		public static final String PARAM_QUIZ_ID_LIST_ERROR = "Param quiz_id list error!!";
		public static final String EMAIL_IS_NECESSARY = "Email is necessary!!";
		
	}
}
