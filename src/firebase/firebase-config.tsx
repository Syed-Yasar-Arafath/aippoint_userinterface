import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAPvyp08Y56anRc0MZX-iDBm7PsPzOtr8o',
  authDomain: 'parseez-a621c.firebaseapp.com',
  projectId: 'parseez-a621c',
  storageBucket: 'parseez-a621c.appspot.com',
  messagingSenderId: '408473626506',
  appId: '1:408473626506:web:351fb99e5014a501c2ca73',
  measurementId: 'G-SBKMSY0J6Y',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
