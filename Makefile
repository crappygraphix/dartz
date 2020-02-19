.PHONY: site
site:
    # Build elm app
	cd dartz-elm && elm make src/Main.elm --optimize --output=js/elm.js
	# Copy JS
	rm -rf js
	cp -r dartz-elm/js js
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

