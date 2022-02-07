import GLProvider, { Shaders } from "./GLProvider";
import WebGL2Provider from "./WebGL2Provider";
import DebugGLProvider from "./DebugGLProvider";
import ProxyGLProvider from "./ProxyGLProvider";
import BasicGLProvider from "./BasicGLProvider";

import checkGLError, { ignoreGLErrors } from "parsegraph-checkglerror";
import { compileShader } from "parsegraph-shader";

function compileProgram(
  window: GLProvider,
  shaderName: string,
  vertexShader: string,
  fragShader: string
) {
  const gl = window.gl();
  const shaders = window.shaders();
  if (gl.isContextLost()) {
    return;
  }
  if (shaders[shaderName]) {
    return shaders[shaderName];
  }

  const program = gl.createProgram();
  checkGLError(
    gl,
    "compileProgram.createProgram(shaderName='",
    shaderName,
    ")"
  );

  const compiledVertexShader = compileShader(
    gl,
    vertexShader,
    gl.VERTEX_SHADER,
    shaderName
  );
  checkGLError(
    gl,
    "compileProgram.compile vertex shader(shaderName='",
    shaderName,
    ")"
  );

  gl.attachShader(program, compiledVertexShader);
  checkGLError(
    gl,
    "compileProgram.attach vertex shader(shaderName='",
    shaderName,
    ")"
  );

  const compiledFragmentShader = compileShader(
    gl,
    fragShader,
    gl.FRAGMENT_SHADER,
    shaderName
  );
  checkGLError(
    gl,
    "compileProgram.compile fragment shader(shaderName='",
    shaderName,
    ")"
  );
  gl.attachShader(program, compiledFragmentShader);
  checkGLError(
    gl,
    "compileProgram.attach fragment shader(shaderName='",
    shaderName,
    ")"
  );

  gl.linkProgram(program);
  if (!ignoreGLErrors()) {
    const st = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!st) {
      throw new Error(
        "'" +
          shaderName +
          "' shader program failed to link:\n" +
          gl.getProgramInfoLog(program)
      );
    }
    const err = gl.getError();
    if (err != gl.NO_ERROR && err != gl.CONTEXT_LOST_WEBGL) {
      throw new Error(
        "'" + shaderName + "' shader program failed to link: " + err
      );
    }
  }

  shaders[shaderName] = program;
  // console.log("Created shader for " + shaderName + ": " + program);
  return program;
}

export {
  compileProgram,
  GLProvider,
  Shaders,
  BasicGLProvider,
  ProxyGLProvider,
  WebGL2Provider,
  DebugGLProvider,
};
