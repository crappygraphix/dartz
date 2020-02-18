# Dart Game List
https://www.darts501.com/Games.html

# Gen Artifacts

`elm make src/Main.elm --output /src/index.html`

# Get Rollin
`elm init`

# Create an index.html file that you can open in your browser.
`elm make src/Main.elm`

# Create an optimized JS file to embed in a custom HTML document.
`elm make src/Main.elm --optimize --output=elm.js`

# Adding Packages
`elm install`

Elm packages all live at package.elm-lang.org.

Say you look around and decide you need elm/http and elm/json to make some HTTP requests. You can get them set up in your project with the following commands:

`elm install elm/http`

`elm install elm/json`

This adds these dependencies into your elm.json file, making these packages available in your project. That will let you say import Http and use functions like Http.get in your programs.
