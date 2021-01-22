import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { PopoverPageModule } from './popover/popover.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalPageModule} from './modal/modal.module';
import { PopoverhelpPageModule } from './popoverhelp/popoverhelp.module';
import { PopoverreservaPageModule } from './popoverreserva/popoverreserva.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    RouterModule,
    PopoverPageModule,
    PopoverhelpPageModule,
    PopoverreservaPageModule,
    ReactiveFormsModule,
    ModalPageModule,
    IonicModule.forRoot({hardwareBackButton: false})
  ],
  providers: [
    StatusBar,
    SplashScreen, File, FileChooser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
