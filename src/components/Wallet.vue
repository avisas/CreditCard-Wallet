<template>
  <div class="wallet">
    <hr>
    <h2>My Cards</h2>
    <ul v-for="card in cards" :key="card.id">
      <li>
        {{card}}
        <button :id="`rm-${card.id}`" @click="removeCard($event)">Remove</button>
        <button :id="`sd-${card.id}`" @click="setDefault($event)">Set Default</button>
      </li>
    </ul>
    <hr>
    <h2>+ Add New Card</h2>
      <div>
        <label for="cardName">Name on Card</label>
        <input v-model.lazy.trim="cardName">
        <label for="cardNumber">Credit/ Debit Card Number</label>
        <input v-model.lazy.number="cardNumber">
        <label for="expMonth">Exp. Month</label>
        <input v-model.lazy.number="expMonth">
        <label for="expYear">Exp. Year</label>
        <input v-model.lazy.number="expYear">
        <label for="securityCode">Security Code</label>
        <input v-model.lazy.number="secCode">
      </div>
      <button @click="addCard">Add Card</button>
  </div>
</template>

<script>
import db from './firebaseInit';

export default {
  name: 'Wallet',
  data() {
    return {
      cards: [],
      cardName: '',
      cardNumber: '',
      expMonth: '',
      expYear: '',
      secCode: '',
    };
  },
  created() {
    this.getCardsFromDB();
  },
  methods: {
    removeCard(event) {
      const selectedCardId = String(event.currentTarget.id).slice(3);
      const indexInArray = this.cards.findIndex(card => (card.id === selectedCardId));
      db.collection('cards').doc(selectedCardId).delete();
      this.cards.splice(indexInArray, 1);
      if (this.cards.length) { // There must always be a default card
        const foundDefaultCard = this.cards.find(currentCard => currentCard.isDefault);
        if (foundDefaultCard === undefined) {
          this.cards[0].isDefault = true;
          db.collection('cards').doc(this.cards[0].id).update({
            isDefault: true,
          });
        }
      }
    },
    setDefault(event) {
      const selectedCardId = String(event.currentTarget.id).slice(3);
      this.cards.forEach((card) => {
        if (card.id === selectedCardId) {
          card.isDefault = true;
          db.collection('cards').doc(card.id).update({
            isDefault: true,
          });
        } else {
          card.isDefault = false;
          db.collection('cards').doc(card.id).update({
            isDefault: false,
          });
        }
      });
    },
    addCard() {
      const newCreditCard = {
        cardName: this.cardName,
        cardNumber: this.cardNumber,
        expMonth: this.expMonth,
        expYear: this.expYear,
        secCode: this.secCode,
        type: this.detectCardType(this.cardNumber),
        isDefault: false,
        creationDate: this.getCreationDate(),
      };
      db.collection('cards').add(newCreditCard);
      this.getCardsFromDB();
      this.clearModelFields();
    },
    getCreationDate() {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString('es-GB'); // get 24 hr format
      const dataTime = `${date} ${time}`;
      return dataTime;
    },
    clearModelFields() {
      this.cardName = '';
      this.cardNumber = '';
      this.expMonth = '';
      this.expYear = '';
      this.secCode = '';
    },
    getCardsFromDB() {
      this.cards = [];
      db.collection('cards').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const cardInDB = {
            id: doc.id,
            ...doc.data(),
          };
          this.cards.push(cardInDB);
        });
      });
    },
    // URL: https://stackoverflow.com/questions/5911236/identify-card-type-from-card-number
    detectCardType(number) {
      const re = {
        visa: /^4/,
        mastercard: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
        amex: /^3[47]/,
        discover: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
        diners: /^36/,
      };
      if (re.visa.test(number)) {
        return 'VISA';
      }
      if (re.mastercard.test(number)) {
        return 'MASTERCARD';
      }
      if (re.amex.test(number)) {
        return 'AMEX';
      }
      if (re.discover.test(number)) {
        return 'DISCOVER';
      }
      if (re.diners.test(number)) {
        return 'DINERS';
      }
      return 'UNKNOWN';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  font-weight: normal;
  text-align: left;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
