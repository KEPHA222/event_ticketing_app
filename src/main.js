import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';


Vue.use(VueTextareaAutosize);

Vue.config.productionTip = false

firebase.initializeApp({
    apiKey: "AIzaSyCPtmCrn-3YMMzZ3otVBGkjl_MuxnxJ5Qs",
    authDomain: "event-ticket-f8698.firebaseapp.com",
    projectId: "event-ticket-f8698",
    storageBucket: "event-ticket-f8698.appspot.com",
    messagingSenderId: "977488855484",
    appId: "1:977488855484:web:634305ade01f262c3bebb9"
});

export const db = firebase.firestore();

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
