DIST_NAME = compileprogram

SCRIPT_FILES = \
	src/compileprogram.ts \
	src/ProxyGLProvider.ts \
	src/BasicGLProvider.ts \
	src/GLProvider.ts

all: build lint test coverage esdoc

build: dist/$(DIST_NAME).js
.PHONY: build

demo: dist/$(DIST_NAME).js
	npm run demo
.PHONY: demo

check:
	npm run test
.PHONY: check

test: check
.PHONY: test

coverage:
	npm run coverage
.PHONY: coverage

prettier:
	npx prettier --write src test demo
.PHONY: prettier

lint:
	npx eslint --fix $(SCRIPT_FILES)
.PHONY: lint

esdoc:
	npx esdoc
.PHONY: esdoc

doc: esdoc
.PHONY: doc

dist/$(DIST_NAME).js: package.json package-lock.json $(SCRIPT_FILES)
	npm run build
	mv dist/src/* dist/

clean:
	rm -rf dist .nyc_output
.PHONY: clean
