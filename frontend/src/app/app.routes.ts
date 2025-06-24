import { Routes } from '@angular/router';
import { LoginComponent } from './login-register/login.component';
import { TopbarComponent } from './topbar-Home/topbar.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { EditContentComponent } from './content-management/edit-content/edit-content.component';
import { FeedbackComponent } from './content-management/feedback/feedback.component';
import { CountComponent } from './content-management/count/count.component';
import { MemberComponent } from './content-management/member/member.component';
import { BackDirectionsComponent } from './content-management/back-directions/back-directions.component';
import { EditAddingComponent } from './edit-adding/edit-adding.component';
import { routerValidGuard } from './@services/router-valid.guard';
import { ReviewComponent } from './review/review.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: '', component: TopbarComponent},
    { path: 'questionnaire', component: QuestionnaireComponent},
    { path: 'adding', component: EditAddingComponent},
    { path: 'review', component: ReviewComponent},
    { path: 'management', component: ContentManagementComponent,
      canActivate: [routerValidGuard],
      children:[
        { path: 'welcome', component: BackDirectionsComponent },
        { path: 'feedback', component: FeedbackComponent },
        { path: 'count', component: CountComponent },
        { path: 'member', component: MemberComponent },
        { path: 'edit', component: EditContentComponent}
      ]
    },
]
