import { log } from 'ng-zorro-antd/core/logger';
import { Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { DateService } from '../@services/date.service';
import { HttpClientService } from '../@http-services/http-client.service';
import { ExampleService } from '../@services/example.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';



@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {

  token: boolean = false;
  isShowNav: boolean = false;
  isBoolean: boolean = false;
  inputData: string = '';
  account: string = "";
  // 頁碼數組
  paginationList: Array<any> = [""];
  // 當前頁碼
  currentPage: number = 1;

  questionData: Array<any> = [];
  currentQuestionData: Array<any> = [];

  newStyle: HTMLStyleElement = document.createElement('style');
  private formBuilder = inject(FormBuilder);

  dateFormGroup: FormGroup = this.formBuilder.group({startDate: [''], endDate: ['']});

  @ViewChild("dialog") dialog!: ElementRef;


  constructor(
    private dateService: DateService,
    private exampleService: ExampleService,
    private http: HttpClientService
  ) {}

  nowDate: string = "";

  ngOnInit() :void{
    this.token = this.exampleService.token;
    let params = new HttpParams().set("isPublish", true);
    // 呼叫整張quiz
    this.http.postParamsAPI("http://localhost:8080/quiz/get_published", params).subscribe((res: any) => {
      let obj = new Promise((resolve, reject) => {
        for(let item of res.quizList) {
          let quizData: object = {
            id: item.id,
            title: item.title,
            description: item.description,
            endTime: item.endDate,
            startDate: item.startDate
          }
          this.questionData.push(quizData);
        }
        if(res.code == 200) {
          resolve(this.questionData);
        }else {
          reject(res);
        }
      })
      obj.then(data => {
        // 控制頁碼
        this.currentQuestionData = this.questionData;
        let pages = Math.floor(this.currentQuestionData.length / 8);
        for(let i = 0; i < pages; i++) {
          this.paginationList.push("");
        }
      })
    })

  }

  quizTimeJudge(): void {
    if(document.querySelector(".subs")) {
      //抓取當下時間
      this.nowDate = this.dateService.changeDateFormat(new Date(), "-");
      //進行問卷時間判定
      for(let item of this.questionData) {
        // 正常問卷
        if(new Date(item.endTime) > new Date() && new Date(item.startDate) < new Date()) {
          (document.getElementById("sub-" + item.id) as HTMLButtonElement).disabled = false;
          (document.getElementById("sub-" + item.id) as HTMLButtonElement).style.cssText = "";
          (document.querySelector("#label-" + item.id + " h2") as HTMLElement).style.color = "";
          (document.getElementById("label-" + item.id) as HTMLButtonElement).style.cssText = "background:white";
          (document.getElementById("endDate-" + item.id) as HTMLElement).innerText = `截止日期： ${item.endTime}`;
          (document.getElementById("endDate-" + item.id) as HTMLElement).style.cssText = "color:rgb(0, 0, 0);font-size: 14px";
          continue;
        }
        // 過期問卷
        if(new Date(item.endTime) < new Date()) {
          (document.getElementById("sub-" + item.id) as HTMLButtonElement).disabled = true;
          (document.getElementById("sub-" + item.id) as HTMLButtonElement).style.cssText = "cursor: not-allowed;z-index:100";
          (document.querySelector("#label-" + item.id + " h2") as HTMLElement).style.color = "#a71919";
          (document.getElementById("label-" + item.id) as HTMLButtonElement).style.cssText = "cursor: not-allowed;z-index:100;pointer-events: none;background:#f1a3a3";
          (document.getElementById("endDate-" + item.id) as HTMLElement).innerText = "已截止";
          (document.getElementById("endDate-" + item.id) as HTMLElement).style.cssText = "color: #800E0E;font-size: 2rem";
          continue;
        }
        // 未開始問卷
        if(new Date(item.startDate) > new Date()) {
          (document.querySelector("#label-" + item.id + " h2") as HTMLElement).style.color = "#12a59e";
          (document.getElementById("label-" + item.id) as HTMLButtonElement).style.cssText = ";z-index:100;background:#a3f0e6";
          (document.getElementById("endDate-" + item.id) as HTMLElement).innerText = "尚未開始";
          (document.getElementById("endDate-" + item.id) as HTMLElement).style.cssText = "color: #0a5e61;font-size: 2rem";
          continue;
        }
      }
    }

  }

  logOut() {
    this.exampleService.user = "";
    this.exampleService.password = "";
    this.token = false;
    this.exampleService.token = false;
  }

  ngAfterViewChecked(): void {
    this.account = this.exampleService.user;
    this.quizTimeJudge();
  }

  // 顯示陰影效果
  showShadow() {
    this.newStyle.innerHTML = '.subs:hover .sub-circle {filter: blur(5px); transform: scale(0.7);}';
    document.head.appendChild(this.newStyle);
  };
  // 移除陰影效果
  closeShadow() {
    document.head.removeChild(this.newStyle);
  }

  isBoolCheck() {
    if(this.isBoolean) {
      this.isBoolean = !this.isBoolean;
    }
  }

  // 開啟dialog
  openDialog(ele: any) {
    this.dialog.nativeElement.showModal();
    this.dialog.nativeElement.childNodes[0].childNodes[0].innerText = ele.title;
    this.dialog.nativeElement.childNodes[1].childNodes[0].innerText = ele.description;
    this.dialog.nativeElement.childNodes[1].childNodes[2].innerText = ele.startDate;
  }


  // 抓取使用者點選哪一張問卷 id
  catchQuizId(e: number) {
    this.exampleService.quizId = e;

  }

  // 模糊搜尋
  find(): void{
    let textInput = document.getElementById("searchInput") as HTMLInputElement;
    let startDate = this.dateService.changeDateFormat(this.dateFormGroup.value.startDate, "-");
    let endDate = this.dateService.changeDateFormat(this.dateFormGroup.value.endDate, "-");
    let searchLog = document.getElementById("searchLog") as HTMLElement;
    if(startDate != "" && endDate != "") {
      if(startDate > endDate) {
        searchLog.innerText = `搜尋到 0 筆的問卷資料`;
      }
    }
    let body = {
      "quizTitle": textInput.value,
      "startDate": startDate,
      "endDate": endDate
    }
    this.http.postBodyAPI("http://localhost:8080/quiz/search", body).subscribe((res: any) => {
      let obj = new Promise((resolve, reject) => {
        if(res.quizList.length == 0) {
          this.questionData = [];
          searchLog.innerText = `搜尋到 0 筆的問卷資料`;
          return;
        }

        this.questionData = [];
        for(let item of res.quizList) {
          let quizData: object = {
            id: item.id,
            title: item.title,
            description: item.description,
            endTime: item.endDate,
            startDate: item.startDate
          }
          this.questionData.push(quizData);
          if (res.code == 200) {
            resolve(0);
          }else {
            reject("error");
          }
        }
      })
      obj.then((data: any) => {
        // 頁碼初始
        searchLog.innerText = `搜尋到 ${this.questionData.length} 筆的問卷資料`;
        this.currentPage = 1;
        this.paginationList = [""];
        let pages = Math.floor(this.questionData.length / 8);
        for(let i = 0; i < pages; i++) {
          this.paginationList.push("");
        }
        document.querySelector(".is-current")?.classList.remove("is-current");
        document.getElementById("page-" + this.currentPage)?.classList.add("is-current");
      })
    })
  }

  // 顯示出 nav 頁碼欄
  showNav(): void {
    this.isShowNav = !this.isShowNav;
    this.questionData = this.currentQuestionData;
    // 頁碼初始化
    this.currentPage = 1;
    this.paginationList = [""];
    let pages = Math.floor(this.questionData.length / 8);
    for(let i = 0; i < pages; i++) {
        this.paginationList.push("");
      }
    }

  // 頁面切換
  togglePage(page: number) {
    if (this.currentPage == page) {
      return;
    }
    this.currentPage = page;
    this.questionData = this.currentQuestionData;
    this.questionData = this.questionData.slice((this.currentPage - 1) * 8, this.currentPage * 8);
    document.querySelector(".is-current")?.classList.remove("is-current");
    document.getElementById("page-" + page)?.classList.add("is-current");

  }
  // 往前
  pre(): void {
    if(!(this.currentPage == 1)) {
      this.currentPage -= 1;
      this.questionData = this.currentQuestionData;
      this.questionData = this.questionData.slice((this.currentPage - 1) * 8, this.currentPage * 8);
      document.querySelector(".is-current")?.classList.remove("is-current");
      document.getElementById("page-" + this.currentPage)?.classList.add("is-current");
    }
  }
  // 往後
  next(): void {
    if(!(this.currentPage == this.paginationList.length)) {
      this.currentPage += 1;
      this.questionData = this.currentQuestionData;
      this.questionData = this.questionData.slice((this.currentPage - 1) * 8, this.currentPage * 8);
      document.querySelector(".is-current")?.classList.remove("is-current");
      document.getElementById("page-" + this.currentPage)?.classList.add("is-current");
    }
  }
  // questionData: Array<any> = [
  //   {
  //     id: 1,
  //     title: "最想去的國家",
  //     endTime: "2025-02-28"
  //   },
  //   {
  //     id: 2,
  //     title: "假日喜歡做什麼",
  //     endTime: "2025-03-02"
  //   },
  //   {
  //     id: 3,
  //     title: "木柵動物園裡，請挑選出你最喜歡動物的前三名，並且說明一下原因",
  //     endTime: "2025-03-10"
  //   },
  //   {
  //     id: 4,
  //     title: "喜歡的影視劇",
  //     endTime: "2025-03-10"
  //   },
  //   {
  //     id: 5,
  //     title: "如果你能選擇一位名人，你想成為誰",
  //     endTime: "2025-03-11"
  //   },
  //   {
  //     id: 6,
  //     title: "如果你能變成動物，你想變成什麼動物?",
  //     endTime: "2025-02-28"
  //   },
  //   {
  //     id: 7,
  //     title: "假日喜歡做什麼",
  //     endTime: "2025-03-02"
  //   },
  //   {
  //     id: 118,
  //     title: "木柵動物園裡，請挑選出你最喜歡動物的前三名，並且說明一下原因請挑選出你最喜歡動物的前三名，並且說明一下原因",
  //     endTime: "2025-03-10"
  //   },
  //   {
  //     id: 9,
  //     title: "喜歡的影視劇",
  //     endTime: "2025-03-10"
  //   },
  //   {
  //     id: 10,
  //     title: "如果你能選擇一位名人，你想成為誰",
  //     endTime: "2025-03-11"
  //   }
  // ]



}
