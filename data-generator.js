import { faker } from '@faker-js/faker';
import fs from 'fs';

const NUMBER_OF_ROWS = 100000;
const PATH_OF_FILE = './data.json';

function createMockData() {
  let data = [];

  const statuses = ['Paid', 'Paid', 'Paid', 'Chargeback', 'Pending', 'Expired', 'Failed'];
  const methods = ['Visa', 'Mastercard', 'Paypal'];

  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    const date = faker.date.past();
    data.push({
      id: i + 1,
      name: [faker.name.firstName(), faker.name.lastName()].join(" "),
      date: date,
      date_timestamp: date.getTime() / 1000,
      total: Math.round(Math.random() * 1000 + Math.random() * 100 + Math.random() * 10),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      method: methods[Math.floor(Math.random() * methods.length)]
    });
  }

  return data;
}

let data = JSON.stringify(createMockData());

fs.writeFile(PATH_OF_FILE, data, { flag: 'wx' }, function(err) {
  if (err) throw err;
  console.log("It's saved!");
});
