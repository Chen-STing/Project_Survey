import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ExampleService } from '../../@services/example.service';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { HttpClientService } from '../../@http-services/http-client.service';


@Component({
  selector: 'app-count',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './count.component.html',
  styleUrl: './count.component.scss'
})
export class CountComponent {

  constructor(
    private exampleService: ExampleService,
    private http: HttpClientService,
  ) {};

  // 問卷數組
  arrayQuiz: any[] = [];
  selectedValue: string = "-請選擇問卷-";

  isdarkMode!: boolean;
  total!: number;
  genderData!: Array<number>;
  ageData: Array<any> = [];
  statisticsList: Array<any> = [];
  selectedOption: string = "-請選擇題型-";
  optionList: Array<any> = [];
  pieChart: any;
  doughnutChart: any;
  barChart: any;


  ngOnInit(): void {

    console.log(this.exampleService.quizList);

    this.arrayQuiz = this.exampleService.quizList;

  }

  ngDoCheck(): void {
    this.isdarkMode = this.exampleService.isdarkMode;
  }

  selectQuiz(): void{
    this.statisticsList = [];
    this.optionList = [];
    this.total = 0;
    // 清除舊有圖表
    if(this.doughnutChart) {
      this.doughnutChart.destroy();
    }
    if(this.barChart) {
      this.barChart.destroy();
    }
    if(this.pieChart) {
      this.pieChart.destroy();
    }
    let quiz = this.arrayQuiz.find(data => data.title == this.selectedValue)
    if (!quiz) {
      return;
    }
    let params = new HttpParams().set("quizId", quiz.id);
    this.http.postParamsAPI("http://localhost:8080/feedback/get_statistics", params).subscribe((res: any) => {
      this.total = res.count;
      this.genderData = [
        Number(res.genderList.find((data: any) => data.gender == '男').count),
        Number(res.genderList.find((data: any) => data.gender == '女').count),
      ]
      this.ageData = res.ageList[0].split(",");
      this.ageData.forEach(data => {
        Number(data);
      })
      let statisticsListNoText = res.statisticsList.filter((data: any) => !(data.type == "Text"));
      console.log(res);

      for(let item of statisticsListNoText) {
        let total = 0;
        let starTotal = 0;
        let optionList: any[] = [];
        for(let ele of item.optionCountList) {
          total += ele.count;
          if(item.type == "Star") {
            starTotal += Number(ele.option) * ele.count;
          }
          let obj = {
            option: ele.option,
            count: ele.count,
            type: item.type,
          }
          optionList.push(obj);
        }
        optionList.forEach(data => {
          data.totaloption = total;
          data.starAverage = (starTotal / total).toFixed(2);
        });
        let obj = {
          questId: item.quesId,
          questTitle: item.questTitle,
          totaloption: total,
          type: item.type,
          optionList: optionList
        }
        this.statisticsList.push(obj);
      }
      this.doughnutChart = this.createDoughnutChart(this.ageData);
      this.barChart = this.createBarChart(this.genderData);
    })
  }

  selectOption(): void{
    this.optionList = [];
    let option = this.statisticsList.find(data => data.questTitle == this.selectedOption);
    // 銷毀已有的圖表
    if(this.pieChart) {
      this.pieChart.destroy();
    }
    // 找不到就跳出中斷
    if(!option) {
      return;
    }
    this.optionList = option.optionList;
    // 圖表資料整理
    let optionLabel = [];
    let dataChart = [];
    for(let item of this.optionList) {
      if(item.type == "Star") {
        optionLabel.push(item.option + " ★");
      }else {
        optionLabel.push(item.option);
      }
      dataChart.push(item.count);
    }
    this.pieChart = this.createPieChart(optionLabel, dataChart);

  }

  createDoughnutChart(data: Array<number>) {
    // 獲取 canvas 元素
    let age = document.getElementById('ageChart') as HTMLCanvasElement;

    // 設定age數據
    let ageData = {
      // x 軸文字
      labels: ['0 ~ 20歲', '21 ~ 40歲', '41 ~ 60 歲', '61 歲以上'],
      datasets: [
        {
          // 上方分類文字
          label: '年齡數',
          // 數據
          data: data,
          // 線與邊框顏色
          backgroundColor: [
            '#47757C',
            '#304A6C',
            '#9C2A27',
            '#B2612D',
          ],
          //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
          hoverOffset: 4,
        },
      ],
    };

    // 創建圖表
    // age
    let doughnutChart = new Chart(age, {
      type: 'doughnut',
      data: ageData,
    });
    return doughnutChart;
  }

  createBarChart(data: Array<number>) {
    // 獲取 canvas 元素
    let gender = document.getElementById('genderChart') as HTMLCanvasElement;

    // 設定gender數據
    let genderData = {
      // x 軸文字
        labels: ['男', '女'],
        datasets: [
          // 第一組資料
          {
            // 上方分類文字
            label: '性別數',
            // 數據
            data: data,
            // 顏色
            backgroundColor: [
            '#D6EFE1',
            '#F6D6E0'],
            // 邊框顏色
            borderColor: [
            '#D6EFE1',
            '#F6D6E0'],
            // 邊框寬度
            borderWidth: 1,
          },
        ],
      };

      // 圖表選項
      var options = {
        scales: {
          y: {
            // y 軸從 0 開始
            beginAtZero: true,
          },
        },
      };

      // gender
    let barChart = new Chart(gender, {
      type: 'bar',
      data: genderData,
      options: options,
    });
    return barChart;
  }

  createPieChart(optionLabel: Array<string>, dataChart: Array<number>) {
    // 獲取 canvas 元素
    let ctx = document.getElementById('optionChart') as HTMLCanvasElement;

    // 設定數據
    let data = {
      // x 軸文字
      labels: optionLabel,
      datasets: [
        {
          // 上方分類文字
          label: '選項次數',
          // 數據
          data: dataChart,
          // 線與邊框顏色
          backgroundColor: [
            '#FCDAB9',
            '#F8B3A4',
            '#F78888',
            '#A26B7F',
            '#738089',
            '#A4B7B9',
            'rgba(55, 172, 190, 0.77)',
            'rgba(6, 64, 19, 0.76)',
            'rgba(255, 6, 6, 0.8)',
          ],
          //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
          hoverOffset: 4,
        },
      ],
    };

    // 創建圖表
    //pie是圓餅圖
    let pieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
    });

    return pieChart;
  }
}


