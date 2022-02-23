DIST_NAME = compileprogram

SCRIPT_FILES =  \
	src/compileprogram.ts \
	src/ProxyGLProvider.ts \
	src/GLProvider.ts \
	src/DebugGLProvider.ts \
	src/WebGL2Provider.ts \
	src/BasicGLProvider.ts \
	src/demo.ts \
	test/test.ts \
	test/test.js

EXTRA_SCRIPTS = 

include ./Makefile.microproject
