import firebase from 'firebase/app';
import 'firebase/firestore';

import { config } from '../shared';

if (!firebase.apps.length) {
  firebase.initializeApp(config.firebaseConfig);
}

const db = firebase.firestore();

export {
  db
};
