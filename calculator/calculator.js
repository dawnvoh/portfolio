$(document).ready(function() {

  /**** Enums ****/
  //These are objects to simulate enumerations.  
  var Operation = {
    NONE: 0,
    EQUAL: 1,
    ADD: 2,
    SUBTRACT: 3,
    MULTIPLY: 4,
    DIVIDE: 5
  };

  var CalcState = {
    NEED_FIRST: 0,
    NEED_OPERATION: 1,
    NEED_SECOND: 2
  };

  /****************************/
  /**** SignedNumber CLASS ****/
  /****************************/
  function SignedNumber() {
    /** properties **/
    this.hasDot = false;
    this.isNeg = false;
    this.valueStr = "0";

    /**** methods ****/
    this.clear = function() {
      this.hasDot = false;
      this.isNeg = false;
      this.valueStr = "0";
    };

    /* parameter is a SignedNumber object */
    this.copy = function(signedNum) {
      this.isNeg = signedNum.isNeg;
      this.hasDot = signedNum.hasDot;
      this.valueStr = signedNum.valueStr;
    };

    /* parameter is just a number */
    this.set = function(newVal) {
      if (newVal < 0) {
        this.isNeg = true;
        var temp = -1 * newVal;
        this.valueStr = temp.toString();
      } else {
        this.isNeg = false;
        this.valueStr = newVal.toString();
      }

      //look for decimal point
      if (this.valueStr.indexOf(".") === -1) {
        this.hasDot = false;
      } else {
        this.hasDot = true;
      }
    };

    this.updateSign = function() {
      //toggle positive & negative 
      /* This is why I chose not to store it with the value string.
      That choice led to other complications, but... complications 
      helped me learn more about JavaScript. */
      this.isNeg = !this.isNeg;
    };

    this.updateVal = function(str) {
      var maxDigits = 7;
      if (this.hasDot || this.isNeg) {
        maxDigits += 1; //room for one extra but not two
      }
      //limit strings to 7 characters, plus possible negative sign
      if (this.valueStr.length < maxDigits) {
        //do not show leading zeros if not needed
        if (this.valueStr === "0") {
          if (str === "0") {
            //do nothing
          } else if (str === ".") {
            this.valueStr += str;
          } else {
            //remove the leading zero
            this.valueStr = str;
          }
        }
        //else add digit or dot to value
        else {
          this.valueStr += str;
        }
      }
    };

    this.getValAsStr = function() {
      var tempStr = "";
      if (this.isNeg) {
        tempStr = "-";
      }
      tempStr += this.valueStr;

      return tempStr;
    };

    this.getValAsNum = function() {
      return Number(this.getValAsStr());
    };

    this.display = function() {
      var maxDigits = 7;
      if (this.hasDot || this.isNeg) {
        maxDigits += 1; //room for one extra but not two
      }
      
      var dispStr = this.getValAsStr();
      if (dispStr === "-0")
        {
          dispStr = "-"
        }
      
      /* Limit display to max characters, with proper rounding.
      NOTE: toPrecision() rounds to a specified number of
      significant digits. Parse until I hit a digit that is 1-9.
      This way I can count the neg sign and leading zeros, and 
      determine best place to do the rounding.*/
      if (dispStr.length > maxDigits) {
        var temp = this.getValAsNum();
        var insignificants = dispStr.search("[1-9]");
        if (insignificants > -1 && insignificants < maxDigits) {
          temp = temp.toPrecision(maxDigits - insignificants);
        }
        //sometimes numbers are still too long with scientific notation
        if (temp.toString().length > maxDigits) {
          //convert to exponential notation. 3 digits after dec pt
          //to leave space for whole num, dot, and exponent portion.
          temp = this.getValAsNum().toExponential(3);
        }
        dispStr = temp.toString();
      }
      $("#displayStr").text(dispStr);
    };
  }

  /**** SignedNumber OBJECT ****/
  var currentArg = new SignedNumber();

  /***********************/
  /**** Session CLASS ****/
  /***********************/
  function Session() {
    //private properties
    var state = CalcState.NEED_FIRST;
    var operator = Operation.NONE;
    var firstArg = new SignedNumber();
    //var secondArg = new SignedNumber();

    /**** methods ****/
    this.clearAll = function() {
      state = CalcState.NEED_FIRST;
      operator = Operation.NONE;
      firstArg.clear();
      //secondArg.clear();
    };

    this.calculate = function() {
      var argOne = firstArg.getValAsNum();
      var argTwo = currentArg.getValAsNum(); //secondArg
      var answer = 0;

      /*if () {
        check whether argOne and argTwo are valid?
      }*/
      switch (operator) {
        case Operation.ADD:
          answer = argOne + argTwo;
          break;
        case Operation.SUBTRACT:
          answer = argOne - argTwo;
          break;
        case Operation.MULTIPLY:
          answer = argOne * argTwo;
          break;
        case Operation.DIVIDE:
          if (argTwo != 0) {
            answer = argOne / argTwo;
          } else {
            //return an error status
            answer = undefined;
          }
          break;
        case Operation.NONE:
        case Operation.EQUAL:
        default:
          state = CalcState.NEED_OPERATION;
          break;
      }
      return answer;
    };

    this.checkSession = function(op) {
      //user has pressed an operation key
      switch (state) {
        case CalcState.NEED_FIRST:
          //store the value and the operation
          if (currentArg.getValAsStr() != "") {
            firstArg.copy(currentArg);
            if (op > Operation.EQUAL) {
              currentArg.clear();
              operator = op;
              state = CalcState.NEED_SECOND;
            } else {
              //don't store "=" as an operation
              state = CalcState.NEED_OPERATION;
              //and the current entry is still active until
              //user presses operation, so don't clear it
            }
          }
          //else ignore the operation, we still need firstArg
          break;

        case CalcState.NEED_OPERATION:
              currentArg.clear();
          //store the operation
            if (op > Operation.EQUAL) {
              operator = op;
              state = CalcState.NEED_SECOND;
            } else {
              //don't store "=" as an operation
              state = CalcState.NEED_OPERATION;
            }
          break;
        
        case CalcState.NEED_SECOND:
          if (currentArg.getValAsStr() != "") {
            //This is the second argument we needed.
            //Calculate, and store result as the
            //first entry for the next session.
            var answer = this.calculate();
            if (answer === undefined || answer === NaN) {
              $("#displayStr").text("Err");
              this.clearAll();
              currentArg.clear();
              state = CalcState.NEED_FIRST;
            } else {
              firstArg.set(answer);
              firstArg.display();
              //store or change the operation
              if (op > Operation.EQUAL) {
                firstArg.set(answer);
                firstArg.display();
                operator = op;
                state = CalcState.NEED_SECOND;
              } else {
                currentArg.set(answer);
                currentArg.display();
                state = CalcState.NEED_FIRST;
              }
              currentArg.clear();
            }
          }
          break;
      }
    };
  }

  /**** Session OBJECT ****/
  var session = new Session();

  /*******************/
  /**** EXECUTION ****/
  /*******************/  
  $("#clearall").click(function() {
    $("#clearall").animate({opacity: 0.9}, "fast");
    $("#clearall").animate({opacity: 1.0}, "fast");
    session.clearAll();
    currentArg.clear();
    //ready the display
    currentArg.display();
  });

  $("#clearentry").click(function() {
    $("#clearentry").animate({opacity: 0.85}, "fast");
    $("#clearentry").animate({opacity: 1.0}, "fast");
    currentArg.clear();
    //ready the display
    currentArg.display();
  });

  $("#sign").click(function() {
    $("#sign").animate({opacity: 0.8}, "fast");
    $("#sign").animate({opacity: 1.0}, "fast");
    //checkSession();
    currentArg.updateSign();
    currentArg.display();
  });

  $("#divide").click(function() {
    $("#divide").animate({opacity: 0.8}, "fast");
    $("#divide").animate({opacity: 1.0}, "fast");
    session.checkSession(Operation.DIVIDE);
  });

  $("#mult").click(function() {
    $("#mult").animate({opacity: 0.8}, "fast");
    $("#mult").animate({opacity: 1.0}, "fast");
    session.checkSession(Operation.MULTIPLY);
  });

  $("#subtract").click(function() {
    $("#subtract").animate({opacity: 0.8}, "fast");
    $("#subtract").animate({opacity: 1.0}, "fast");
    session.checkSession(Operation.SUBTRACT);
  });

  $("#add").click(function() {
    $("#add").animate({opacity: 0.8}, "fast");
    $("#add").animate({opacity: 1.0}, "fast");
    session.checkSession(Operation.ADD);
  });

  $("#equal").click(function() {
    $("#equal").animate({opacity: 0.8}, "fast");
    $("#equal").animate({opacity: 1.0}, "fast");
    session.checkSession(Operation.EQUAL);
  });

  $("#dot").click(function() {
    $("#dot").animate({opacity: 0.8}, "fast");
    $("#dot").animate({opacity: 1.0}, "fast");
    if (currentArg.hasDot === false) {
      currentArg.updateVal(".");
      currentArg.hasDot = true;
      currentArg.display();
    }
  });

  $("#zero").click(function() {
    $("#zero").animate({opacity: 0.8}, "fast");
    $("#zero").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("0");
    currentArg.display();
  });

  $("#one").click(function() {
    $("#one").animate({opacity: 0.8}, "fast");
    $("#one").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("1");
    currentArg.display();
  });

  $("#two").click(function() {
    $("#two").animate({opacity: 0.8}, "fast");
    $("#two").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("2");
    currentArg.display();
  });

  $("#three").click(function() {
    $("#three").animate({opacity: 0.8}, "fast");
    $("#three").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("3");
    currentArg.display();
  });

  $("#four").click(function() {
    $("#four").animate({opacity: 0.8}, "fast");
    $("#four").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("4");
    currentArg.display();
  });

  $("#five").click(function() {
    $("#five").animate({opacity: 0.8}, "fast");
    $("#five").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("5");
    currentArg.display();
  });

  $("#six").click(function() {
    $("#six").animate({opacity: 0.8}, "fast");
    $("#six").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("6");
    currentArg.display();
  });

  $("#seven").click(function() {
    $("#seven").animate({opacity: 0.8}, "fast");
    $("#seven").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("7");
    currentArg.display();
  });

  $("#eight").click(function() {
    $("#eight").animate({opacity: 0.8}, "fast");
    $("#eight").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("8");
    currentArg.display();
  });

  $("#nine").click(function() {
    $("#nine").animate({opacity: 0.8}, "fast");
    $("#nine").animate({opacity: 1.0}, "fast");
    currentArg.updateVal("9");
    currentArg.display();
  });
});