# Custom Element Test and Example

This it's just an excercise of how to do a html custom element.
I considered two paths to construct the custom element:

- Construct it in a __.js__ file.
- Construct it in a __.html__ file.

The two files are very similar in size and complexity, but the have
some pretty visible differences too:

- The .html file must be imported via link tag, that is only supported in
  chrome and safari, firefox doesn't plan to implement it by default.
- The .html file is larger than the .js file after minification.
- the .js file has the template inside a template string, so it's really
  painfull to maintain or do changes in the developing stage.
- Oposed to the last point, the .html file is cleaner and easier to maintain,
  with the only caveat at the need of using <code>document.currentScript.ownerDocument</code>
  to access the inner document.

All in all, the .js file it's the winner!, for obvious reasons:

- It's portable across many browers.
- Can be minified.
- Can be bundled with other components.
- Can be served from anywhere.
- Doesn't need CORS.

The .html file it's good for the early stages of development and it's easy to convert
it to a .js file after it's done.

To resume the workflow:

- Develop in .html file
- Port it to a .js file
- Minify it and/or bundle it
- ????
- Profit

## How to connect the custom element to your site

I used a pub/sub approach, adding three methods to the custom element:
`.on`, `.off` and `.trigger`.
This approach let me update other things efficiently:
```html
<!-- HTML -->
<rtx-slider id="slider"></rtx-slider>
<pre id="display">0</pre>
```
```javascript
/* SCRIPT */
var slider  = document.querySelector('#slider');
var display = document.querySelector('#display');

// Access some property in the custom element
display.innerHTML = slider.value;

// Subscribing a callback
slider.on('changed', (value) => {
  display.innerHTML = value;
});

// Unsubscribing
slider.off('changed');
```

## HTML to JS, how??

Just copy the insides of your template and paste it to the `shadowRoot.innerHTML` in
the .js file inside a template string, like this:
```html
<!-- HTML FILE -->
<template>
  <div>So cool</div>
</template>
<script>
...
</script>
```
```javascript
/* JS FILE */
...
this.shadowRoot.innerHTML = `<div>So cool</div>`;
// OR
this.shadowRoot.appendChild(`<div>So cool</div>`);
...
```
Or just make a transpiler if you feel 133t. Compare the .html file and the .js file in the repo to see how it's done.

## About this custom element

It's a slider, yeah the thing you drag to get some values in a range. You can focus on it and use the <kbd>LeftArrow</kbd>, <kbd>+</kbd>, <kbd>RightArrow</kbd> and <kbd>-</kbd> to change the value, and <kbd>home</kbd> to jump to the minimum or <kbd>end</kbd> to the maximum.
You can customise it with the `min`, `max`, `step` and `value` attributes or set them via script later. In html, it looks like this:
```html
<rtx-slider value="50" step="0.5" min="0" max="100"></rtx-slider>
```
To style it (because I know you will), this are the hooks:

- __#thumb__

  It's the inner fill before the "handle".

- __#thumb::after__

    It's the actual "handle".

- __#track__

    Don't touch, it's the draggable area.

- __#track-start__

    Don't touch, it's the clickable area that set the value to the minimum

- __#track-end__

    Don't touch, it's the clickable area that set the value to the maximum

The `:host` element just set the height of the track and add a border to it.