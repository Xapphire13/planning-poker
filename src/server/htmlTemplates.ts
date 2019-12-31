export const webTemplate = (ssrHtml: string, muiCss: string, aphroditeCss: string, renderedClassNames: string[], entryPoint: string) => `
<!DOCTYPE html>
<html>

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      html, body, #react-root {
        width: 100%;
        height: 100%;
      }
      
      body {
        margin: 0;
      }

      #react-root {
        position: relative;
      }
    </style>
    <style data-aphrodite>${aphroditeCss}</style>
    <style id="jss-server-side">${muiCss}</style>
    <title>Planning Poker</title>
  </head>

  <body>
    <div id="react-root">${ssrHtml}</div>
    <script id="entry-point-script" async="async" src="${entryPoint}" data-renderedClassNames="${renderedClassNames.join()}"></script>
  </body>

</html>
`;