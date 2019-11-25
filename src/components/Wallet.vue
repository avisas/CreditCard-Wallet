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
    <form class="form">
      <div>
        <label>Name on Card</label>
        <div>
          <input type="text" id="cardName">
        </div>
      </div>
      <div>
        <label>Credit/ Debit Card Number</label>
        <div>
          <input type="text" id="cardNumber">
        </div>
      </div>
      <div>
        <label>Exp. Month</label>
        <div>
          <input type="text" id="expMonth">
        </div>
      </div>
      <div>
        <label>Exp. Year</label>
        <div>
          <input type="text" id="expYear">
        </div>
      </div>
      <div>
        <label>Security Code</label>
        <div>
          <input type="text" id="securityCode">
        </div>
      </div>
      <img>
      <button type="submit">Add Card</button>

    </form>
  </div>
</template>

<script>
export default {
  name: 'Wallet',
  data() {
    return {
      cards: [
        { id: '1', type: 'visa', isDefault: true, number: 1234567891254785, expDate: '10/2023' },
        { id: '2', type: 'mastercard', isDefault: false, number: 1234567854254785, expDate: '06/2025' },
        { id: '3', type: 'amex', isDefault: false, number: 1234567891256985, expDate: '05/2022' },
      ],
    };
  },
  methods: {
    removeCard(event) {
      const targetId = String(event.currentTarget.id).slice(3);
      const indexInArray = this.cards.findIndex(card => (card.id === targetId));
      this.cards.splice(indexInArray, 1);
      // console.log(`${indexInArray}, ${targetId}`);
    },
    setDefault(event) {
      // const targetId = event.currentTarget.id;
      // console.log(targetId);
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
