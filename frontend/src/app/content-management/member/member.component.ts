import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ExampleService } from '../../@services/example.service';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {

  constructor(
    private exampleService: ExampleService,
  ) {};

  isdarkMode!: boolean;

  ngDoCheck(): void {
    this.isdarkMode = this.exampleService.isdarkMode;

  }

  reset(): void{
    let inputbox = document.querySelectorAll(".passbox");
    for(let box of inputbox) {
      (box as HTMLInputElement).value = "";
    }
  }
  // 顯示 隱藏密碼
  openText(number: number): void{
    let inputbox = document.querySelectorAll(".passbox");
    let icon = document.querySelectorAll(".bxs-low-vision");
    icon[number].classList.toggle("active");
    if((inputbox[number] as HTMLInputElement).getAttribute("type") == "text") {
      (inputbox[number] as HTMLInputElement).setAttribute("type","password");
    }else {
      (inputbox[number] as HTMLInputElement).setAttribute("type","text");
    }


  }
}
