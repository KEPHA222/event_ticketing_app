<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
        <v-btn
            class="mr-4"
            color="primary"
            @click="dialog = true"
          >
            New Event
          </v-btn>
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <!-- Add event dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">

              <v-text-field v-model="name" type="text" label="event name (required)">
              </v-text-field>
              <v-text-field v-model="details" type="text" label="detail">
              </v-text-field>
              <v-text-field v-model="start" type="date" label="start (required)"></v-text-field>
              <v-text-field v-model="end" type="date" label="end (required)"></v-text-field>
              <v-text-field v-model="price" type="text" label="Ticket price in $ (Dollars)"></v-text-field>
              <v-text-field v-model="color" type="color" label="color (click to open color menu)"></v-text-field>
              <v-btn type="submit" color="primary"  class="mr-4" @click.stop="dialog=false" >Create Event</v-btn>

            </v-form>
          </v-container>
        </v-card>
      </v-dialog>


    <!-- Paying Form -->
    <v-dialog max-width="500">
        <v-card>
          <v-container>
                <section class="row payment-form">

                    <div class="error red center-align white-text">{{stripeValidationError}}</div>

                    <div  class="col s12 card-element">
                      <v-text-field v-model="cardNumberElement" type="number" label="Card No.(required)"></v-text-field>
                        <div id="card-number-element" class="input-value" > 
                        </div>
                    </div>                       

                    <div class="col s6 card-element">
                      <v-text-field v-model="cardExpiryElement" type="date" label="Expiry Date (required)"></v-text-field>
                        <div id="card-expiry-element"></div>
                    </div>

                    <div class="col s6 card-element">
                      <v-text-field v-model="cardCVCElement" type="number" label="CVC (required)"></v-text-field>
                        <div id="card-cvc-element"></div>
                    </div>

                    <div class="col s12 place-order-button-block">
                        <v-btn type="submit" class="btn col s12 #e91e63 pink" @click="placeOrderButtonPressed" @click.stop="dialog=false" >Place Order</v-btn>
                    </div>
                </section>
          </v-container>
        </v-card>
      </v-dialog>



      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              

      

              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-toolbar-title v-html="'. Ticket price costs $' + selectedEvent.price"></v-toolbar-title>



              <!-- Buying Ticket -->
              <v-btn @click="placeOrderButtonPressed(selectedEvent.id)" icon>
                <v-icon>mdi-shopping</v-icon>
              </v-btn>



              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                  {{selectedEvent.details}}
              </form>
              <form v-else>
                  <textarea-autosize
                      v-model="selectedEvent.details"
                      type="text"
                      style="width: 100%"
                      :min-height="100"
                      placeholder="add event name">
                  </textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Close
              </v-btn>
              <v-btn text v-if="currentlyEditing !== selectedEvent.id" @click.prevent="editEvent(selectedEvent)" >Edit</v-btn>

              <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '@/main';
export default {
    data: () => ({
        today: new Date().toISOString().substr(0, 10),
        focus: new Date().toISOString().substr(0, 10),
        type: "month",
        typeToLabel: {
            month: "Month",
            week: "Week",
            day: "Day",
            "4day": "4 Days"
        },
        name: null,
        details: null,
        start: null,
        end: null,
        price: null,
        color: "#1976D2",
        currentlyEditing: null,
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        events: [],
        dialog: false,


        // Stripe data
        stripe: null,
        cardNumberElement: null,
        cardExpiryElement: null,
        cardCVCElement: null,
        stripeValidationError: "",
        // amount:25

    }),

    mounted() {
        this.getEvents();

        // Stripe data
        /* global Stripe */
        this.stripe = Stripe("pk_test_51GqYXmCBi5rQFo0PQrXjoL5X7ewz9Sc6vZHrv8NE72s5glBJBSymgYXJSQe4gVeYtZaANr0NWVtgx90jNlwilV4t00Ajaelozh");
        this.createAndMountFormElements();
        
        
    },
    methods: {
        async getEvents() {
            let snapshot = await db.collection("calEvent").get();
            let events = [];
            snapshot.forEach(doc => {
                let appData = doc.data();
                appData.id = doc.id;
                events.push(appData);
            });
            this.events = events;
        },
        
        async addEvent() {
          if(this.name && this.start && this.end) {
            await db.collection('calEvent').add({
              name: this.name,
              details: this.details,
              start: this.start,
              end: this.end,
              price: this.price,
              color: this.color
            });
            this.getEvents();
            this.name = "";
            this.details = "";
            this.start = "";
            this.end = "";
            this.price = "";
            this.color = "#1976D2";

          } else {
            alert('Name, start and end date are required');
          }
        },

        async updateEvent(ev) {
            await db.collection("calEvent").doc(this.currentlyEditing).update({
                details: ev.details
            });
            this.selectedOpen = false;
            this.currentlyEditing = null;
        },
        
        async deleteEvent(ev) {
          await db.collection('calEvent').doc(ev).delete();

          this.selectedOpen = false;
          this.getEvents();
        },

        viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      editEvent(ev) {
          this.currentlyEditing = ev.id;
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
        

      // Stripe API methods
      createAndMountFormElements() {
            var elements = this.stripe.elements();
            this.cardNumberElement = elements.create("cardNumber");
            this.cardNumberElement.mount("#card-number-element");
            this.cardExpiryElement = elements.create("cardExpiry");
            this.cardExpiryElement.mount("#card-expiry-element");
            this.cardCvcElement = elements.create("cardCvc");
            this.cardCvcElement.mount("#card-cvc-element");
            this.cardNumberElement.on("change", this.setValidationError);
            this.cardExpiryElement.on("change", this.setValidationError);
            this.cardCvcElement.on("change", this.setValidationError);
        },

        setValidationError(event) {
            this.stripeValidationError = event.error ? event.error.message : "";
        },
        placeOrderButtonPressed() {
            this.stripe.createToken(this.cardNumberElement).then(result => {
                if (result.error) {
                    this.stripeValidationError = result.error.message;
                } else {
                    var stripeObject = {
                        amount: this.amount,
                        source: result.token
                    };
                    this.saveDataToFireStore(stripeObject);
                }
            });
        },
        saveDataToFireStore(stripeObject) {
            // const db = firebase.firestore()
            const chargesRef = db.collection("charges")
            const pushId = chargesRef.doc().id
            db.collection("charges").doc(pushId).set(stripeObject)
            chargesRef.doc(pushId).onSnapshot(snapShot => {
                 const charge = snapShot.data();
                        if (charge.error) {
                            alert(charge.error);
                            chargesRef
                            .doc(pushId)
                            .delete();
                            return;
                        }
                        if (charge.status && charge.status == "succeeded") {
                            alert(charge.status);
                        }
            })
        }
    }
}
</script>


<style>
.payment-form {
    max-width: 400px;
    margin: 20px auto;

}
.payment-form h5 {
    margin: 0;
    padding: 10px;
    font-size: 1.2rem;
}
.card-element {
    margin-top: 5px;
}
#card-number-element,
#card-expiry-element,
#card-cvc-element {
    background: white;
    padding: 5px;
    padding-right: 100px;

}
.place-order-button-block {
    margin: 10px 0;
}
</style>