package com.example.survey.vo;

import java.util.List;

public class StatisticsResVo {
	
	private int quesId;
	
	private String questTitle;
	
	private String type;
	
	private List<OptionCountVo> optionCountList;

	public StatisticsResVo() {
		super();
	}

	public StatisticsResVo(int quesId, String questTitle, String type, List<OptionCountVo> optionCountList) {
		super();
		this.quesId = quesId;
		this.questTitle = questTitle;
		this.type = type;
		this.optionCountList = optionCountList;
	}
	
	public StatisticsResVo(int quesId, String questTitle, String type) {
		super();
		this.quesId = quesId;
		this.questTitle = questTitle;
		this.type = type;
	}

	public int getQuesId() {
		return quesId;
	}

	public String getQuestTitle() {
		return questTitle;
	}

	public String getType() {
		return type;
	}

	public List<OptionCountVo> getOptionCountList() {
		return optionCountList;
	}

	public void setQuesId(int quesId) {
		this.quesId = quesId;
	}

	public void setQuestTitle(String questTitle) {
		this.questTitle = questTitle;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setOptionCountList(List<OptionCountVo> optionCountList) {
		this.optionCountList = optionCountList;
	}
	
}
