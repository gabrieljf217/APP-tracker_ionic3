import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UsuarioProvider } from '../usuario/usuario';
import { Subscription } from 'rxjs';

@Injectable()
export class UbicacionProvider {

  taxista: AngularFirestoreDocument<any>;
  private watch: Subscription;

  constructor(private geolocation: Geolocation,
              public _usuarioProv:UsuarioProvider,
              public afDB:AngularFirestore) {
    
  }

  iniciarTaxista(){
    this.taxista = this.afDB.doc(`/usuarios/${ this._usuarioProv.clave }`)
  }

  iniciarGeolocalizacion(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.taxista.update({
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
        clave: this._usuarioProv.clave,
      });

      this.watch = this.geolocation.watchPosition()
        .subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
        this.taxista.update({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
          clave: this._usuarioProv.clave,
        });
      });
      
    }).catch((error) => {
      console.log('Error obteniendo localizacion', error);
    });
  }

  detenerUbicacion(){
    try {
      this.watch.unsubscribe();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
    
  }

}
