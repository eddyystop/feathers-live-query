
const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const authentication = require('feathers-authentication/client');
const rx = require('feathers-reactive');
const RxJS = require('rxjs');
const io = require('socket.io-client');

console.log('..Client started');

const socket = io('http://localhost:3030');
const app = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(authentication({ storage: window.localStorage }))
  .configure(rx(RxJS));

app.service('messages').rx({
  idField: '_id',
  listStrategy: 'smart',
});

// Config messages
const messages = app.service('messages');
var messagesMirror;

/*
messages.on('created', messages => console.log('CREATED event:', messages.text));
messages.on('updated', messages => console.log('UPDATED event:', messages.text));
messages.on('patched', messages => console.log('PATCHED event:', messages.text));
messages.on('removed', messages => console.log('REMOVED event:', messages.text));
*/

const messages$ = messages.find({ query: {}});

// Handler live query
messages$.subscribe(messages => {
  messagesMirror = messages.sort((a, b) => a.order < b.order ? -1 : 1);

  console.log('.. Live query now has', messages.length, 'items');
  messages.forEach((message, i) => {
    console.log(`${i}: ${message._id} ${message.text} ${message.order}`);
  });

  updateUi();
});

function updateUi() {
  const listEl = document.getElementById('list');

  while (listEl.hasChildNodes())
    listEl.removeChild(listEl.lastChild);

  messagesMirror.forEach(message => {
    const liEl = document.createElement('LI');
    const textEl = document.createTextNode(message.text);
    liEl.appendChild(textEl);
    listEl.appendChild(liEl);
  });
}
