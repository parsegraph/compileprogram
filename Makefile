DIST_NAME = compileprogram

SCRIPT_FILES = \
	src/compileProgram.ts \
	src/index.ts \
	src/ProxyGLProvider.ts \
	src/GLProvider.ts \
	src/DebugGLProvider.ts \
	src/WebGL2Provider.ts \
	src/BasicGLProvider.ts \
	src/demo.ts \
	test/test.ts

EXTRA_SCRIPTS =

include ./Makefile.microproject
