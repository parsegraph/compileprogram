import GLProvider, { Shaders } from "./GLProvider";
import checkGLError from "parsegraph-checkglerror";
import Color from "parsegraph-color";
import Rect from "parsegraph-rect";
import Method from "parsegraph-method";

export default class BasicGLProvider implements GLProvider {
  _shaders: Shaders;
  _gl: WebGLRenderingContext;
  _container: HTMLDivElement;
  _canvas: HTMLCanvasElement;
  _explicitWidth: number;
  _explicitHeight: number;
  _contextChangedListener: Method;

  constructor() {
    this._shaders = {};
    this._gl = null;

    this._contextChangedListener = new Method();

    this._container = document.createElement("div");
    this._explicitWidth = null;
    this._explicitHeight = null;
  }

  protected onContextChanged(isLost: boolean): void {
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

    this._contextChangedListener.call(isLost);
  }

  setOnContextChanged(listener: (isLost: boolean) => void, listenerObj?: any) {
    this._contextChangedListener.set(listener, listenerObj);
  }

  shaders(): Shaders {
    return this._shaders;
  }

  hasGL():boolean {
    return !!this._gl;
  }

  protected createGL() {
    return this.canvas().getContext("webgl");
  }

  gl(): WebGLRenderingContext {
    if (this.hasGL()) {
      return this._gl;
    }
    this._gl = this.createGL();
    if (this._gl) {
      checkGLError(this._gl, "WebGL creation");
      return this._gl;
    }
    throw new Error("GL context is not supported");
  }

  hasCanvas():boolean {
    return !!this._canvas;
  }

  protected createCanvas() {
    // The 3D canvas that will be drawn to.
    const canvas = document.createElement("canvas");
    canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        // console.log('Context lost');
        event.preventDefault();
        this.onContextChanged(true);
      },
      false
    );
    canvas.addEventListener(
      "webglcontextrestored",
      () => {
        //console.log("Context restored");
        this.onContextChanged(false);
      },
      false
    );
    canvas.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
      },
      false
    );
    canvas.style.display = "block";
    return canvas;
  }

  canvas(): HTMLCanvasElement {
    if (!this.hasCanvas()) {
      this._canvas = this.createCanvas();
      this.container().appendChild(this._canvas);
    }
    return this._canvas;
  }

  getSize(sizeOut?: Rect): Rect {
    if (!sizeOut) {
      sizeOut = new Rect();
    }
    sizeOut.setX(0);
    sizeOut.setY(0);
    sizeOut.setWidth(this.width());
    sizeOut.setHeight(this.height());
    return sizeOut;
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

  setBackground(bg: Color): void {
    this.container().style.backgroundColor = bg.asRGBA();
    if (this.hasGL() && !this.gl().isContextLost()) {
      this.gl().clearColor(bg.r(), bg.g(), bg.b(), bg.a());
    }
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
    if (this.hasGL() && this.gl().isContextLost()) {
      return true;
    }

    if (!this.canProject()) {
      throw new Error(
        "Refusing to render to an unprojectable window." +
          " Use canProject() to handle, and parent this" +
          " window's container to fix."
      );
    }

    if (this.hasCanvas()) {
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
    }

    return false;
  }
}
