import BasicGLProvider from "./BasicGLProvider";

export default class DebugGLProvider extends BasicGLProvider {
  createCanvas() {
    return WebGLDebugUtils.makeLostContextSimulatingCanvas(
      super.createCanvas()
    );
  }
}
