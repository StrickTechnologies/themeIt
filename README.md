# themeIt.js
Easily manage light/dark themes with Pico CSS and Bootstrap 5.30+.

## Quick Start
Load themeIt.js at the top of the `<head>` section of your document. 
This ensures the theme is set before the document is loaded, preventing 
a **flash of un-themed content (FOUC)**, 
as it sets the initial background color before CSS styles are loaded.

You do **NOT** need to add a `data-theme` or `data-bs-theme` attribute to 
your `<html>` tag. ThemeIt will handle adding the proper attribute 
when necessary.

Use the `data-framework` attribute on the script tag to specify which 
framework your are using. This is required, and themeIt may not function 
properly if it's not set.

| Value | Framework | Notes                 |
|-------|-----------|-----------------------|
|pico   |Pico CSS   |                       |
|bs     |Bootstrap  | Must be version 5.30+ |

```Html
<head>
	<script src="~/js/themeIt.js" data-framework="pico"></script>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="color-scheme" content="light dark">
	...
</head>
```

## User theme change
To allow site visitors to change the theme for your site, you can add 
*theme switcher* elements to your document. A *theme switcher* element is an
element that has the `data-theme-switcher` attribute. Click listeners are automatically 
added for each theme switcher element in your document. Use the table below for 
the value of the `data-theme-switcher` attribute.

| Value | Description                                              |
|-------|----------------------------------------------------------|
|light  |Set the light color theme                                 |
|dark   |Set the dark color theme                                  |
|toggle |Toggle between the light and dark color themes            |
|default|Return the color theme back to the browser or O/S default |

When a theme switcher in the doument is clicked, themeIt will get the event and 
take the proper action based on the attribute's value. ThemeIt will save the user's 
theme preference in the browser's local storage. The preference is then used to set 
the theme as the user navigates the site, or on subsequent visits to the site.

The *default* setting will remove the theme preference from the browser's local storage, 
thus returning the theme back to the browser or O/S default.

```Html
<div>
	<h4>Auto switchers</h4>
	<p>Select a color theme</p>
	<button data-theme-switcher="light" title="Set Light color theme">Light</button>
	<button data-theme-switcher="dark" title="Set Dark color theme">Dark</button>
	<button data-theme-switcher="toggle" title="Toggle between Light/Dark themes">Toggle</button>
	<button data-theme-switcher="default" title="Return to 'Default' browser or O/S color theme">Default</button>
</div>
```

## Detecting theme changes in your code

When the user clicks a theme switcher element, a `theme-change` event is 
raised after the theme is changed. If you need to do additional work when 
the theme is changed, you can add a listener for the `theme-change` event. 
The new theme is available in the `event.detail.theme` property.

The `theme-change` event is also raised when the theme is changed in the 
browser or O/S. **This requires the `data-listen-os-change` option to be
set to `true`** (which is the default value).

```Javascript
document.addEventListener('theme-change', (event) =>
{
	console.log(`Theme changed to: ${event.detail.theme}`);
	//do work here.
});
```

## Options
themeIt has several options that can be set using data attributes on the script tag.

### `data-framework`
The `data-framework` attribute specifies which 
framework your are using. This is required, and themeIt may not function 
properly if it's not set.

| Value | Framework | Notes                 |
|-------|-----------|-----------------------|
|pico   |Pico CSS   |                       |
|bs     |Bootstrap  | Must be version 5.30+ |

In addition to the framework option, there are other options that control 
various aspects of themeIt's operations. Each of these options have a 
default value for each framework, so these options only need to be used 
when it's necessary to override those defaults.

### `data-reload-on-change`
The `data-reload-on-change` attribute is a boolean value that 
controls whether or not the current location is reloaded 
(the page is refreshed) when a theme change occurs. The reload 
is done both when the user changes the theme, or when a 
browser or O/S theme change is detected. The default value 
for both Pico and BS is `false`.
```Html
<script src="/themeIt.js" data-framework="pico" data-reload-on-change="true"></script>
```

### `data-listen-os-change`
The `data-listen-os-change` attribute is a boolean value that 
controls whether or not themeIt listens for theme changes at 
the browser or O/S level. If false, the `theme-change` event 
will **NOT** be raised when the theme is changed in the 
browser or O/S. The default value for both Pico and BS is `true`.
```Html
<script src="/themeIt.js" data-framework="pico" data-listen-os-change="false"></script>
```

## Programmatic theme change
You can also change the theme programmatically using themeIt's `switchTheme()` 
method. The `switchTheme()` method takes a single parameter, which is the
theme to switch to. Valid values are the same as the `data-theme-switcher` 
attribute values. 

This simple example shows how to use the `switchTheme()` method to change 
the theme when a button is clicked. This example offers no advantage over 
using the `data-theme-switcher` attribute, but it illustrates how to use 
the `switchTheme()` method. You can do other work in the click event handler, 
or use the `theme-change` event to do work after the theme is changed.

```Html
<div>
	<h4>Manual switchers</h4>
	<p>Select a color theme</p>
	<button data-manual-theme-switcher="light" title="Set Light color theme">Light</button>
	<button data-manual-theme-switcher="dark" title="Set Dark color theme">Dark</button>
	<button data-manual-theme-switcher="toggle" title="Toggle between Light/Dark themes">Toggle</button>
	<button data-manual-theme-switcher="default" title="Return to 'Default' browser or O/S color theme">Default</button>
</div>
...
<script type="module">
	const mySwitcherAttrib = "data-manual-theme-switcher";
	const mySwitchers = document.querySelectorAll(`[${mySwitcherAttrib}]`);
	mySwitchers.forEach(el => {
		el.addEventListener("click", function(event) {
			const newTheme = event.currentTarget.getAttribute(mySwitcherAttrib);
			themeIt.switchTheme(newTheme);
			//do other work here...
			//  Alternatively, the theme-change event can also be used (see docs)
		});
	});
</script>
```
