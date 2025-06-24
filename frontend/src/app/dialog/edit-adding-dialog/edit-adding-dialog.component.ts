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
  selector: 'app-edit-adding-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-adding-dialog.component.html',
  styleUrl: './edit-adding-dialog.component.scss'
})
export class EditAddingDialogComponent {

  success!: boolean;

  constructor(
    private exampleService: ExampleService,
  ) {};

  ngOnInit(): void {
    this.success = this.exampleService.editAddingDialogCode;

  }
}
