# compileProgram

It is common for multiple WebGL painters to use the same shader program. But each
painter would need to compile its own version of the program.

A global registry would alleviate this problem, but it's possible that different GL
contexts would exist within the same process.

This library solves this problem by using a shared object that provides the GL instance,
as well as an shaders map, from shader name to the compiled WebGL program instance.

### Installing

If you are seeing errors about missing webgl-debug, and you are trying to build
this package, run make install-deps to install it.
