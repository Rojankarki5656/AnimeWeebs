const devtoolsDetection = () => {
  function antiDebugFunction(shouldReturn) {
    function recursiveCheck(n) {
      // If n is a string, create an infinite loop using the Function constructor
      if (typeof n === "string") {
        return Function("while (true) {}").apply("counter");
      }

      // Try to confuse static analysis tools with nonsensical logic
      if (String(n / n).length !== 1 || n % 20 === 0) {
        // This block creates a function that includes a 'debugger' statement
        Function("debugger").call("action");
      } else {
        // This block also includes a 'debugger' statement, applied with different syntax
        Function("debugger").apply("stateObject");
      }

      // Recursively call itself with the next number
      recursiveCheck(++n);
    }

    try {
      // If the flag is true, return the recursiveCheck function
      if (shouldReturn) {
        return recursiveCheck;
      }

      // Otherwise, start the recursive check with 0
      recursiveCheck(0);
    } catch (e) {
      // Catch any thrown error silently
    }
  }

  // Run the antiDebugFunction every 4 seconds
  setInterval(() => {
    antiDebugFunction();
  }, 4000);

  // Run another anti-debug routine every 100ms
  setInterval(() => {
    for (let i = 0; i < 10000; i++) {
      Function("debugger").call(); // Will trigger the debugger if devtools are open
    }
  }, 100);
};

export default devtoolsDetection;
