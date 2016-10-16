'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const exerciseMessages = require('../exerciseMessages');

var isFirstClient = true;

exports.before = {
  all: [],
  find: [
    (hook) => {
      if (isFirstClient) {
        isFirstClient = false;
        exerciseMessages(hook.app);
      }
    },
  ],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
