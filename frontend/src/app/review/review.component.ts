import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ExampleService } from '../@services/example.service';
import { HttpClientService } from '../@http-services/http-client.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../dialog/review-dialog/review-dialog.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [NzDividerModule,RouterLink],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(ReviewDialogComponent);
  }

  constructor(
    private exampleService: ExampleService,
    private http: HttpClientService
  ) {};

  questObj!: any;

  ngOnInit(): void {
    this.questObj = this.exampleService.collectionUser;

  }

  submit() {
    let list = [];
    let obj;
    for(let i = 0; i < this.questObj.questions.length; i++) {
      let responseList = [];
      if(typeof this.questObj.questions[i].response == "string") {
        responseList.push(this.questObj.questions[i].response)
        obj = {
          questId: i + 1,
          answers: responseList
        }
      }else {
        obj = {
          questId: i + 1,
          answers: this.questObj.questions[i].response
        }
      }
      list.push(obj);
    }
    let body = {
      quizId: this.exampleService.quizId,
      name: this.questObj.userName,
      email: this.questObj.userEmail,
      gender: this.questObj.userGender,
      age: this.questObj.userAge,
      answerList: list
    };
    this.http.postBodyAPI("http://localhost:8080/feedback/fillin", body).subscribe((res: any) => {
      console.log(res);
    })
  }

  check(state: string) {
    this.exampleService.reviewDialogCode = state;
    if (state == "cansal") {
      this.openDialog();
      return;
    }
    this.submit();
    this.openDialog();
  }
}




