package com.example.survey.constants;

public enum QuestionType {
	
	SINGLE("Single"),//
	MULTI("Multi"),//
	TEXT("Text"),//
	STAR("Star");
	
	private String type;

	private QuestionType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}
	
	// 檢查 類型
	public static boolean checkType(String inputType) {
		for(QuestionType item : QuestionType.values()) {
			if(inputType.equalsIgnoreCase(item.getType())) {
				return true;
			}
		}
		return false;
	}

}
