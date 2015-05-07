/* global describe */
/* global beforeEach */
/* global it */
/* global xit */
/* global expect */
/* global document */

import Intl from 'intl';
global.Intl = Intl;

import Rivets from 'rivets';
import { default as IntlComponent, getMessage } from '../src/intl.js';

import _ from 'underscore';

const messages = {
  en: {
    shallow: "message",
    deep: {
      message: "deep message",
    },
    missing: "missing in other locales and languages",
    greeting: {
      formal: "Hello, { name }"
    },
    character: "{name}: {gender, select, female {She is} male {He is} other {Is}} {age, plural, =0 {new born} =1 {# year old} other {# years old}}"
  },
  'en-US': {
    shallow: "basic bitch",
    deep: {
      message: "get in touch with your chakras",
    },
    greeting: {
      formal: "Howdy, { name }"
    }
  },
  da: {
    greeting: {
      formal: "Goddag, { name }"
    },
    character: "{name}: {gender, select, female {Hun er} male {Han er} other {Er}} {age, plural, =0 {nyfødt} other {# år gammel}}"
  }
};
let _data = {
  age : 29,
  gender: 'female',
  full_name: 'Black Widow'
};

describe('intl', function() {
  describe('getMessage', () => {
    it('finds a message', () => {
      let message = getMessage(messages, 'shallow', 'en');

      expect(message).toEqual('message');
    });
    it('finds a deep message', () => {
      let message = getMessage(messages, 'deep.message', 'en');

      expect(message).toEqual('deep message');
    });
    it('finds a message for a "en-US" locale', () => {
      let message = getMessage(messages, 'shallow', 'en-US');

      expect(message).toEqual('basic bitch');
    });
    it('defaults to a parent language if missing in locale', () => {
      let message = getMessage(messages, 'missing', 'en-US');

      expect(message).toEqual('missing in other locales and languages');
    });
    it('gets an undefined message if missing in tree', () => {
      let message = getMessage(messages, 'missing', 'da');

      expect(message).toBeUndefined();
    });
  });

  describe('IntlComponent', () => {
    let data = {};
    beforeEach(() => {
      data = _.clone(_data);
    });

    xit('finds messages', function() {
      Rivets.components.i18n = IntlComponent(messages);
      let el = document.createElement('i18n');
      el.setAttribute('key', "greeting.formal");
      el.setAttribute('name', "full_name");

      Rivets.bind(el, data);

      expect(el.textContent).toEqual('Hello, Black Widow');

      data.full_name = "Ultron";
      data.gender = "AI";
      data.age = 0;

      expect(el.textContent).toEqual('Hello, Ultron');
    });

    xit('can pick from a locale', () => {
      Rivets.components.i18n = IntlComponent(messages, 'en-US');

      // <i18n key="greeting.formal" name="full_name" />
      let el = document.createElement('i18n');
      el.setAttribute('key', "greeting.formal");
      el.setAttribute('name', "full_name");

      Rivets.bind(el, data);

      expect(el.textContent).toEqual('Howdy, Black Widow');
    });

    xit('can choose different language', () => {
      Rivets.components.i18n = IntlComponent(messages, 'da');

      // <i18n key="greeting.formal" name="full_name" />
      let el = document.createElement('i18n');
      el.setAttribute('key', "greeting.formal");
      el.setAttribute('name', "full_name");

      Rivets.bind(el, data);

      expect(el.textContent).toEqual('Goddag, Black Widow');
    });

    it('can use full ICU message format', () => {
      Rivets.components.i18n = IntlComponent(messages, 'en');

      // <i18n key="greeting.formal" name="full_name" />
      let el = document.createElement('i18n');
      el.setAttribute('key', "character");
      el.setAttribute('name', "full_name");
      el.setAttribute('gender', "gender");
      el.setAttribute('age', "age");

      Rivets.bind(el, data);

      expect(el.textContent).toEqual('Black Widow: She is 29 years old');

      data.full_name = "Ultron";
      data.gender = "AI";
      data.age = 0;

      expect(el.textContent).toEqual('Ultron: Is new born');
    });

    it('can user full ICU and different language', () => {
      Rivets.components.i18n = IntlComponent(messages, 'da');

      // <i18n key="greeting.formal" name="full_name" />
      let el = document.createElement('i18n');
      el.setAttribute('key', "character");
      el.setAttribute('name', "full_name");
      el.setAttribute('gender', "gender");
      el.setAttribute('age', "age");

      Rivets.bind(el, data);

      expect(el.textContent).toEqual('Black Widow: Hun er 29 år gammel');

      data.full_name = "Ultron";
      data.gender = "AI";
      data.age = 0;

      expect(el.textContent).toEqual('Ultron: Er nyfødt');
    });
  });
});
