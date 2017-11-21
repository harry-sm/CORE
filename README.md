# CORE

Core is a modular, scalable and concise frontend framework. It's main purpose is to manage modules, plugins and extensions. It ensures loose coupling of components and allows for the use whatever communication system you want; however, one is provide in the extras folder.

### Advance Usage

Fetch the project via git:

`git clone https://github.com/harry-sm/CORE.git`

Include in your project
`<script src="<path>/core.js"></script>`
`<script src="<path>/extensions.js"></script>`

This library uses a variant of the naming convention known as [Hungarian Notation](https://en.wikipedia.org/wiki/Hungarian_notation) for variable names. Simply put the variable name is prefixed with the first letter of the data type the variable is.

| Prefix | Data Type  | Example |
| ------ | ---------- | ------- |
| s      | string     | sData   |
| n      | number     | nData   |
| a      | array      | aData   |
| o      | object     | oData   |
| $      | DOM object | $       |

### Browser Support

- IE9+
- Chrome
- Firefox

The parameter `$`  used in the factory functions contains the DOM element that corresponds with the module ID and other module data along with the methods for any extensions and plugins specified.  All dependencies are injected into each component when they are instantiated.

> **NOTE: ** All modules are connected to a DOM element.

| Parameter(object) | Defaults                  | Type             | Description                              |
| ----------------- | ------------------------- | ---------------- | ---------------------------------------- |
| $                 | domEl                     | [HTMLCollection] | The corresponding DOM element of the module name. |
|                   | find(sEl)                 | function         | Gets the descendants of the module DOM element that matches the query. |
|                   | length                    | number           | The number of elements that was returned from the DOM query. |
|                   | moduleIdentifier          | string           | The name of the module.                  |
|                   | plugin( sPluginID, oData) | function         | Initialize any the plugin specified.     |

#### $.find(sEl)

| Parameter | Type   | Example               | Description                              |
| --------- | ------ | --------------------- | ---------------------------------------- |
| sEl       | string | '#id' of '.classname' | The selector string that will be queried against the DOM elements. |



####$.plugin( sPluginID, oData)

| Parameter | Type   | Example     | Description                              |
| --------- | ------ | ----------- | ---------------------------------------- |
| sPluginID | string | 'accordion' | The name of the plugin.                  |
| oData     | object | {data}      | The data should be provided upon initialization of the plugin. |



## Module Methods

### CORE.module.create(sModuleID, aExtensions, fFn, aPlugins)

This factory function registers a new module to CORE module management system.

#### Parameters

| Parameter   | Type     | Example              | Description                              |
| ----------- | -------- | -------------------- | ---------------------------------------- |
| sModuleID   | string   | '#foo'               | The module name which is use to query the DOM for corresponding element with an ID with the same name. |
| aExtensions | [string] | ['dom']              | An array containing the extension IDs of the module's dependencies. |
| fFn         | function | function ($) { ... } | The function that contains the implementation details of the module. |
| aPlugins    | [string] | ['myPlugin']         | An array containing the plugin IDs of the module's dependencies. |

#### Return Type

`void`

#### Example

```js
CORE.module.create('#foo', ['dom'], function ($) {
	var $childElement = $.find('#foo-child');
  
    return {
        init: function() {
            $.plugin('plugin', $);
        },
        destroy: function () {
          //body
        }
    };
}, ['plugin']);
```

```html
<div id="foo">
  ...
</div>
```



### CORE.module.start( sModuleID, oData )
Starts the module by creating a new instance of it.

#### Parameters

| Parameter | Type   | Example                     | Description                              |
| --------- | ------ | --------------------------- | ---------------------------------------- |
| sModuleID | string | '#foo'                      | The name of the module that should be instantiated. |
| oData     | object | {<br />name: 'Harry'<br />} | Any data that should be consumes upon the module instantiation. The data is passed to the `init()` function of the module and is optional. |

#### Return Type
`void`

#### Example
```js
CORE.module.start('#foo');
```

### CORE.module.stop( sModuleID )
Stops the module by calling the destroy method and removing the instance from CORE.

#### Parameters

| Parameter | Type   | Example | Description                              |
| --------- | ------ | ------- | ---------------------------------------- |
| sModuleID | string | '#foo'  | The name of the module instance that should be destroyed. |

#### Return Type
`void`

#### Example
```js
CORE.module.stop('#foo');
```



### CORE.module.startAll( aExcept )
Start all modules except the ones specified.

#### Parameters

| Parameter | Type     | Example  | Description                              |
| --------- | -------- | -------- | ---------------------------------------- |
| aExcept   | [string] | ['#bar'] | An array containing all the module IDs that should be instantiated. |

#### Return Type
`void`

#### Example
```js
CORE.module.startAll();
```



### CORE.module.stopAll( aExcept )
Stop all modules except the ones specified.

#### Parameters

| Parameter | Type     | Example  | Description                              |
| --------- | -------- | -------- | ---------------------------------------- |
| aExcept   | [string] | ['#foo'] | An array containing all the module IDs that should not be instantiated. |

#### Return Type
`void`

#### Example
```js
CORE.module.stopAll(['#foo']);
```



### CORE.module.restart( aModuleID )

Stops and then  starts modules.

#### Parameters

| Parameter | Type     | Example  | Description                              |
| --------- | -------- | -------- | ---------------------------------------- |
| aModuleID | [string] | ['#foo'] | The name of the module that should be restarted. |

#### Return Type
`void`

#### Example
```js
CORE.module.restart(['#foo']);
```



##Plugin
Plugins are reuseable behaviours that are used within the app, such as sliders, accordion and carousels.


### CORE.plugin.create( sPluginID, aExtensions, fFn )
Registers plugins to CORE.

#### Parameters

| Parameter   | Type     | Example              | Description                              |
| ----------- | -------- | -------------------- | ---------------------------------------- |
| sPluginID   | string   | 'accordion'          | The name of the plugin. This should be unique. |
| aExtensions | [string] | ['dom', 'events']    | An array containing the extension IDs of the module's dependencies. |
| fFn         | function | function ($) { ... } | The function that contains the implementation details of the plugin. |

#### Return Type
`void`

#### Example
```js
CORE.plugin.create('accordion', ['dom', 'events'], function( $ ) {
	var
		nPrev,
		nIdx,
		_$elem,
		$accordionBtns
	;

	function selectAccordionContent (){
		nIdx = $.dom.index(this, $accordionBtns);

		if(nPrev === nIdx){
			$.dom.removeClass('current', $accordionBtns[nIdx]);
			nPrev = null;
			return;
		}
		$.dom.removeClass('current', $accordionBtns);
		$.dom.addClass('current', $accordionBtns[nIdx]);

		nPrev = nIdx;
	}
	return {
		init: function ($elem){
			_$elem = $elem;
			$accordionBtns = _$elem.find('.accordion-btn');

			$.events.on(_$elem, 'click', '.accordion-btn', selectAccordionContent);
		},
		destroy: function (){
			$.events.off(_$elem, 'click', '.accordion-btn', selectAccordionContent);
		}
	};
});
```



####Usage

```html
<div id="accordian-element" class="accordion">
    <div class="accordion-btn">Accordian 1</div>
    <div class="accordion-content">
        <div>
            Content 1
        </div>
    </div>
    <div class="accordion-btn">Accordian 2</div>
    <div class="accordion-content">
        <div>
            Content 2
        </div>
    </div>
</div>
```

```js
CORE.module.create('#accordian-element', ['dom'], function ($) {	
	return {
		init: function() {
			$.plugin('accordion', $);
		},
		destroy: function () {
			this.plugin = null;
		}
	};

}, ['accordion']);
```



## Extensions

Extensions are third party functionality you want to inject into the module, such as DOM manipulation, DOM events and a messaging system like a mediator.


### CORE.extension.create( sExtensionID, fFn )
Registers extensions to CORE.

#### Parameters

| Parameter    | Type     | Example              | Description                              |
| ------------ | -------- | -------------------- | ---------------------------------------- |
| sExtensionID | string   | 'dom'                | The name of the extension. This should be unique. |
| fFn          | function | function ($) { ... } | The function that contains the implementation details of the extension. |

#### Return Type
`void`

#### Example
```js
CORE.extension.create('dom', function ( oData ){
	return {
		addClass: function (sClassName, $el) {
            // body
		},
		removeClass: function (sClassName, $el) {
			// body
		},
		toggleClass: function (sClassName, $el) {
			// body
		},
		hasClass: function (sClassName, $el) {
			// body
		},
		...
	};
});
```

#### Usage

```js
CORE.module.create('#elem', ['dom'], function ($) {
	return {
		init: function() {
            // adds css class hide to it's dom element.
			$.dom.addClass('.hide', $);
		},
		destroy: function () {
		}
	};

});
```



## CORE

####CORE.debug( bOption )

Logs warnings and errors about CORE's internal operations  to the console. Default value: **true**

####Parameters

| Parameter | Type    | Example | Description                   |
| --------- | ------- | ------- | ----------------------------- |
| bOption   | boolean | true    | Enable or disable debug mode. |

#### Return Type

`void`

#### Example

```js
CORE.debug(true)
```



#### CORE.log( nSeverity, sMsg )

Prints message to the console.

####Parameters

| Parameter | Type   | Example             | Description                              |
| --------- | ------ | ------------------- | ---------------------------------------- |
| nSeverity | number | 2                   | Specifies the type of message that will be logged to the console. Options:<br />1: INFO<br />2: WARNING<br />3: ERROR |
| sMsg      | string | 'This is a warning' | The message that should be logged to the console. |

#### Return Type

`void`

#### Example

```js
CORE.log(1, 'Normal message');
CORE.log(2, 'Warning message');
CORE.log(1, 'Error message');
```



####CORE.extend( sExtensionID, fFn )

Extend adds additional functionality you want to the CORE object.

#### Parameters

| Parameter    | Type     | Example              | Description                              |
| ------------ | -------- | -------------------- | ---------------------------------------- |
| sExtensionID | string   | 'dom'                | The name of the extension. This should be unique. |
| fFn          | function | function ($) { ... } | The function that contains the implementation details of the extension. |

#### Return Type

`void`

####Example

```js
CORE.extend('anything', function (){
		return {
			method: function (arg){
				// body
			}
		};
	});
```

#### Usage

```js
CORE.anything.method(data);
```
