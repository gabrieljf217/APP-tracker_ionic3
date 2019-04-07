import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { Slides,AlertController  } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public loadigCtrl:LoadingController,
              public _usurioprovider: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.slides.paginationType='progress';
    this.slides.lockSwipes(true);
    this.slides.freeMode=false;
  }

  mostrarInput(){
    this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ingresar',
          handler: data => {
            this.verificarUsuario( data.username )
          }
        }
      ]
    }).present();
  }

  verificarUsuario(clave:string){
    let loading = this.loadigCtrl.create({
      content: 'Verificando'
    });
    loading.present();
    this._usurioprovider.verificaUsuario(clave)
      .then(existe=>{
        loading.dismiss();
        if (existe) {
          this.slides.lockSwipes(false);
          this.slides.freeMode=true;
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.slides.freeMode=false;
        } else {
          this.alertCtrl.create({
            title:'Usuario incorrecto',
            subTitle: 'Comuniquese con el administrador o pruebe de nuevo',
            buttons: ['Aceptar']
          }).present();
        }
      });
  }

  ingresar(){
    this.navCtrl.setRoot(HomePage);
  }

}
