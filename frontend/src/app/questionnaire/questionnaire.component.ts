import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ExampleService } from '../@services/example.service';
import { HttpClientService } from '../@http-services/http-client.service';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { QuestionnaireDialogComponent } from '../dialog/questionnaire-dialog/questionnaire-dialog.component';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    NzStepsModule,
    MatButtonModule
  ],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent {
  readonly dialog = inject(MatDialog);

  openDialog(state: any) {
    this.exampleService.questionnaireDialogCode = state;
    this.dialog.open(QuestionnaireDialogComponent);
  }

  // 問卷資料
  quizTitle!: string;
  startDate!: string;
  endDate!: string;
  quizDescription!: string;

  current: number = 0;
  showPage: number = 3;
  arrayData: Array<any> = [];
  list: Array<any> = [];

  collectionUser = {
    title: "",
    userEmail: "",
    userName: "",
    userAge: 0,
    userGender: "",
    questions: this.list
  };

  isTrue: boolean = false;

  ngOnInit(): void {
    let params = new HttpParams().set("id", this.exampleService.quizId);
    // 拿到 quiz 的內容
    this.http.postParamsAPI("http://localhost:8080/quiz/get_quiz", params).subscribe((res: any) => {

      this.quizTitle = res.quiz.title;
      this.startDate = res.quiz.startDate;
      this.endDate = res.quiz.endDate;
      this.quizDescription = res.quiz.description;
    })
    // 拿到 quiz 所有選項
    this.http.postParamsAPI("http://localhost:8080/quiz/get_by_quiz_id",  params).subscribe((res: any) => {

      for(let item of res.questionList) {
        let resObj;
        if(item.type == "Single" || item.type == "Multi") {
          resObj = {
            id: item.questId,
            title: item.questionTitle,
            questState: item.type,
            option: JSON.parse(item.options)
          }
        }else {
          resObj = {
            id: item.questId,
            title: item.questionTitle,
            questState: item.type,
          }
        }
        this.arrayData.push(resObj);
      }

    })

  }

  toggle () {
    // 使用者沒填基本資料時，卡控
    if(this.keyUesrData()) {
      this.openDialog(null);
      return;
    }
    this.isTrue = !this.isTrue;
  }

  checkDialog (state: string) {
    if(state == "cansal") {
      this.openDialog("cansal");
    }
    if(state == "review") {
      this.openDialog("review");
    }
  }

  ngDoCheck(): void {
    if (this.exampleService.cansal) {

      this.isTrue = !this.isTrue;
    }
    this.exampleService.cansal = false;
  }


  constructor(
    private exampleService: ExampleService,
    private http: HttpClientService) {}

  // 收集受訪者資料
  keyUesrData(): boolean {
    let user = document.querySelectorAll(".user-item input");
    let gender = document.querySelectorAll(".user-item input:checked")

    // 若使用者沒有填值
    if((user[0] as HTMLInputElement).value == "" ||//
    (user[1] as HTMLInputElement).value == "" ||//
    (user[2] as HTMLInputElement).value == "") {
      return true;
    }

    if(Number((user[1] as HTMLInputElement).value) < 0) {
      return true;
    }

    // 使用者沒有選性別
    if(gender.length == 0) {
      return true;
    }

    this.collectionUser.title = this.quizTitle;
    this.collectionUser.userName = (user[0] as HTMLInputElement).value;
    this.collectionUser.userAge = Number((user[1] as HTMLInputElement).value);
    this.collectionUser.userEmail = (user[2] as HTMLInputElement).value;
    this.collectionUser.userGender = (gender[0] as HTMLInputElement).value;
    return false;
  }
  // 收集受訪者回答資料
  keyCollectionUser() {

    for(let i = this.current; i <= this.current; i++) {
      let quiz = document.querySelectorAll(".quiz" + i + ":checked");
      let text = document.querySelector(".box" + i + " textarea") as HTMLTextAreaElement;

      switch(this.arrayData[i].questState) {
        case "Single":
          let tempEleR = quiz[quiz.length - 1] as HTMLInputElement;
          let userDataR = {
            questionTitle: this.arrayData[i].title,
            type:"Single",
            response: tempEleR.value
          }

          this.collectionUser.questions.push(userDataR);

          break;
        case "Multi":
          let checklist = [];
          for(let check = 0; check < quiz.length; check++) {
            checklist.push((quiz[check]as HTMLInputElement).value)
          }
          let userDataC = {
            questionTitle: this.arrayData[i].title,
            type:"Multi",
            response: checklist
          }
          this.collectionUser.questions.push(userDataC);


          break;
        case "Text":
          let userDataT = {
            questionTitle: this.arrayData[i].title,
            type:"Text",
            response: text.value
          }
          this.collectionUser.questions.push(userDataT);

          break;
        case "Star":
          let star = document.querySelectorAll(".box" + i + " .high-star");

          let userDataS = {
            questionTitle: this.arrayData[i].title,
            type:"Star",
            response: star[star.length - 1].getAttribute("id")?.slice(2)
          }
          this.collectionUser.questions.push(userDataS);


      }
    }


  }


  // 評量
  selectStar (e: any, index: number) {
    // 先判斷並刪除所有高亮
    let star = document.getElementById(e.target.id) as HTMLElement;
    let starCount = e.target.id.substr(2,1)

    if (star.classList.contains('high-star')) {
      for (let i = 1; i <= 5; i++) {
        let starRemove = document.getElementById(index + "-" + i) as HTMLElement;
        starRemove.classList.remove('high-star');
      }
    }

    // 再添加高亮
    for (let i = 1; i <= Number(starCount); i++) {
      let starAdd = document.getElementById(index + "-" + i) as HTMLElement;
      starAdd.classList.add('high-star');
    }


  }

  pre(): void {
    this.collectionUser.questions.splice(this.current - 1, );

    let stepDiv = document.querySelectorAll("nz-step");
    // 進度覽 初始 & 排除最後
    if(this.current > 1 && !(this.showPage == this.arrayData.length)) {
      this.showPage -= 1;
      stepDiv[this.current - 2].classList.remove("hide");
    }
    // 進度覽 當最後一筆時
    if(this.showPage == this.arrayData.length && !(this.current == this.arrayData.length - 1)) {
      this.showPage -= 1;
      stepDiv[this.current - 2].classList.remove("hide");
    }
    this.current -= 1;
    // 問卷內容
    let content = document.querySelectorAll(".question-box");
    content[this.current].classList.remove("hide");
    content[this.current + 1].classList.add("hide");

  }

  next(): void {

    for(let i = this.current; i <= this.current; i++) {
      let quiz = document.querySelectorAll(".quiz" + i + ":checked");
      let text = document.querySelector(".box" + i + " textarea") as HTMLTextAreaElement;
      // token判斷能否通行
      let token = quiz.length;

      if(text?.value) {
        token = 1;
      }

      let star = document.querySelectorAll(".box" + i + " .high-star");
      if(star.length > 0) {
        token = 1;
      }

      if(token == 0) {
        (document.querySelector(".warning") as HTMLElement).classList.remove("hide");
        (document.querySelector(".nextSubmit") as HTMLButtonElement).disabled = true;
        return;
      }
      this.keyCollectionUser();
    }

      // 進行下一頁或提交
      this.current += 1;
      let stepDiv = document.querySelectorAll("nz-step");
      // 頁面只顯示 3個進度覽
      if(this.current > 1 && !(this.showPage == this.arrayData.length)) {
        this.showPage += 1;
        stepDiv[this.current - 2].classList.add("hide");
      }
      // 顯示問卷內容
      let content = document.querySelectorAll(".question-box");
      content[this.current].classList.remove("hide");
      content[this.current - 1].classList.add("hide");

  }

  done(): void {

    if(this.arrayData.length == this.collectionUser.questions.length) {
      this.checkDialog("review");
      return;
    }
    this.keyCollectionUser();
    this.exampleService.collectionUser = this.collectionUser;
    console.log(this.collectionUser);

    this.checkDialog("review");

  }

  call(): void {
    // 最後一頁時，取消不觸發
    if(this.current == this.arrayData.length - 1) {
      return;
    }
    // 選擇、回答時，解除禁用按鈕
    for(let i = 0; i <= this.current; i++) {
      let quiz = document.querySelectorAll(".quiz" + i + ":checked");
      if(quiz.length > 0) {
        (document.querySelector(".warning") as HTMLElement).classList.add("hide");
        (document.querySelector(".nextSubmit") as HTMLButtonElement).disabled = false;
      }
    }
  }



  // arrayData: Array<any> = [
  //   {
  //     id: 1,
  //     title: "貓科動物",
  //     questState: "Single",
  //     option: [
  //       "獅子",
  //       "老虎",
  //       "花豹",
  //       "摺耳貓"
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: "選擇三種你最想成為的動物",
  //     questState: "Multi",
  //     option: [
  //       "獅子",
  //       "老虎",
  //       "花豹",
  //       "大象",
  //       "狐狸",
  //       "狐蒙",
  //       "熊貓",
  //       "長頸鹿",
  //       "黑猩猩",
  //       "貓頭鷹",
  //       "老鷹",
  //       "海豚",
  //       "鯨魚",
  //       "鱷魚"
  //     ]
  //   },
  //   {
  //     id: 3,
  //     title: "說明你想成為動物的原因",
  //     questState: "Text"
  //   },
  //   {
  //     id: 4,
  //     title: "您推薦木柵動物園嗎？ 推薦指數：",
  //     questState: "Star",
  //   }
  // ];

}


