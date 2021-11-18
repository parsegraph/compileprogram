import GLProvider from "./GLProvider";
import checkGLError from "parsegraph-checkglerror";
import Color from "parsegraph-color";
import Rect from "parsegraph-rect";

let providerCount = 0;
export default class BasicGLProvider implements GLProvider {
  _shaders: { [shaderName: string]: WebGLProgram };
  _id: string;
  _gl: WebGLRenderingContext;
  _container: HTMLDivElement;
  _canvas: HTMLCanvasElement;
  _backgroundColor: Color;
  _explicitWidth: number;
  _explicitHeight: number;

  constructor(id: string, background: Color) {
    if (id) {
      this._id = id;
    } else {
      this._id = "" + ++providerCount;
    }
    this._shaders = {};
    this._gl = null;

    if (background) {
      this._backgroundColor = background;
    } else {
      this._backgroundColor = new Color(0, 0, 0, 1);
    }

    this._container = document.createElement("div");

    // The 3D canvas that will be drawn to.
    this._canvas = document.createElement("canvas");
    /* if(WebGLDebugUtils) {
      this._canvas = WebGLDebugUtils.makeLostContextSimulatingCanvas(
      this._canvas);
    }*/
    this._canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        // console.log('Context lost');
        event.preventDefault();
        this.onContextChanged(true);
      },
      false
    );
    this._canvas.addEventListener(
      "webglcontextrestored",
      () => {
        //console.log("Context restored");
        this.onContextChanged(false);
      },
      false
    );
    this._canvas.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
      },
      false
    );
    this._canvas.style.display = "block";

    this._container.appendChild(this._canvas);
    this._explicitWidth = null;
    this._explicitHeight = null;
  }

  onContextChanged(isLost: boolean): void {
    if (isLost) {
      const keys = [];
      for (const k in this._shaders) {
        if (Object.prototype.hasOwnProperty.call(this._shaders, k)) {
          keys.push(k);
        }
      }
      for (const i in keys) {
        if (Object.prototype.hasOwnProperty.call(keys, i)) {
          delete this._shaders[keys[i]];
        }
      }
    }
  }

  shaders(): { [shaderName: string]: WebGLProgram } {
    return this._shaders;
  }

  id(): string {
    return this._id;
  }

  gl(): WebGLRenderingContext {
    if (this._gl) {
      return this._gl;
    }
    // this._gl = this._canvas.getContext("webgl2", {
    // antialias:true
    // });
    if (this._gl) {
      // this.render = this.renderWebgl2;
      checkGLError(this._gl, "WebGL2 creation");
      return this._gl;
    }
    this._gl = this._canvas.getContext("webgl");
    if (this._gl) {
      checkGLError(this._gl, "WebGL creation");
      return this._gl;
    }
    throw new Error("GL context is not supported");
  }

  canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  getSize(sizeOut?: Rect) {
    sizeOut.setX(0);
    sizeOut.setY(0);
    sizeOut.setWidth(this.width());
    sizeOut.setHeight(this.height());
  }

  resize(w: number, h: number): void {
    this.container().style.width = typeof w === "number" ? w + "px" : w;
    if (arguments.length === 1) {
      h = w;
    }
    this.container().style.height = typeof h === "number" ? h + "px" : h;
  }

  setExplicitSize(w: number, h: number): void {
    this._explicitWidth = w;
    this._explicitHeight = h;
    this.resize(w, h);
  }

  getWidth(): number {
    return this._explicitWidth || this.container().clientWidth;
  }

  width(): number {
    return this.getWidth();
  }

  getHeight(): number {
    return this._explicitHeight || this.container().clientHeight;
  }
  height() {
    return this.getHeight();
  }

  /**
   * @return {HTMLElement} Returns the container that holds the canvas for this graph.
   */
  container(): HTMLElement {
    return this._container;
  }

  setBackground(color: Color | number, ...args: Array<number>): void {
    if (args.length > 1) {
      return this.setBackground(new Color(<number>color, ...args));
    }
    this._backgroundColor = <Color>color;
  }

  /**
   * @return {Color} Retrieves the current background color.
   */
  backgroundColor(): Color {
    return this._backgroundColor;
  }

  /**
   * @return {boolean} Returns whether the window has a nonzero client width and height.
   */
  canProject(): boolean {
    const displayWidth = this.getWidth();
    const displayHeight = this.getHeight();
    return displayWidth != 0 && displayHeight != 0;
  }

  /**
   * Renders this provider's content, resizing the canvas to its container.
   *
   * The default implementation only sets the WebGL's clear color to the
   * background but does not clear the canvas.
   *
   * @return {boolean} true if this provider needs an additional call to complete rendering its content.
   * @throws if the scene cannot be projected to, as determined by canProject
   */
  render(): boolean {
    this._container.style.backgroundColor = this._backgroundColor.asRGBA();

    const gl = this.gl();
    if (this.gl().isContextLost()) {
      return false;
    }
    // console.log("Rendering window");
    if (!this.canProject()) {
      throw new Error(
        "Refusing to render to an unprojectable window." +
          " Use canProject() to handle, and parent this" +
          " window's container to fix."
      );
    }

    // Lookup the size the browser is displaying the canvas.
    const displayWidth = this.width();
    const displayHeight = this.height();
    // Check if the canvas is not the same size.
    if (
      this.canvas().width != displayWidth ||
      this.canvas().height != displayHeight
    ) {
      // Make the canvas the same size
      this.canvas().width = displayWidth;
      this.canvas().height = displayHeight;
    }

    const bg = this.backgroundColor();
    gl.clearColor(bg.r(), bg.g(), bg.b(), bg.a());

    return false;
  }
}
