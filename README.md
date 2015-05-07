# rivets-intl
Rivets.js component for internationalization

### Overview

rivets-intl uses IntlMessageFormat to render translated strings that can be bound by rivets

### Usage

In your rivets setup add rivets-intl as a component

```js
    var messages = { 'en-US': { greeting: { formal: "Hello, { name }" } } };
    var locale = 'en-US';
    Rivets.components.i18n = require('rivets-intl')(messages, locale);
```

In a template file

```html
    <i18n key="greeting.formal" name="full_name" />
```

Then bind data

```js
    var data = { full_name: "Black Widow" };
    Rivets.bind(template, data);
```

The result will be a string: 

```Hello, Black Widow```
