/**
 * Unit tests for the errorUtils module
 */

import {
  castError,
  printErrorWithStack,
} from "../../services/errors/errorUtils";
import * as assert from "assert";

describe("errorUtils", () => {
  describe("castError", () => {
    it("should return the error object when the input is an error object", () => {
      const error = new Error("An error occurred");
      const result = castError(error);
      assert.strictEqual(result, error);
    });

    it("should return an error object when the input is a string", () => {
      const error = "An error occurred";
      const result = castError(error);
      assert(result instanceof Error);
      assert.strictEqual(result.message, error);
    });

    it("should return an error object when the input is an object with name and message properties", () => {
      const error = { name: "Error", message: "An error occurred" };
      const result = castError(error);
      // in this scenario the error is not an actual instance of Error but an object with the same properties
      assert(result instanceof Object);
      assert.strictEqual(result.message, error.message);
    });

    it("should return an error object when the input is an object with a message property", () => {
      const error = { message: "An error occurred" };
      const result = castError(error);
      assert(result instanceof Error);
      assert.strictEqual(result.message, error.message);
    });

    it("should return an error object when the input is an object with an unknown structure", () => {
      const error = { key: "value" };
      const result = castError(error);
      assert(result instanceof Error);
      assert.strictEqual(
        result.message,
        `Unknown error: ${JSON.stringify(error)}`,
      );
    });

    it("should return an error object when the input is null", () => {
      const error = null;
      const result = castError(error);
      assert(result instanceof Error);
      assert.strictEqual(
        result.message,
        `Unknown error: ${JSON.stringify(error)}`,
      );
    });
  });
  describe("printErrorWithStack", () => {
    it("should return the error message when the error has no stack", () => {
      const error = new Error("An error occurred");
      error.stack = undefined;
      const result = printErrorWithStack(error);
      assert.strictEqual(result, error.message);
    });

    it("should return the error message and stack when the error has a stack", () => {
      const error = new Error("An error occurred");
      error.stack =
        "Error: An error occurred\n    at Context.<anonymous> (/path/to/file.js:10:20)";
      const result = printErrorWithStack(error);
      assert.strictEqual(result, `${error.message}\n${error.stack}`);
    });
  });
});
