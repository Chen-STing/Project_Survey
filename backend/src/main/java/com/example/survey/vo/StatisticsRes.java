package com.example.survey.vo;

import java.util.List;

public class StatisticsRes extends BasicRes{
	
	private int count;
	
	private List<genderStatistic> genderList;
		
	private List<String> ageList;
	
	private List<StatisticsResVo> statisticsList;

	public StatisticsRes() {
		super();
	}

	public StatisticsRes(int code, String message) {
		super(code, message);
	}

	
	public StatisticsRes(int code, String message, int count, List<genderStatistic> genderList, List<String> ageList,
			List<StatisticsResVo> statisticsList) {
		super(code, message);
		this.count = count;
		this.genderList = genderList;
		this.ageList = ageList;
		this.statisticsList = statisticsList;
	}

	public List<genderStatistic> getGenderList() {
		return genderList;
	}

	public List<String> getAgeList() {
		return ageList;
	}

	public List<StatisticsResVo> getStatisticsList() {
		return statisticsList;
	}

	public int getCount() {
		return count;
	}
}
