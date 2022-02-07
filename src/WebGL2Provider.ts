import BasicGLProvider from "./BasicGLProvider";

export default class WebGL2Provider extends BasicGLProvider {
  createGL() {
    return this.canvas().getContext("webgl2", {
      antialias: true,
    });
  }
}
