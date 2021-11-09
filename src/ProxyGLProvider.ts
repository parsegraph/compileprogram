import GLProvider from "./GLProvider";

export default abstract class ProxyGLProvider implements GLProvider {
  _glProvider: GLProvider;

  constructor(window: GLProvider) {
    this._glProvider = window;
  }

  glProvider(): GLProvider {
    return this._glProvider;
  }

  abstract id(): string;

  shaders(): { [shaderName: string]: WebGLProgram } {
    return this.glProvider().shaders();
  }

  container(): HTMLElement {
    return this.glProvider().container();
  }

  canvas(): HTMLCanvasElement {
    return this.glProvider().canvas();
  }

  gl(): WebGLRenderingContext {
    return this.glProvider().gl();
  }
}
