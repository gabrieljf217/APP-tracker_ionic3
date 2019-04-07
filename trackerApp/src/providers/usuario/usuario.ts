import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Injectable()
export class UsuarioProvider {

  clave:string;
  user:any = {};

  documento:Subscription

  constructor(private afDB: AngularFirestore,
              private platform:Platform,
              private storage: Storage) {

  }

  verificaUsuario(clave:string){
    clave= clave.toLowerCase();
    return new Promise( (resolve,reject)=>{
      this.documento = this.afDB.doc(`/usuarios/${ clave }`)
        .valueChanges().subscribe( data =>{
          if(data){
            //correcto
            this.clave = clave;
            this.user = data;
            this.guardarStorage();
            resolve(true);
          }else{
            //incorrecto
            resolve(false);
          }
        });
    });
  }

  guardarStorage(){
    if (this.platform.is('cordova')) {
      //celular
      this.storage.set('clave', this.clave);
    } else {
      //escritorio
      localStorage.setItem('clave', this.clave);
    }
  }

  cargarStorage(){
    return new Promise((resolve,reject)=>{
      if (this.platform.is('cordova')) {
        //celular
        this.storage.get('clave').then( val =>{
          if (val) {
            this.clave = val;
          } else {
            resolve(false);
          }
        })
        this.storage.set('clave', this.clave);
      } else {
        //escritorio
        if(localStorage.getItem('clave')){
          this.clave = localStorage.getItem('clave');
          resolve(true);
        }else{
          resolve(false);
        }
      }
    });
  }

  borrarUsuario(){
    this.clave = null;
    if (this.platform.is('cordova')) {
      this.storage.remove('clave');
    } else {
      localStorage.removeItem('clave');
    }
    this.documento.unsubscribe();
  }

}
