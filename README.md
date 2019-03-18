# Slack Dark Theme

A dark theme for Slack based on 
 https://github.com/widget-/slack-black-theme and https://github.com/elv1n/slack-dark-mojave-theme with color adjustments similar to Tomorrow Theme, specifically Tomorrow Night Eighties. 

 # Installing into Slack

Find your Slack's application directory.

* Mac: `/Applications/Slack.app/Contents/`

Open up the most recent version (e.g. `app-2.5.1`) then open
`resources\app.asar.unpacked\src\static\index.js`

For versions after and including `3.0.0` the same code must be added to the following file
`resources\app.asar.unpacked\src\static\ssb-interop.js`

At the very bottom, add

```js
// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function () {

  // Then get its webviews
  let webviews = document.querySelectorAll(".TeamView webview");

  // Fetch our CSS in parallel ahead of time
  const cssPath = 'https://unpkg.com/install-dark-theme/theme.css';
  let cssPromise = fetch(cssPath).then(response => response.text());

  let customCustomCSS = `
   :root {
      /* Modify these to change your theme colors: */
      --primary: #6699cc;
      --text: #cccccc;
      --background: #2d2d2d;
      --background-elevated: #2d2d2d;
      --color-highlight: #2b6b95;
      --background-hover: rgba(255, 255, 255, 0.1);
      --background-light: #AAA;
      --background-bright: #FFF;
      --border-dim: #666;
      --border-bright: #555;
      --text-bright: #FFF;
      --text-special: var(--primary);
      --text-grey: #717274;
      --scrollbar-background: var(--background-elevated);
      --scrollbar-border: var(--background-elevated);
      --active-icon: #2ECC71;
   }
   `

  // Insert a style tag into the wrapper view
  cssPromise.then(css => {
    let s = document.createElement('style');
    s.type = 'text/css';
    s.innerHTML = css + customCustomCSS;
    document.head.appendChild(s);
  });

  // Wait for each webview to load
  webviews.forEach(webview => {
    webview.addEventListener('ipc-message', message => {
      if (message.channel == 'didFinishLoading')
        // Finally add the CSS into the webview
        cssPromise.then(css => {
          let script = `
                     let s = document.createElement('style');
                     s.type = 'text/css';
                     s.id = 'slack-custom-css';
                     s.innerHTML = \`${css + customCustomCSS}\`;
                     document.head.appendChild(s);
                     `
          webview.executeJavaScript(script);
        })
    });
  });
});
```