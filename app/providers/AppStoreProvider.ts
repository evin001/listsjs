import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { IDataStoreProvider } from 'lists-core/boundaries/IDataStoreProvider';
import { apiKey, projectId } from '~/frameworks';

export class AppStoreProvider implements IDataStoreProvider {
  public static getInstance() {
    if (!AppStoreProvider.instance) {
      AppStoreProvider.instance = new AppStoreProvider();
    }
    return AppStoreProvider.instance;
  }

  private static instance: AppStoreProvider;
  private static store: firebase.firestore.Firestore;

  private constructor() {}

  public getStore(): any {
    if (!AppStoreProvider.store) {
      const app = firebase.initializeApp({
        apiKey,
        authDomain: `${projectId}.firebaseapp.com`,
        projectId,
        // databaseURL: `https://${projectId}.firebaseio.com`,
        // storageBucket: `${projectId}.appspot.com`,
        // messagingSenderId: '36022833797',
        // appID: '1:36022833797:web:2b1539f90118c710',
      });
      AppStoreProvider.store = firebase.firestore(app);
    }
    return AppStoreProvider.store;
  }
}
