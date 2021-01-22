import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPage } from './tabs.page';
import * as firebase from 'firebase';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDMKDYKRn3c93owmhwBhSVyJuVTJ5UVosQ",
  authDomain: "lereserve-30a76.firebaseapp.com",
  databaseURL: "https://lereserve-30a76.firebaseio.com/",
  storageBucket: "lereserve-30a76.appspot.com",
};

const FIREBASE_API_REF = firebase.initializeApp(FIREBASE_CONFIG);

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //PRUEBA UNITARIA - FIREBASE INICIAR SESION Y REGISTRARSE
  beforeEach(() => {
    //Create a user with some credentials
    //If the user already exists, an erorr will be thrown
    firebase.auth().createUserWithEmailAndPassword("example@domain.com", "123456")
      .then((user: firebase.auth.UserCredential) => {
        //Try authenticating with the created user
        firebase.auth().signInWithEmailAndPassword("example@domain.com", "123456")
          .then((signedInUser: firebase.auth.UserCredential) => {
            let userInfo = signedInUser.user;
            if (userInfo != null) {
              expect(userInfo.email).toEqual("example@domain.com");
            }
          })
      })
  });
});
