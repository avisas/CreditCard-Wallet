<template>
  <div class="wallet">
  <div class="main-cards">
    <div class="card-hd">My Cards</div>
      <ul class="cards-container">
        <li class="item-card" v-for="card in cards" :key="card.id">
        <!-- {{card}} -->
        <img class="icon-check-my-card" :src="getCheckIconPath(card.isDefault)">
        <div class="card-container">
          <div class="info-card-container">
              <img class="icon-type-card" :src="getCardIconPath(card.type)">
              <div class="info-card">
                <p >{{card.type}} **** **** **** {{String(card.cardNumber).slice(-4)}}</p>
                <p >Ex.Date: {{card.expMonth}}/{{card.expYear}}</p>
              </div>
          </div>
          <div class="btn-rm-sd">
                  <button v-b-modal="`modal-rm-${card.id}`">Remove</button>
                  <button v-b-modal="`modal-sd-${card.id}`">Set Default</button>
          </div>
        </div>
        <b-modal  :id="`modal-rm-${card.id}`" ok-title="Yes" @ok="removeCard">
          <img src="../assets/remove-card-icon.svg" style="width: 25%">
            <h4>Remove card</h4>
            <p class="my-4">
            Are you sure you want to remove from wallet?
            </p>
          </b-modal>

          <b-modal :id="`modal-sd-${card.id}`" ok-title="Yes" @ok="setDefault">
            <img src="../assets/default-card-icon.svg" style="width: 25%">
            <h4>Change default card</h4>
            <p class="my-4">
            This card will appear as a primary option for your payment.
            Are your sure you want to set this card as default?
            </p>
          </b-modal>
            </li>
        </ul>
    </div>
    <div class="main-cards main-cards-more">
    <div class="card-hd">+ Add New Card</div>
      <form v-if="true" class="card-body">
        <div class="major-cards">
          <div class="info-accept-cards">
          <img class="icon-check-new-card" src="../assets/ok-green-ico.svg">
          <label class="p-accept-cards">
            <strong>We Accept All Major Debit/ Credit Cards</strong></label>
        </div>
          <img class="img-all-cards" src="../assets/payment-methods.jpg">
        </div>

       <div class="input-new-cards">
         <div>
           <label for="cardName">Name on Card</label>
           <input v-model.lazy.trim="cardName" required>
           </div>
        <div><label for="cardNumber">Credit/ Debit Card Number</label>
        <input v-model.lazy.number="cardNumber" type="number" required></div>
        <div><label for="expMonth">Exp. Month</label>
        <select v-model.lazy.number="expMonth" required>
          <option v-for="month in months" :value="month.val" :key="month.val">
            {{month.desc}}
          </option>
        </select></div>
        <div><label for="expYear">Exp. Year</label>
        <select v-model.lazy.number="expYear" required>
          <option v-for="year in years" :value="year.val" :key="year.val">
            {{year.desc}}
          </option>
        </select></div>
        <div><label for="securityCode">Security Code</label>
        <input v-model.lazy.number="secCode" type="number" required></div>
      <div class="add-card-container">
          <img src="../assets/sectigo-trust-logo.png" alt="sectigo-logo">
          <button @click="addCard" class="add-card-btn">Add Card</button>
        </div>

       </div>
      </form>
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
      months: [
        { desc: 'Jan', val: '01' },
        { desc: 'Feb', val: '02' },
        { desc: 'Mar', val: '03' },
        { desc: 'Apr', val: '04' },
        { desc: 'May', val: '05' },
        { desc: 'Jun', val: '06' },
        { desc: 'Jul', val: '07' },
        { desc: 'Aug', val: '08' },
        { desc: 'Sep', val: '09' },
        { desc: 'Oct', val: '10' },
        { desc: 'Nov', val: '11' },
        { desc: 'Dec', val: '12' },
      ],
      years: [
        { desc: '2019', val: '2019' },
        { desc: '2020', val: '2020' },
        { desc: '2021', val: '2021' },
        { desc: '2022', val: '2022' },
        { desc: '2023', val: '2023' },
        { desc: '2024', val: '2024' },
        { desc: '2025', val: '2025' },
        { desc: '2026', val: '2026' },
      ],
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
      this.reorderSetDefault();
    },
    setDefaultValueById(cardId, isDefault) {
      const foundCard = this.cards.find(currentCard => currentCard.id === cardId);
      if (foundCard) foundCard.isDefault = isDefault;
    },
    reorderSetDefault() {
      const indexInArray = this.cards.findIndex(card => card.isDefault);
      if (indexInArray > 0) {
        const cardAtIndex = this.cards[indexInArray];
        this.cards.splice(indexInArray, 1);
        this.cards.unshift(cardAtIndex);
      }
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
      this.reorderSetDefault();
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
    getCheckIconPath(isDefault) {
      const path = isDefault ? 'ok-green-ico.svg' : 'ok-gray-ico.png';
      const generateImagePath = require.context('../assets/', false, /\.png$|\.svg$/);
      return generateImagePath(`./${path}`);
    },
    getCardIconPath(cardType) {
      let path = '';
      switch (cardType) {
        case 'VISA':
          path = 'visa-card-logo.svg';
          break;
        case 'AMEX':
          path = 'amex-card-logo.svg';
          break;
        case 'MASTERCARD':
          path = 'mastercard-card-logo.svg';
          break;
        case 'DISCOVER':
          path = 'discover-card-logo.png';
          break;
        default:
          path = 'unknown-card-logo.png';
      }
      const generateImagePath = require.context('../assets/', false, /\.png$|\.svg$/);
      return generateImagePath(`./${path}`);
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
button, a, input, select{
    outline: none;
  }

  /* Modales */
.modals {
   background-color: #52d03e !important;
}
  /* Fin Modales */

.main-cards{
max-width: 900px;
    margin: auto;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
    box-shadow: 0px 0px 13px -5px #606060;
    }
.card-hd{
      text-align: left;
    border-bottom: 1px solid #e6e6e6;
    padding: 20px;
    color: #426aa0;
    font-weight: 500;
    font-size: 18px;
}
.cards-container{
  width: 100%;
    padding: 15px 12px 0px;
}
.icon-check-my-card{
  width: 14px;
  margin-right: 18px;
}
.item-card{
  display: flex;
    align-items: center;
    background-color: #fafafa;
    margin-bottom: 10px;
    padding: 20px;
}
.info-card-container{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
    min-width: 200px;
    margin: 10px 0;
}

.card-container{
  width: calc(100% - 32px);
}
.icon-type-card{
  width: 95px;
    margin-right: 20px;
    margin: 0px 14px 10px 0px;
}
.info-card{
  color: #6c757d;
  text-align: left;

}
.info-card p{
  margin: 0

}
.info-card p:nth-child(1){
  font-size: 12px;

}
.info-card p:nth-child(2){
  font-size: 10px;

}
.btn-rm-sd{
  min-width: 200px;
  display: flex;
  justify-content: space-between;
}
.btn-rm-sd button{
  background-color: initial;
  color: #c2c2c2;
  border: initial;
  font-size: 12px;
  text-decoration: underline;
  font-weight: bold;
}
.main-cards-more{
  margin-top: 16px;
  margin-bottom: 40px;
}
.major-cards{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}
.input-new-cards{
  text-align: center;
}
.input-new-cards label{
  margin: 0;
  width: 90%;
  text-align: left;
  font-size: 15px;
  margin-bottom: 0px;
}

.input-new-cards input,
.input-new-cards select{
     width: 90%;
    border-radius: 5px;
    border: 1px solid #9ac193;
    height: 30px;
    margin-bottom: 8px;
}

.info-accept-cards{
  display: flex;
  width: 200px;
  font-size: 15px;
  line-height: 18px;
}

.icon-check-new-card{
  width: 38px;
  height: 38px;
  margin-right: 10px;
}

.p-accept-cards{
  color: #52d03e;
}
.img-all-cards{
  width: 285px;
}
.add-card-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.add-card-container img{
  width: 100px;
  margin: 5px 0 5px;
}
.add-card-btn{
 border: none;
  background-color: #52d03e;
  color: white;
  border-radius: 8px;
  width: 90%;
  padding: 6px 10px;
  flex-grow: 1;
  height: 37px;
}

@media (min-width: 600px) {
  .card-container{
    width: calc(100% - 32px);
    display: flex;
    justify-content: space-between;
  }
  .icon-type-card{
    margin: 0px 16px 0px 0px;
}
.info-card-container
.btn-rm-sd{
  justify-content: flex-end;
  }
  .cards-container {
    width: 100%;
    padding: 15px 20px 0px;
}

.major-cards{
  justify-content: left;
}
.input-new-cards{
 display: flex;
    flex-wrap: wrap;
    text-align: initial;
}
.input-new-cards div:not(.add-card-container)
.input-new-cards div:not(.add-card-container):nth-child(1),
.input-new-cards div:not(.add-card-container):nth-child(2){
    width: 27%;
    min-width: 200px;
    flex-grow: 1;
}
.input-new-cards div:not(.add-card-container):nth-child(3),
.input-new-cards div:not(.add-card-container):nth-child(4),
.input-new-cards div:not(.add-card-container):nth-child(5){
  width: 14%;
    min-width: 110px;
}

.input-new-cards input,
.input-new-cards select{
     width: 90%;
    border-radius: 5px;
    border: 1px solid #9ac193;
    height: 30px;
    margin-bottom: 8px;
}

.info-accept-cards{
  display: flex;
    width: 200px;
    font-size: 15px;
    line-height: 18px;
}

.p-accept-cards{
  color: #52d03e;
}
.img-all-cards{
  width: 285px;
}
.add-card-container{
   width: 100%;
      display: flex;
    margin-top: 10px;
}
.add-card-container img{
  width: 100px;
    margin: 5px 0 5px;
}
.add-card-btn{
     width: 76%;
    padding: 0px 12px;
    margin: 0 10px;
}
}


</style>
