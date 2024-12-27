//access DOM elements of calculator
const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");

let expression = "";
let result = "";

//define event handler for button clicks
function buttonClick(event) {
  //get values from clicked buttons
  const target = event.target;
  const action = target.dataset.action;
  const value = target.dataset.value;

  //switch case to control the calculator
  switch (action) {
    case "number":
      addValue(value);
      break;
    case "clear":
      clear();
      break;
    case "backspace":
      backspace();
      break;
    //add result to expression as a starting point if expression is empty
    case "addition":
    case "substraction":
    case "multiplication":
    case "division":
      if (expression == "" && result !== "") {
        startFromResult(value);
      } else if (expression !== "" && !isLastCharOperator()) {
        addValue(value);
      }
      break;
    case "submit":
      submit();
      break;
    case "negate":
      negate();
      break;
    case "mod":
      percentage();
      break;
    case "decimal":
      decimal(value);
      break;
  }
  updateDisplay(expression, result);
}

inputBox.addEventListener("click", buttonClick);
function addValue(value) {
  //add value to expression
  expression += value;
}

function updateDisplay(expression, result) {
  expressionDiv.textContent = expression;
  resultDiv.textContent = result;
}

function clear() {
  expression = "";
  result = "";
}

function backspace() {
  expression = expression.slice(0, -1);
}

function isLastCharOperator() {
  //we can add only one operator at a time, not like389-+-
  return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
  expression += result + value;
}

function submit() {
  result = evaluateExpression();
  expression = "";
}

function evaluateExpression() {
  const evalResult = eval(expression);
  //check if evalResult isNaN or infinite. If it is return a space character ' '
  return isNaN(evalResult) || !isFinite(evalResult)
    ? " "
    : evalResult < 1
    ? parseFloat(evalResult.toFixed(10))
    : parseFloat(evalResult.toFixed(2));
}

function negate() {
  if (expression === "" && result !== "") {
    result = -result;
  } else if (!expression.startsWith("-") && expression !== "") {
    expression = "-" + expression;
  } else if (expression.startsWith("-")) {
    expression = expression.slice(1);
  }
}

function percentage() {
  if (expression !== "") {
    result = evaluateExpression();
    expression = "";
    if (!isNaN(result) && isFinite(result)) {
      result /= 100;
    } else {
      result = "";
    }
  } else if (result !== "") {
    result = parseFloat(result) / 100;
  }
}

function decimal(value) {
  const lastOperatorIndex = Math.max(
    expression.lastIndexOf("+"),
    expression.lastIndexOf("-"),
    expression.lastIndexOf("*"),
    expression.lastIndexOf("/")
  );

  // Get the current number after the last operator
  const currentNumber = expression.slice(lastOperatorIndex + 1);

  // Add the decimal only if the current number doesn't already contain one
  if (!currentNumber.includes(".")) {
    addValue(value);
  }
}
