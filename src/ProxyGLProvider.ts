import GLProvider, { Shaders } from "./GLProvider";

export default abstract class ProxyGLProvider implements GLProvider {
  _glProvider: GLProvider;

  constructor(window: GLProvider) {
    this._glProvider = window;
  }

  setOnContextChanged(
    listener: (isLost: boolean) => void,
    listenerObj?: any
  ): void {
    this.glProvider().setOnContextChanged(listener, listenerObj);
  }

  glProvider(): GLProvider {
    return this._glProvider;
  }

  width() {
    return this.glProvider().width();
  }

  canProject() {
    return this.glProvider().canProject();
  }

  render() {
    return this.glProvider().render();
  }

  height() {
    return this.glProvider().height();
  }

  shaders(): Shaders {
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
