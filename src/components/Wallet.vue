<template>
  <div class="wallet">
    <hr>
    <h2>My Cards</h2>
    <ul v-for="card in cards" :key="card.id">
      <li>
        {{card}}
        <button :id="`rm-${card.id}`" @click="removeCard($event)">Remove</button>
        <button :id="`sd-${card.id}`" @click="setDefault($event)">Default</button>
      </li>
    </ul>
    <hr>
    <h2>+ Add New Card</h2>
      <div>
        <label for="nameCard">Name on Card</label>
          <input v-model.lazy.trim="cardName" type="text">
          <p>Name on card is: {{ cardName }}</p>
        <label for="cardNumber">Credit/ Debit Card Number</label>
          <input v-model.lazy.number="cardNumber" type="number" id="cardNumber">
          <p>Card number is: {{cardNumber}}</p>
        <label for="expMonth">Exp. Month</label>
          <input v-model.lazy.number="expMonth" type="text" id="expMonth">
          <p>Expiration Month is: {{expMonth}}</p>
        <label for="expYear">Exp. Year</label>
          <input v-model.lazy.number="expYear" type="number" id="expYear">
          <p>Expiration number is: {{expYear}}</p>
        <label for="securityCode">Security Code</label>
          <input v-model.lazy.number="securityCode" type="number" id="securityCode">
          <p>security code is: {{securityCode}}</p>
      </div>
      <img>
      <button @click="addCard">Add Card</button>
  </div>
</template>

<script>
export default {
  name: 'Wallet',
  data() {
    return {
      cards: [
        { id: '1', type: 'visa', cardName:'Visa', isDefault: false, number: 1234567891254785, expDate: '10/2023', secCode:526 },
        { id: '2', type: 'mastercard', cardName:'Mastercard', isDefault: false, number: 1234567854254785, expDate: '06/2025', secCode:821 },
        { id: '3', type: 'amex',  cardName:'Amex', isDefault: true, number: 1234567891256985, expDate: '05/2022', secCode:954 },
        { id: '4', type: 'diners', cardName:'Dinners Club', isDefault: false, number: 1234867891256985, expDate: '05/2026', secCode:176 },
        { id: '5', type: 'club', cardName:'Club', isDefault: false, number: 1233867891256985, expDate: '05/2023', secCode:347 },
      ],
      cardName: '',
      cardNumber: '',
      expMonth: '',
      expYear: '',
      securityCode: '',
    };
  },
  methods: {
    removeCard(event) {
      const selectedCardId = String(event.currentTarget.id).slice(3);
      const indexInArray = this.cards.findIndex(card => (card.id === selectedCardId));
      this.cards.splice(indexInArray, 1);
      if (this.cards.length) {
        const foundDefaultCard = this.cards.find(currentCard => currentCard.isDefault);
        if (foundDefaultCard === undefined) {
          this.cards[0].isDefault = true;
        }
      }
    },
    setDefault(event) {
      const selectedCardId = String(event.currentTarget.id).slice(3);
      this.cards.forEach((card) => {
        if (card.id === selectedCardId) {
          card.isDefault = true;
          const temporalObject = { ...card };
          const indexInArray = this.cards.findIndex(currentCard => (currentCard.id === selectedCardId));
          this.cards.splice(indexInArray, 1);
          this.cards.unshift(temporalObject);
        } else {
          card.isDefault = false;
        }
      });
    },
    addCard() {
      const newCardObj = {
        id: 6,
        type: `${this.type}`,
        cardName: `${this.cardName}`,
        isDefault: false,
        number: this.cardNumber,
        expDate: `${this.expMonth}/${this.expYear}`,
        securityCode: `${this.securityCode}`
      };
      this.cards.push(newCardObj);
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
