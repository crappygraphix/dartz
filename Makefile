include dartz-elm/scss/Makefile

.PHONY: site
site: css
    # Build elm app
	cd dartz-elm && elm make src/Main.elm --optimize --output=js/elm.js
	cd dartz-elm && uglifyjs js/elm.js --compress 'pure_funcs="F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9",pure_getters,keep_fargs=false,unsafe_comps,unsafe' | uglifyjs --mangle --output=js/elm.min.js
	# Copy JS
	rm -rf js
	mkdir js
	cp -r dartz-elm/js/elm.min.js js/elm.js
	# Copy Index
	rm -f index.html
	cp dartz-elm/index.html index.html
	# Copy Img
	rm -rf img
	cp -r dartz-elm/img img
	# Copy CSS
	rm -rf css
	cp -r dartz-elm/css css
	# Copy Icon
	cp -f dartz-elm/favicon.ico favicon.ico
