export type Shaders = { [shaderName: string]: WebGLProgram };

export default interface GLProvider {
  /**
   * Returns true if this provider has a GL context.
   */
  hasGL(): boolean;

  /**
   * Returns true if this provider has a rendering canvas.
   */
  hasCanvas(): boolean;

  /**
   * Returns the GL context for this provider.
   */
  gl(): WebGLRenderingContext;

  /**
   * Returns the shared shader map.
   */
  shaders(): Shaders;

  /**
   * Returns the root HTML element controlled by this provider.
   */
  container(): HTMLElement;

  /**
   * Returns the canvas used for rendering by this provider.
   */
  canvas(): HTMLCanvasElement;

  /**
   * Sets the listener for this provider, to be notified when the
   * provider's context has been lost or regained.
   */
  setOnContextChanged(
    listener: (isLost: boolean) => void,
    listenerObj?: any
  ): void;

  /**
   * Returns true if this provider has a valid width and height.
   */
  canProject(): boolean;

  /**
   * Returns the width of this provider's canvas, in pixels.
   */
  width(): number;

  /**
   * Returns the height of this provider's canvas, in pixels.
   */
  height(): number;

  /**
   * Sets up the canvas and GL context for rendering.
   *
   * Returns true if the provider needs another call to complete
   * rendering, otherwise false.
   *
   * Throws an Error if the scene cannot be projected to.
   */
  render(): boolean;
}
