import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ExampleService } from '../../@services/example.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.scss'
})
export class ReviewDialogComponent {

  state!: string;

  ngDoCheck(): void {
    this.state = this.exampleService.reviewDialogCode;
  }

  constructor(
    private exampleService: ExampleService,
  ) {};
}
