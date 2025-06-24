import { Component, ElementRef, inject, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatStepperModule} from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule,NzTableFilterFn,NzTableFilterList, NzTableSortFn } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ExampleService } from '../../@services/example.service';
import { CommonModule } from '@angular/common';
import { DateService } from '../../@services/date.service';






@Component({
  selector: 'app-edit-content',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    DragDropModule,
    NzDatePickerModule,
    NzTableModule,
    NzCheckboxModule,
    NzDividerModule,
    CommonModule,
  ],
  templateUrl: './edit-content.component.html',
  styleUrl: './edit-content.component.scss',
})



export class EditContentComponent{

constructor(
  private exampleService: ExampleService,
  private dateService: DateService
) {};

isTrue: boolean = false;
isdarkMode!: boolean;
isCheckFirst: boolean = false;
isCheckSecond: boolean = false;
isCheck: boolean = false;
// 問卷容器
listOfData: ItemData[] = [];

// 模板內容
private _formBuilder = inject(FormBuilder);

firstFormGroup: FormGroup = this._formBuilder.group({title: [''], content: ['']});
secondFormGroup: FormGroup = this._formBuilder.group({date: ['']});

@ViewChild("dialog") dialog!: ElementRef;

ngOnInit(): void {
  this.listOfData = this.exampleService.quizList;
}

ngDoCheck(): void {
  this.isdarkMode = this.exampleService.isdarkMode;
}

// 全框功能
toggleCheck(): void {
  let toggleCheck = document.getElementById("totalCheck");
  let checkboxList = document.querySelectorAll(".checkbox");
  for (let i = 0; i < checkboxList.length; i++) {
    if ((toggleCheck as HTMLInputElement).checked == true) {
      (checkboxList[i] as HTMLInputElement).checked = true;
    }else {
      (checkboxList[i] as HTMLInputElement).checked = false;
    }
  }
}

checkDelete() {
  let checkDataList = document.querySelectorAll(".checkbox:checked");
  if(checkDataList.length == 0) {
    return;
  }
  this.dialog.nativeElement.showModal()
}

// 刪除問卷
delete(): void {
  // 獲取勾選的checkbox
  let checkDataList = document.querySelectorAll(".checkbox:checked");
  for(let i = 0; i < checkDataList.length; i++) {
    // 並一筆一筆處理，先拿到與數據對應的id
    let id = Number(checkDataList[i].getAttribute("id")?.slice(6,));
    for(let item of this.listOfData) {
      // 匹配id對應到的資料
      if(item.id == id) {
        // 使用 filter() 方法，排除不要的，再裝回去
        this.listOfData = this.listOfData.filter(ele => ele !== item);
      }
    }
  }
  (document.getElementById("totalCheck") as HTMLInputElement).checked = false;
}

// 編輯問卷
editing(id: number) {
  this.exampleService.editId = id;
}

returnEditCode() {
  this.exampleService.editId = 0;
}

  // 獲取 問卷名稱及內容
  getFormValueFirst() {
    this.exampleService.quizTitle = this.firstFormGroup.value.title;
    this.exampleService.quizDescription = this.firstFormGroup.value.content;
  }
  // 獲取 開始時間及結束時間
  getFormValueSecond() {
    this.exampleService.quizStartDate = this.dateService.changeDateFormat(this.secondFormGroup.value.date[0],"-");
    this.exampleService.quizEndDate = this.dateService.changeDateFormat(this.secondFormGroup.value.date[1],"-");
  }

  // 標題內容檢查
  changeFirst() :boolean{
    let title = this.firstFormGroup.value.title;
    let description = this.firstFormGroup.value.content;
    if(title === null || title.trim().length === 0) {
      this.isCheckFirst = false;
      this.isCheck = false;
      return false
    }

    if(description === null || description.trim().length === 0) {
      this.isCheckFirst = false;
      this.isCheck = false;
      return false
    }
    this.isCheckFirst = true;
    this.getFormValueFirst();
    return true
  }
  // 日期檢查
  changeSecond() :boolean{
    let now = this.dateService.changeDateFormat(new Date(),"-");
    let startDate = this.dateService.changeDateFormat(this.secondFormGroup.value.date[0],"-");
    let endDate = this.dateService.changeDateFormat(this.secondFormGroup.value.date[1],"-");
    if(now > startDate) {
      this.isCheckSecond = false;
      this.isCheck = false;
      return false
    }

    if(!startDate) {
      this.isCheckSecond = false;
      this.isCheck = false;
      return false
    }

    if(!endDate) {
      this.isCheckSecond = false;
      this.isCheck = false;
      return false
    }
    this.isCheckSecond = true;
    this.getFormValueSecond();
    return true

  }
  check() {
    this.changeFirst();
    this.changeSecond();
    if(this.changeFirst() && this.changeSecond()) {
      this.isCheck = true;
    }else {
      this.isCheck = false;
    }
  }

  listOfColumn: ColumnItem[] = [
    {
      title: 'Id',
      compare: (a: ItemData, b: ItemData) => a.id - b.id,
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null

    },
    {
      title: '標題',
      compare: (a: ItemData, b: ItemData) => a.title.localeCompare(b.title),
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      title: '創建日期',
      compare: (a: ItemData, b: ItemData) => a.startTime.localeCompare(b.startTime),
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      title: '結束日期',
      compare: (a: ItemData, b: ItemData) => a.endTime.localeCompare(b.endTime),
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null
    },
    {
      title: '狀態',
      compare: (a: ItemData, b: ItemData) => a.status.localeCompare(b.status),
      filterMultiple: true,
      listOfFilter: [
        { text: '編輯中', value: '編輯中'},
        { text: '收集中', value: '收集中'},
        { text: '已結束', value: '已結束'},
        { text: '未開始', value: '未開始'}
      ],
      filterFn: (list: string[], item: ItemData) => list.some(status => item.status.indexOf(status) !== -1)
    }
  ];
  // listOfData: ItemData[] = [
  //   {
  //     id: 1,
  //     title: 'John Brown',
  //     startTime: "2025-02-03 10:25:12",
  //     endTime: "2025-02-28",
  //     status: '編輯中'
  //   },
  //   {
  //     id: 2,
  //     title: 'Jim Green',
  //     startTime: "2025-03-01 12:33:12",
  //     endTime: "2025-04-11",
  //     status: '已結束'
  //   },
  //   {
  //     id: 3,
  //     title: 'Joe Black',
  //     startTime: "2025-01-05 20:25:33",
  //     endTime: "2025-02-28",
  //     status: '收集中'
  //   },
  //   {
  //     id: 4,
  //     title: 'Jim Red',
  //     startTime: "2025-03-13 09:25:12",
  //     endTime: "2025-03-31",
  //     status: '收集中'
  //   },
  //   {
  //     id: 10,
  //     title: 'John Brown',
  //     startTime: "2025-02-03 10:25:12",
  //     endTime: "2025-02-28",
  //     status: '編輯中'
  //   },
  //   {
  //     id: 12,
  //     title: 'Jim Green',
  //     startTime: "2025-03-01 12:33:12",
  //     endTime: "2025-04-11",
  //     status: '已結束'
  //   },
  //   {
  //     id: 7,
  //     title: 'Joe Black',
  //     startTime: "2025-01-05 20:25:33",
  //     endTime: "2025-02-28",
  //     status: '收集中'
  //   },
  //   {
  //     id: 9,
  //     title: 'Jim Red',
  //     startTime: "2025-03-13 09:25:12",
  //     endTime: "2025-03-31",
  //     status: '收集中'
  //   },
  //   {
  //     id: 8,
  //     title: 'Andy',
  //     startTime: "2025-02-03 10:25:12",
  //     endTime: "2025-02-28",
  //     status: '編輯中'
  //   },
  //   {
  //     id: 20,
  //     title: 'Jim Green',
  //     startTime: "2025-03-01 12:33:12",
  //     endTime: "2025-04-11",
  //     status: '已結束'
  //   },
  //   {
  //     id: 13,
  //     title: 'Yoci',
  //     startTime: "2025-01-05 20:25:33",
  //     endTime: "2025-02-28",
  //     status: '收集中'
  //   },
  //   {
  //     id: 24,
  //     title: 'Jim Red',
  //     startTime: "2025-03-13 09:25:12",
  //     endTime: "2025-03-31",
  //     status: '收集中'
  //   }
  // ];



}

interface ItemData {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: string;

}

interface ColumnItem {
  title: string;
  compare: NzTableSortFn<ItemData> | null;
  filterMultiple: boolean;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<ItemData> | null;
}


