export default interface GLProvider {
  gl():WebGLRenderingContext;
  shaders():{ [shaderName:string]:WebGLProgram };
  id():string;
  container():HTMLElement;
  canvas():HTMLCanvasElement;
}
