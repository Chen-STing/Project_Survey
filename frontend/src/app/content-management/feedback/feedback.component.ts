import { Component, inject } from '@angular/core';
import { ExampleService } from '../../@services/example.service';
import { CommonModule } from '@angular/common';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../../@http-services/http-client.service';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ReviewShowComponent } from '../../dialog/review-show/review-show.component';



@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(ReviewShowComponent);
  }

  constructor(
      private exampleService: ExampleService,
      private http: HttpClientService,
    ) {};

  isdarkMode!: boolean;
  selectedValue: string = "-請選擇問卷-";

  try: boolean = false;

  // 問卷數組
  arrayQuiz: any[] = [];

  // 單一問卷下 回饋數組
  listOfData: any[] = [];
  // 紀錄選項類型
  questionList: any[] = [];


  ngOnInit(): void {
    this.arrayQuiz = this.exampleService.quizList;

  }

  ngDoCheck(): void {
    this.isdarkMode = this.exampleService.isdarkMode;

  }

  selectFeedback() {
    this.try = true;
    let quiz = this.arrayQuiz.find(data => this.selectedValue == data.title);
    let params = new HttpParams().set("quizId", quiz.id);
    this.listOfData = this.listOfData.filter(d => d.id == 0);
    this.http.postParamsAPI("http://localhost:8080/feedback/get_feedback", params).subscribe((res: any) => {
      for(let i = 0; i < res.userFeedbackList.length; i++) {

        // let obj = {
        //   id: i + 1,
        //   name: res.userFeedbackList[i].userName,
        //   time: res.userFeedbackList[i].fillinTime.replace("T", " ")
        // }
        // this.listOfData.push(obj);
        this.listOfData = [
          ...this.listOfData,
          {
            id: i + 1,
            name: res.userFeedbackList[i].userName,
            time: res.userFeedbackList[i].fillinTime.replace("T", " "),
            email: res.userFeedbackList[i].email,
            age: res.userFeedbackList[i].age,
            gender: res.userFeedbackList[i].gender,
            questAnswerList: res.userFeedbackList[i].questAnswerList
          }
        ];
      }
    })
    params = new HttpParams().set("id", quiz.id);
    this.http.postParamsAPI("http://localhost:8080/quiz/get_by_quiz_id", params).subscribe((res: any) => {
      this.questionList = res.questionList;
    })
  }

  getFeedback(name: string) {
    let userFeedback = this.listOfData.find(data => name == data.name);
    for(let i = 0; i < this.questionList.length; i++) {
      userFeedback.questAnswerList[i]["type"] = this.questionList[i].type
    }
    this.exampleService.feedbackList = userFeedback;
    this.openDialog();
  }

  listOfColumn = [
    {
      title: 'id',
      compare: (a: ItemData, b: ItemData) => a.id - b.id,
      priority: 2
    },
    {
      title: '姓名',
      compare: null,
      priority: 0,
    },
    {
      title: '填寫時間',
      compare: (a: ItemData, b: ItemData) => a.time.localeCompare(b.time),
      priority: 1
    },
    {
      title: '問卷結果',
      compare: null,
      priority: 0,
    }
  ];


}

interface ItemData {
  id: number;
  name: string;
  time: string;
  questAnswerList: Array<any>;

}
