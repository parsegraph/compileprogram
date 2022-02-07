import BasicGLProvider from "./BasicGLProvider";

export default class DebugGLProvider extends BasicGLProvider {
  createCanvas() {
    return require("webgl-debug").default.makeLostContextSimulatingCanvas(
      super.createCanvas()
    );
  }
}
