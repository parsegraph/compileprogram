const assert = require("assert");
import { compileProgram } from "../src/index";
import { BasicGLProvider } from "../src/index";

describe("compileProgram", function () {
  it("works", () => {
    assert.ok(compileProgram);
  });
});

describe("BasicGLProvider", function () {
  it("can be constructed and rendered", () => {
    const prog = new BasicGLProvider();
    prog.setExplicitSize(400, 400);
    document.body.appendChild(prog.container());
    prog.render();
  });
});
