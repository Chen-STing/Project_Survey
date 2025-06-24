import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ExampleService } from '../../@services/example.service';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-review-show',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    NzDescriptionsModule,
    NzRadioModule,
    RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './review-show.component.html',
  styleUrl: './review-show.component.scss'
})
export class ReviewShowComponent {

  feedbackList: any = {};

  ngDoCheck(): void {
    this.feedbackList = this.exampleService.feedbackList;

  }

  constructor(
    private exampleService: ExampleService,
  ) {};

}
