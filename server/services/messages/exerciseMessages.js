
module.exports = function (app) {
  const ms = 500;
  const ids = [];
  var order = -1;

  const messages = app.service('messages');

  const actions = [
    ['create', 0, `Hi. Watch a DB action every ${ms/1000} sec.`],
    ['create'],
    ['create'],
    ['patch', 1, 'Message 1 has been changed.'],
    ['create'],
    ['create'],
    ['create'],
    ['patch', 1, 'Message 1 has been changed again.'],
    ['create'],
    ['patch', 4, 'Oh no, message 4 has been changed too.'],
    ['create'],
    ['remove', 3],
    ['remove', 4],
    ['remove', 5],
    ['create'],
    ['create'],
    ['remove', 6],
    ['remove', 7],
    ['remove', 8],
    ['remove', 9],
    ['remove', 2],
    ['remove', 1],
    ['remove', 0],
    ['create', 0, 'I may not say anything, but I see everything!']
  ];

  messages.on('created', messages => console.log('CREATED event:', messages.text));
  messages.on('updated', messages => console.log('UPDATED event:', messages.text));
  messages.on('patched', messages => console.log('PATCHED event:', messages.text));
  messages.on('removed', messages => console.log('REMOVED event:', messages.text));

  var promise = Promise.resolve();

  actions.forEach(action => {
    const method = action[0];
    const idNum = action[1];
    const text = action[2];

    switch (method) {
      case 'create':
        promise = promise.then(() => {
          order += 1;
          return messages.create({ text: `${text || `This is message ${order}.`}`, order })
            .then(message => {
              ids.push(message._id);
            })
        });
        break;
      case 'patch':
        promise = promise.then(() => messages.patch(ids[idNum], { text: `${text || 'Patched.'}` }));
        break;
      case 'remove':
        promise = promise.then(() => messages.remove(ids[idNum]));
        break;
      default:
    }

    promise = promise.then(delayPromise(ms));
  });
};

function delayPromise(duration) {
  return () => new Promise((resolve) => {
    setTimeout(() => { resolve(); }, duration);
  });
}
