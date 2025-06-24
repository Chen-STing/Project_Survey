import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { HttpClientService } from '../@http-services/http-client.service';
import { ExampleService } from '../@services/example.service';
import { MatDialog } from '@angular/material/dialog';
import { EditAddingDialogComponent } from '../dialog/edit-adding-dialog/edit-adding-dialog.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-edit-adding',
  standalone: true,
  imports: [RouterLink,NzDividerModule,FormsModule,NzBackTopModule],
  templateUrl: './edit-adding.component.html',
  styleUrl: './edit-adding.component.scss'
})
export class EditAddingComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(EditAddingDialogComponent);
  }

  quizArray: Array<any> = [];

  id: number = 0;
  title: string = "";
  description: string = "";
  startDate: string = "";
  endDate: string = "";

  // 選項狀態識別
  questState: string = "";

  // 選項識別
  selectQuestStat (numberState :number) {
    switch (numberState) {
      case 1:
        this.questState = "Single";
        break;
      case 2:
        this.questState = "Multi";
        break;
      case 3:
        this.questState = "Text";
        break;
      case 4:
        this.questState = "Star";
        break;
    }
  }

  constructor(
    private exampleService: ExampleService,
    private http: HttpClientService) {}

  ngOnInit(): void {
      this.title = this.exampleService.quizTitle;
      this.description = this.exampleService.quizDescription;
      this.startDate = this.exampleService.quizStartDate;
      this.endDate = this.exampleService.quizEndDate;
    if(!(this.exampleService.editId == 0)) {
      let params = new HttpParams().set("id", this.exampleService.editId);

    // 拿到 quiz 的內容
      this.http.postParamsAPI("http://localhost:8080/quiz/get_quiz", params).subscribe((res: any) => {
        console.log(res);
        console.log(res.quiz.id);

        this.id = res.quiz.id;
        this.title = res.quiz.title;
        this.description = res.quiz.description;
        this.startDate = res.quiz.startDate;
        this.endDate = res.quiz.endDate;
      })
    // 拿到 quiz 所有選項
    this.http.postParamsAPI("http://localhost:8080/quiz/get_by_quiz_id",  params).subscribe((res: any) => {
      console.log(res);
      let obj;
      for(let item of res.questionList) {
        console.log(item);

        if(item.type == "Text" || item.type == "Star") {
          obj = {
            "questId": item.questId,
            "title": item.questionTitle,
            "type": item.type,
          }
        }else {
          obj = {
            "questId": item.questId,
            "title": item.questionTitle,
            "type": item.type,
            "options": JSON.parse(item.options)
          }
        }
        this.quizArray.push(obj);

      }
    })
    }

  }

  // 新增問卷
  addQuiz(numberState :number) {
    this.selectQuestStat(numberState);
    let quiz = {
      title: "",
      type: this.questState,
      options: [],
    };
    this.quizArray.push(quiz);

  }

  // 刪除問卷
  deleteQuiz(TitIndex: number) {
    this.quizArray.splice(TitIndex, 1);

  }

  // 刪除選項
  deleteQuizOption(TitIndex: number, OptIndex: number) {
    this.quizArray[TitIndex].options.splice(OptIndex, 1);

  }

  // 新增問卷的選項
  addOption(TitIndex: number) {
    this.quizArray[TitIndex].options.push("");
  }

  // 修改題目標題
  changeTitle(index: number) {
    let title = document.querySelectorAll(".quiz-title") as NodeListOf<HTMLInputElement>;
    this.quizArray[index].title = title[index].value;
  }

  // 修改題目選項
  changeOption(TitIndex: number, OptIndex: number) {
    let options = document.querySelectorAll(".quiz" + TitIndex +  " .quiz-option") as NodeListOf<HTMLInputElement>;
    this.quizArray[TitIndex].options[OptIndex] = options[OptIndex].value;
  }



  // 儲存&發布
  completeQuiz(isPublished: boolean) {
    if(this.quizArray.length < 1) {
      this.openDialog();
      this.exampleService.editAddingDialogCode = false;
        return;
    }

    for(let j = 0; j < this.quizArray.length; j++) {

      if(this.quizArray[j].type == "Single" || this.quizArray[j].type == "Multi") {
        if(this.quizArray[j].options.length < 2) {
          this.exampleService.editAddingDialogCode = false;
          this.openDialog();
          return;
        }
      }
    }

    // request 求請格式，傳資料回後端
    if(this.exampleService.editId > 0) {
      let body = {
        "id": this.id,
        "title": this.title,
        "description": this.description,
        "startDate": this.startDate,
        "endDate": this.endDate,
        "published": isPublished,
        "userAccount": "admin",
        "questionList": [] as any[]
      }
      for(let i = 0; i < this.quizArray.length; i++) {
        let option = ""
        if(this.quizArray[i].type == "Single" || this.quizArray[i].type == "Multi") {
          option = JSON.stringify(this.quizArray[i].options);
        }
        let question = {
          "quizId": this.id,
          "questId": i + 1,
          "questionTitle": this.quizArray[i].title,
          "type": this.quizArray[i].type,
          "options": option
        }
        body.questionList.push(question);
      }

      this.http.postBodyAPI("http://localhost:8080/quiz/update", body).subscribe((res) => {
        console.log(res);

      })

    }else {

      let body = {
        "title": this.title,
        "description": this.description,
        "startDate": this.startDate,
        "endDate": this.endDate,
        "published": isPublished,
        "userAccount": "admin",
        "questionList": [] as any[]
      }
      for(let i = 0; i < this.quizArray.length; i++) {
        let option = ""
        if(this.quizArray[i].type == "Single" || this.quizArray[i].type == "Multi") {
          option = JSON.stringify(this.quizArray[i].options);
        }
        let question = {
          "questId": i + 1,
          "questionTitle": this.quizArray[i].title,
          "type": this.quizArray[i].type,
          "options": option
        }
        body.questionList.push(question);
      }

      this.http.postBodyAPI("http://localhost:8080/quiz/create", body).subscribe((res) => {
        console.log(res);

      })
    }
    this.exampleService.editAddingDialogCode = true;
    this.openDialog();

  }

}


