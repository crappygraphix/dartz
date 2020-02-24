# Elm Live
`elm-live src/Main.elm --open --start-page=index.html -- --output=js/elm.js`

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

# Opinions

1. I miss instances of show, typeclasses and deriving instances would make things easier, but also open the door to "option overflow". Elm's architecture is to limit the number of ways to solve problems as it improves consistency. I'm okay with this, but as I'm writing `show` for everything... it is annoying. To be fair, it's only annoying once.

2. Elm's foreign function interface into Javascript land and it's idea of segregation of responsibilities is a pleasure to work with.

3. Compile times and interactive debugging tools are top notch.

4. Writing JSON encoder/decoders by hand for all the things super sucks... Missing Aeson's template haskell generator functions. Somewhat related to 1.

