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
    <ul>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
    <form @submit="checkForm" method="post">
      <div>
        <label for="nameCard">Name on Card</label>
        <div>
          <input v-model="cardName" type="text" id="cardName">
          <p>cardname: {{cardName}}</p>
        </div>
      </div>
      <div>
        <label for="cardNumber">Credit/ Debit Card Number</label>
        <div>
          <input v-model.number="cardNumber" type="number" id="cardNumber">
        </div>
      </div>
      <div>
        <label for="expMonth">Exp. Month</label>
        <div>
          <input v-model="expMonth" type="text" id="expMonth">
        </div>
      </div>
      <div>
        <label for="expYear">Exp. Year</label>
        <div>
          <input v-model="expYear" type="number" id="expYear">
        </div>
      </div>
      <div>
        <label for="securityCode">Security Code</label>
        <div>
          <input v-model.number="securityCode" type="number" id="securityCode">
        </div>
      </div>
      <img>
      <button @click="addCard">Add Card</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Wallet',
  data() {
    return {
      cards: [
        { id: '1', type: 'visa', isDefault: false, number: 1234567891254785, expDate: '10/2023' },
        { id: '2', type: 'mastercard', isDefault: false, number: 1234567854254785, expDate: '06/2025' },
        { id: '3', type: 'amex', isDefault: true, number: 1234567891256985, expDate: '05/2022' },
        { id: '4 ', type: 'diners', isDefault: false, number: 1234867891256985, expDate: '05/2026' },
        { id: '5 ', type: 'club', isDefault: false, number: 1233867891256985, expDate: '05/2023' },
      ],
      cardName: 'visa',
      initData: {
        cardNumber: null,
        expMonth: null,
        expYear: null,
        securityCode: null,
      },
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
    // addCard(event) {
    // }
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
