import createFromCache from 'intl-format-cache';
import IntlMessageFormat from 'intl-messageformat';

export function getMessage(messages, messagePath, locale) {
  if(!locale || typeof locale !== 'string') { return; }
  if(!messagePath || typeof messagePath !== 'string') { return; }
  let pathParts = messagePath.split('.');
  let message;
  let oldLocale;

  do {
    oldLocale = locale;
    message = pathParts.reduce(function(obj, path) { if(obj) { return obj[path]; } }, messages[locale]);
    locale = locale.split('-')[0];
    if(locale == oldLocale) { break; }
  } while (!message);


  return message;
}

let IntlTranslationComponent = function(data, messages, locale) {
  this.key = data.key;
  this.translation = () => {
    var messageFormat = createFromCache(IntlMessageFormat);
    var result = [];
    for (var i in data) {
      if (typeof this[i] === 'undefined') this[i] = data[i];
      result.push(this[i]);
    }
    let msg = getMessage(messages, this.key, locale);
    let msgFormat = messageFormat(msg, [locale]);
    return msgFormat.format(this);
  };
};


export default function(messages = {}, locale = 'en') {
  return {
    static: ['key'],
    template: function() {
      /**
      * this is a rivets.View instance
      */
      var observerKeys = [];
      for(var i in this.observers) {
        observerKeys.push(i);
      }
      return '{ translation < '+ observerKeys.join(' ') +' }';
    },
    initialize: function(el, data) {
      /**
      * this is a rivets.View instance
      */
      return new IntlTranslationComponent(data, messages, locale);
    }
  };
}
