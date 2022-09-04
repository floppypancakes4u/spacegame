export let AllItems = [];
export let AllFoodItems = [];

class Item {
  constructor({ name }) {
    this.Name = name;
    AllItems[name] = this;
  }
}

class Food extends Item {
  constructor({ name }) {
    super({ name });
    this.foodValue = 0;

    AllFoodItems[this.Name] = this;
  }
}

new Food('Vegetable');
new Food('Fruit');
new Food('Vegetable');
new Food('Fish');

// class Food extends Item {
//   constructor({ name = "", calories = 1 }) {
//     super({ name, calories = 1 });
//     this.calories = 0;

//     AllFoodItems[this.Name] = this;
//   }
// }

// new Food({ name: 'Vegetable', calories: 2});
// new Food({ name: 'Fruit', calories: 1});
// new Food({ name: 'Livestock', calories: 10});
// new Food({ name: 'Fish', calories: 5});
