import type { FontBase64Type } from './types';

let savedScript: {
  klinecharts: string | null;
} = {
  klinecharts: null,
};

export const klinechartsScript = (klinechartsUrl: string) => {
  return new Promise((resolve, reject) => {
    if (savedScript.klinecharts) {
      resolve(savedScript.klinecharts);
      return;
    }

    fetch(
      klinechartsUrl
    )
      .then(response => response.text())
      .then(scriptContent => {
        savedScript.klinecharts = scriptContent;
        resolve(scriptContent);
      })
      .catch(error => {
        reject(error)
      });
  });
};


export const getWebContent = async (klinechartsUrl: string, receiveMessageScript: string, base64Fonts: FontBase64Type[]) => {
  const klinecharts = await klinechartsScript(klinechartsUrl);


  const useBase64Fonts = base64Fonts.length > 0;

  let fontInitWaitScript = '';
  let base64FontsStyle
  if (useBase64Fonts) {

    fontInitWaitScript = `
document.fonts.ready.then(() => {
 
  
document.getElementById('container_id').style.opacity = 0;
var setFontInterval =  setInterval(() => {
     if(kchart){
      clearInterval(setFontInterval);
      document.getElementById('container_id').style.opacity = 1;
      kchart.resize();

     }

    },100);
    });`;

    base64FontsStyle = base64Fonts.map(font => `
@font-face {
        font-family: "${font.fontFamily}";
        src:  url('${font.base64}') format('truetype');
    }`).join('\n');

  }
  const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title></title>
    <script type="text/javascript">${klinecharts}</script>
 

</head>

<body class="App">
    <div id="container_id" style="width:100vw;height:100vh"></div>

</body>

<script>

    window.onload = function () {
        document.addEventListener("message", function (event) {
            receiveMessage(event.data);
        });
        window.addEventListener("message", function (event) {
            receiveMessage(event.data);
        });
    }

    var kchart = null;
  
    const receiveMessage = (message) => {
    
      var data = JSON.parse(message);

      var functionName = data.function;
      var params = data.params;

${receiveMessageScript}

    };

   
  ${fontInitWaitScript}



</script>

<style>


    ${base64FontsStyle}
   
    #chart {
        height: 100vh;
        width: 100vw;
    }

    html,
    body {
        padding: 0 !important;
        margin: 0 !important;
    }
</style>


</html>`;

  return html;
};
