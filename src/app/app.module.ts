import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PanelComponent } from './pages/panel/panel.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DetailComponent } from './pages/detail/detail.component';
import { SimulatorComponent } from './pages/simulator/simulator.component';
// FIREBASE
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from '@firebase/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalCreditsComponent } from './pages/personal-credits/personal-credits.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PanelComponent,
    FooterComponent,
    HeaderComponent,
    DetailComponent,
    SimulatorComponent,
    PersonalCreditsComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
