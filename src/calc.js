
// this variable is here for test and debug 
const buttons = document.querySelector(".calc__buttons");
const numbers = document.querySelectorAll(".calc__numbers div");
const operations = document.querySelectorAll(".calc__operations div");
let result = document.querySelector(".calc__result");
let equal = document.querySelector(".equal");
let btnClear = document.querySelector(".clear");
// let btnRemove = document.querySelector(".remove");
let btnClose = document.querySelector(".calc__btnClose");
const allOperations = document.querySelectorAll(".right-panel div");

// const btnParentheses = document.querySelector(".parent");

// ==== when click on claculator show it ====
function toggleCalc(btnCalc,calculator) {
  btnCalc.onclick = function () {
    calculator.style.display = "block";
  };
}

function handelCalcNumbers(numbers,result,btnRemove) {
  numbers.forEach((number) => {
    number.addEventListener("click", (e) => {
      //show result in the result div
      result.innerHTML += e.target.innerHTML;
      // change remove Button opacity
      if (result.innerHTML.length > 0) {
        console.log("change remove opacity");
        btnRemove.style.opacity = "1";
      }
    });
  });
}

function handelCalcOperations(allOperations,result) {
  // when click on operation mark
  allOperations.forEach((op) => {
    op.addEventListener("click", (e) => {
      let currInput = result.innerHTML;
      let lastChar = currInput[currInput.length - 1];
      if (
        lastChar == "+" ||
        lastChar == "-" ||
        lastChar == "*" ||
        lastChar == "/"
      ) {
        let newString =
          currInput.substring(0, currInput.length - 1) + e.target.innerHTML;
        result.innerHTML = newString;
      } else result.innerHTML += e.target.innerHTML;
    });
  });
}

function handelCalcEqual(equal,result) {
  equal.addEventListener("click", (e) => {
    calc(result.innerHTML);
  });
}

//main calc function
function calc(operation) {
  if (operation.length >= 3) {
    // split the operation in array
    let arrayOfOperation = operation.split("");

    // get type of operation to use it in switch
    let opMark = arrayOfOperation.filter((ele) => {
      return ele == "+" || ele == "-" || ele == "*" || ele == "/";
    });

    // // index Of operation type
    let indexOfOpMark = arrayOfOperation.findIndex((ele) => {
      return ele == opMark;
    });

    // num3 is used to hold the result of operation between num1 & num2
    let num3 = 0;
    /**
     * ======== &&&&&&& ==========
     * case 1 : [[ only on operation: ]]
     *
     * case 2 : [[ two operation (start with negative)]]
     *
     */
    if (opMark.length == 1) {
      console.log("One Operation");
      //find the first & second Numbers
      // the number before the operation mark is num1
      // the number after the operation mark is num2
      let num1 = operation.substring(0, operation.indexOf(opMark));
      let num2 = operation.substring(
        operation.indexOf(opMark) + 1,
        operation.length
      );
      console.log(`${num1} ## ${opMark} ## ${num2}`);
      opMark = String(opMark);
      switch (opMark) {
        case "+":
          num3 += +num1 + +num2;
          break;
        case "-":
          num3 += +num1 - +num2;
          break;
        case "*":
          num3 += +num1 * +num2;
          break;
        case "/":
          num3 += +num1 / +num2;
          // if num3 has fraction then do this
          if (num3.toString().includes(".")) {
            num3 = num3.toFixed(2);
          }
          if (num3 == "Infinity") {
            console.error("Divison by zero is undefined");
            num3 = "Invali operation";
          }
          break;
      }
      result.innerHTML = "";
      result.innerHTML = num3;
    } else {
      console.log("Start With Negative");
      // check if index start with -
      // console.log(operation.substring(1));
      if (opMark[0] == "-") {
        operation = operation.substring(1); // cancel the (-)
        // console.log(operation)
        num1 = operation.substring(0, operation.indexOf(opMark[1]));
        num2 = operation.substring(
          operation.indexOf(opMark[1]) + 1,
          operation.length
        );
        console.log(`${num1} ## ${opMark[1]} ## ${num2}`);
        /**
         * ===== problem =====
         * -num - num = NaN ??????
         * why >>>> because the array opMark contain 2 same symbol and when using opMark[1] >>> return the first match
         * NOTE : opMark[1] = "-"; && opMark[0] = "-";
         */
        switch (opMark[1]) {
          case "+":
            num3 = (+num1 - +num2) * -1;
            break;
          case "-":
            num3 = (+num1 + +num2) * -1;
            break;
          case "*":
            num3 = +num1 * +num2 * -1;
            break;
          case "/":
            num3 += (+num1 / +num2) * -1;
            if (num3.toString.includes(".")) {
              num3 = num3.toFixed(2);
            }
            if (num3 == "Infinity") {
              console.error("Divison by zero is undefined");
              num3 = "Invalid operation";
            }
            break;
        }
        result.innerHTML = "";
        result.innerHTML = num3;
      }
    }
  } else console.log("can't op");
}

function handelClearCalcResult(btnClear,result,btnRemove) {
  // clear result
  btnClear.onclick = function () {
    result.innerHTML = "";
    btnRemove.style.opacity = "0.7";
  };
}

function handelCalcRemoveBtn(btnRemove,result) {
  //remove
  btnRemove.onclick = function () {
    let re_result = result.innerHTML.split("");
    re_result.pop();
    result.innerHTML = re_result.join("");

    if (result.innerHTML.length == 0) {
      btnRemove.style.opacity = "0.7";
    }
  };
}

function handelCalcClose(btnClose) {
  // close calc
  btnClose.onclick = function () {
    let calc = document.querySelector(".calc");
    calc.style.display = "none";
  };
}

export {
  toggleCalc,
  handelCalcNumbers,
  handelCalcOperations,
  handelCalcEqual,
  handelCalcRemoveBtn,
  handelClearCalcResult,
  handelCalcClose,
};
/**
 *  ======= Future Updates =======
 * use parentheses
 * 
 * ======= some event shape =======
 * 
 btnParentheses.onclick = function () {
   // if (result.innerHTML == "") {
     console.log("invaild");
    if (result.innerHTML.charAt(0) == "(") {
     result.innerHTML = `${result.innerHTML})`;
   } else result.innerHTML = `(${result.innerHTML}`;
  };
 * 
 */
