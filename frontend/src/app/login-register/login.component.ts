import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExampleService } from '../@services/example.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  regEmailValue: string = "";

  isBoolean: boolean = false;

  @ViewChild("loginUser", { static: true })
  private loginUser!: ElementRef;
  @ViewChild("loginPassword", { static: true })
  private loginPassword!: ElementRef;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // setTimeout(() => {
    //   document.location.reload();
    // }, 0);
  }


  constructor(private ExampleService: ExampleService) {}

  // 樣式表
  newStyle: HTMLStyleElement = document.createElement('style');

  // submit驗證
  submitValid () {
    let Error = document.querySelector(".forget-link .error") as HTMLElement;
    console.log(this.loginUser.nativeElement.value);
    console.log(this.loginPassword.nativeElement.value);

    this.ExampleService.user = this.loginUser.nativeElement.value;
    this.ExampleService.password = this.loginPassword.nativeElement.value;

    Error.innerHTML = "帳號或密碼輸入有誤！";

    if(this.loginUser.nativeElement.value.trim() == "" || this.loginPassword.nativeElement.value.trim() == "") {

        this.newStyle.innerHTML = "#loginUser,#loginPassword {border: 3px solid red;background-image: url(/check_wrong.png);background-size: 22px;background-repeat: no-repeat;background-position: calc(100% - 17px);+ .bx {display: none;}}"
        document.head.appendChild(this.newStyle);
        Error.style.display = "block";
      }
    }
  // 登入keyup消除
  clearError() {
    let Error = document.querySelector(".forget-link .error") as HTMLElement;
    // 覆蓋樣式
    this.newStyle.innerHTML = "";
    document.head.appendChild(this.newStyle);
    Error.style.display = "none";

  }

  reset() {
    this.newStyle.innerHTML = "";
    document.head.appendChild(this.newStyle);
  }

  // 註冊input事件
  registerInput(e: number) {
    let registerInputList = document.querySelectorAll(".register input") as NodeListOf<HTMLInputElement>;
    let registerPList = document.querySelectorAll(".register .input-box p") as NodeListOf<HTMLElement>;
    // 驗證
    switch(e) {
      case 0:
        if(registerInputList[0].validity.patternMismatch) {
          registerPList[0].style.display = "block";
          registerPList[0].innerText = "請輸入6 ~ 12碼字元(含英文字母、數字)";
        };
        break;

      case 1:
        if(registerInputList[1].validity.patternMismatch) {
          registerPList[1].style.display = "block";
          registerPList[1].innerText = "不符合信箱格式";
        };
        break;

      case 2:
        if(registerInputList[2].validity.patternMismatch) {
          registerPList[2].style.display = "block";
          registerPList[2].innerText = "請輸入8 ~ 16碼字元(含英文字母、數字)";
        };
        break;

    }

    // 覆蓋樣式
    this.newStyle.innerHTML = "";
    document.head.appendChild(this.newStyle);

    // 當驗證正確時，消除警告文字
    if (!registerInputList[0].validity.patternMismatch) {
      registerPList[0].style.display = "none";
    }
    if (this.regEmailValue == "" || !registerInputList[1].validity.patternMismatch) {
      registerPList[1].style.display = "none";
    }
    if (!registerInputList[2].validity.patternMismatch) {
      registerPList[2].style.display = "none";
    }

  }
  // 註冊提交事件
  registerSubmit() :void{
    let registerInputList = document.querySelectorAll(".register input") as NodeListOf<HTMLInputElement>;
    let registerPList = document.querySelectorAll(".register .input-box p") as NodeListOf<HTMLElement>;
    let error = [];
    for(let i = 0; i < registerInputList.length; i++) {
      // 驗證
      switch(i) {
        case 0:
          if(registerInputList[i].validity.patternMismatch || !registerInputList[i].value) {
            registerPList[i].style.display = "block";
            registerPList[i].innerText = "請輸入6 ~ 12碼字元(含英文字母、數字)";
            error.push(i);
          };
          break;
        case 1:
          if(registerInputList[i].validity.patternMismatch || !registerInputList[i].value) {
            registerPList[i].style.display = "block";
            registerPList[i].innerText = "不符合信箱格式";
            error.push(i);
          };
          break;
        case 2:
          if(registerInputList[i].validity.patternMismatch || !registerInputList[i].value) {
            registerPList[i].style.display = "block";
            registerPList[i].innerText = "請輸入8 ~ 16碼字元(含英文字母、數字)";
            error.push(i);
          };
          break;
        }
    }
    let errorStr = "";
    if(error.length > 0) {
      for(let j = 0; j < error.length; j++) {
        if(j == error.length - 1) {
          errorStr += "#register" + error[j];
          break
        }
        errorStr += "#register" + error[j] + ","
      }
      this.newStyle.innerHTML = errorStr + " {border: 3px solid red;background-image: url(/check_wrong.png);background-size: 22px;background-repeat: no-repeat;background-position: calc(100% - 17px);+ .bx {display: none;}}"
      document.head.appendChild(this.newStyle);
    }
  }
  toggleBtn () {
    let registerPList = document.querySelectorAll(".error") as NodeListOf<HTMLElement>;
    // 清空input值 跟 樣式
    let inputList = document.querySelectorAll("input");
    for(let item of inputList) {
      item.value = "";
    }
    for (let i = 0; i < registerPList.length; i++) {
      if(i == 0) {
        this.submitValid();
        registerPList[i].innerText = "\n";
        document.head.removeChild(this.newStyle);
        continue;
      }
      registerPList[i].style.display = "none";
    }
    this.isBoolean = !this.isBoolean;
  }



}
