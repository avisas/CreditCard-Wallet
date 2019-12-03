<template>
  <div class="wallet">
    <div class="card m-4">
    <div class="card-header">My Cards</div>
      <div class="card-body">
        <ul v-for="card in cards" :key="card.id">
          <li>
        {{card}}
          <b-button v-b-modal="`modal-rm-${card.id}`">Remove</b-button>
          <b-modal :id="`modal-rm-${card.id}`" ok-title="Yes" @ok="removeCard">
            <img src="../assets/remove-card-icon.svg">
            <h4>Remove card</h4>
            <p class="my-4">
            Are you sure you want to remove from wallet?
            </p>
          </b-modal>

          <b-button v-b-modal="`modal-sd-${card.id}`">Set Default</b-button>
          <b-modal :id="`modal-sd-${card.id}`" ok-title="Yes" @ok="setDefault">
            <img src="../assets/default-card-icon.svg">
            <h4>Change default card</h4>
            <p class="my-4">
            This card will appear as a primary option for your payment.
            Are your sure you want to set this card as default?
            </p>
          </b-modal>
            </li>
          </ul>
        </div>
    </div>
  
    <div class="card m-4">
    <div class="card-header">+ Add New Card</div>
      <div v-if="true" class="card-body">
        <label for="cardName">Name on Card</label>
        <input v-model.lazy.trim="cardName">
        <label for="cardNumber">Credit/ Debit Card Number</label>
        <input v-model.lazy.number="cardNumber">
        <label for="expMonth">Exp. Month</label>
        <select v-model.lazy.number="expMonth">
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
          <option value="04">04</option>
          <option value="05">05</option>
          <option value="06">06</option>
          <option value="07">07</option>
          <option value="08">08</option>
          <option value="09">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <label for="expYear">Exp. Year</label>
        <select v-model.lazy.number="expYear">
          <option value="2020">2020</option>
          <option value="2021">2021</option>          
        </select>
        <label for="securityCode">Security Code</label>
        <input v-model.lazy.number="secCode">
        <div class="col-m-2">
          <img src="../assets/Sectigo-trust-logo.png" alt="sectigo-logo" style="width: 10%">
          <button @click="addCard" class="add-card-btn" style="width: 80%">Add Card</button>
        </div>
      </div>
    </div>
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
    removeCard(bvModalEvt) {
      const selectedCardId = String(bvModalEvt.componentId).slice(9);
      const indexInArray = this.cards.findIndex(card => (card.id === selectedCardId));
      db.collection('cards').doc(selectedCardId).delete();
      this.cards.splice(indexInArray, 1);
      if (this.cards.length) { // There must always be a default card
        const foundDefaultCard = this.cards.find(currentCard => currentCard.isDefault);
        if (!foundDefaultCard) {
          this.cards[0].isDefault = true;
          db.collection('cards').doc(this.cards[0].id).update({
            isDefault: true,
          });
        }
      }
    },
    setDefault(bvModalEvt) {
      const selectedCardId = String(bvModalEvt.componentId).slice(9);
      this.cards.forEach((card) => {
        if (card.id === selectedCardId) {
          this.setDefaultValueById(card.id, true);
          db.collection('cards').doc(card.id).update({
            isDefault: true,
          });
        } else {
          this.setDefaultValueById(card.id, false);
          db.collection('cards').doc(card.id).update({
            isDefault: false,
          });
        }
      });
    },
    setDefaultValueById(cardId, isDefault) {
      const foundCard = this.cards.find(currentCard => currentCard.id === cardId);
      if (foundCard) foundCard.isDefault = isDefault;
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
      const time = new Date().toLocaleTimeString('es-GB');
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
.add-card-btn{
  border: none;
  background-color: #52d03e;
  color: white;
  border-radius: 8px;
}
</style>
