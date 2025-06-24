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
  selector: 'app-questionnaire-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './questionnaire-dialog.component.html',
  styleUrl: './questionnaire-dialog.component.scss'
})
export class QuestionnaireDialogComponent {

  state!: string;

  constructor(
    private exampleService: ExampleService,
  ) {};

  ngOnInit(): void {
    this.state = this.exampleService.questionnaireDialogCode;

  }

  check() {
    this.exampleService.cansal = true;
  }
}
