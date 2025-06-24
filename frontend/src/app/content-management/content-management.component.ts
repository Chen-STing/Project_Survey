import { ExampleService } from '../@services/example.service';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EditContentComponent } from './edit-content/edit-content.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CommonModule } from '@angular/common';
import { BackDirectionsComponent } from './back-directions/back-directions.component';
import { MemberComponent } from './member/member.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { HttpClientService } from '../@http-services/http-client.service';
import { HttpParams } from '@angular/common/http';
import { DateService } from '../@services/date.service';




@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTabsModule,
    EditContentComponent,
    FeedbackComponent,
    MemberComponent,
    CommonModule,
    NzDropDownModule,
    BackDirectionsComponent,

    ],
  templateUrl: './content-management.component.html',
  styleUrl: './content-management.component.scss'
})
export class ContentManagementComponent {

  isTrue: boolean = false;
  isdarkMode: boolean = true;
  user: string = "";
  listOfData: Array<any> = [];

  constructor(
    private exampleService: ExampleService,
    private http: HttpClientService,
    private dateService: DateService,
  ) {};

  ngOnInit(): void {
    this.user = this.exampleService.user;
    // 撈取 該帳號的問卷內容
    let params = new HttpParams().set("account", "admin");
    this.http.postParamsAPI("http://localhost:8080/quiz/account", params).subscribe((res: any) => {
      let nowDate = this.dateService.changeDateFormat(new Date(), "-");
      let obj;
      for(let item of res.quizList) {
        // 判定狀態
        if (item.published) {
          // 已發布
          // 當前時間 是否超過 結束時間
          if(nowDate > item.endDate) {
            obj = {
              id: item.id,
              title: item.title,
              description: item.description,
              startTime: item.startDate,
              endTime: item.endDate,
              status: '已結束'
            }
          } else {
            // 再去判定 開始時間 和 當前時間
            obj = {
              id: item.id,
              title: item.title,
              desctiption: item.description,
              startTime: item.startDate,
              endTime: item.endDate,
              status: item.startDate > nowDate ? "未開始" : "收集中"
            }
          }
        } else {
          // 未發布
          obj = {
            id: item.id,
            title: item.title,
            description: item.description,
            startTime: item.startDate,
            endTime: item.endDate,
            status: '編輯中'
          }
        }
        this.listOfData.push(obj);
      }
      this.exampleService.quizList = this.listOfData;
    })

    // 撈取 所有受訪回饋
    // this.http.getAPI("http://localhost:8080/feedback/get_all_feedback").subscribe((res) => {
    //   console.log(res);


    // })

  }

  ngDoCheck(): void {

    this.exampleService.isdarkMode = this.isdarkMode;

  }

  functionTitle: string = "";

  showRouterTitle(e: number) {
    switch(e) {
      case 1:
        this.functionTitle = "我的問卷";
        break;
      case 2:
        this.functionTitle = "問卷回饋";
        break;
      case 3:
        this.functionTitle = "問卷統計";
        break;
      case 4:
        this.functionTitle = "會員管理";
        break;
      default:
        this.functionTitle = "";
    }
  }

  logOut() {
    this.exampleService.user = "";
    this.exampleService.password = "";
    this.exampleService.token = false;
  }


}
