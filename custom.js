// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function () {

  // Then get its webviews
  let webviews = document.querySelectorAll(".TeamView webview");

  // Fetch our CSS in parallel ahead of time
  const cssPath = 'https://raw.githubusercontent.com/weberjacob/slack-dark-theme/master/custom.css';
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
