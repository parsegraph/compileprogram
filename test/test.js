var assert = require("assert");
import todo from "../dist/compileprogram";

describe("Package", function () {
  it("works", ()=>{
    assert.equal(todo(), 42);
  });
});
