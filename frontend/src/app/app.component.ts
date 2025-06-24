import { Component } from '@angular/core';
import { Route,RouterOutlet } from '@angular/router';
import { TopbarComponent } from './topbar-Home/topbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,TopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'survey';

}
