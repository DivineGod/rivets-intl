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


function componentFactory(data, messages, locale) {
  let key = data.key;
  let msg = getMessage(messages, key, locale);
  let messageFormat = createFromCache(IntlMessageFormat);
  let msgFormat = messageFormat(msg, [locale]);

  let IntlTranslationComponent = function() {
    this.translation = () => {
      /* Rivets updates data with getters and setters */
      for (var i in data) {
        if (typeof this[i] === 'undefined') this[i] = data[i];
      }
      return msgFormat.format(this);
    };
  };

  return new IntlTranslationComponent();
}


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
      return componentFactory(data, messages, locale);
    }
  };
}
