import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  user!: string;
  password!: string;
  token: boolean = false;
  // CSS樣式控制
  isdarkMode!: boolean;
  // 帳號問卷數組
  quizList!: Array<any>;
  // 回饋數組
  feedbackList!: object;

  // 編輯問卷編號
  editId: number = 0;
  // 問卷編號
  quizId!: number;

  // 問卷標題
  quizTitle!: string;
  // 問卷敘述
  quizDescription!: string;
  // 開始時間,結束時間
  quizStartDate!: string;
  quizEndDate!: string;

  // 填寫者資料
  collectionUser!: questObj;

  // 問卷Dialog 狀態碼
  cansal!: boolean;
  questionnaireDialogCode!: string;

  // 新增Dialog 狀態碼
  editAddingDialogCode: boolean = false;

  // 預覽Dialog 狀態碼
  reviewDialogCode!: string;

  constructor() { }
}

interface questObj {
  title: string;
  userName: string;
  userAge: number;
  userEmail: string;
  userGender: string;
  questions: questions[];
}

interface questions {
  questionTitle: string;
  response?: string;
  responseList?: string[];
  star?: number;
}
