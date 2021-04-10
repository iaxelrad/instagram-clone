import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
// import { seedDatabase } from '../seed'; Don't uncomment or simply delete after first and only run

const firebase = Firebase.initializeApp(firebaseConfig);
const { FieldValue } = Firebase.firestore;

// seedDatabase(firebase); - Don't uncomment or simply delete after first and only run.

export { firebase, FieldValue };
