// splitter function first add the spaces around both the parenthesis
// and then split them on space thus separating each element in input
// console.log(splitter('(+ 2 3)'))
function splitter (input) {
  return input.replace(/\(/g, ' ( ')
              .replace(/\)/g, ' ) ')
              .split(' ')
}

// tokenize function removes the empty strings and the parenthesis elements
// from the array and put each expression in a new array taking consideration
// of the parenthesis
// console.log(tokenize(splitter('(+ 2 3)'), []))
function tokenize (input, list) {
  var firstElem = input.shift()
  if (firstElem === undefined) {
    if (typeof list[0] !== 'object') {
      return list
    }
    return list.pop()
  }
  if (firstElem === '') {
    return tokenize(input, list)
  }
  if (firstElem === '(') {
    list.push(tokenize(input, []))
    return tokenize(input, list)
  }
  if (firstElem === ')') {
    return list
  }
  list.push(firstElem)
  return tokenize(input, list)
}

// object having predefined and user-defined keywords
var obj = {
  '+': function (a, b) {
    return a + b
  },
  '-': function (a, b) {
    return a - b
  },
  '*': function (a, b) {
    return a * b
  },
  '/': function (a, b) {
    return a / b
  },
  '>': function (a, b) {
    return a > b
  },
  '<': function (a, b) {
    return a < b
  },
  '>=': function (a, b) {
    return a >= b
  },
  '<=': function (a, b) {
    return a <= b
  },
  'equal?': function (a, b) {
    return (a === b)
  },
  'number?': function (a) {
    return !isNaN(a)
  },
  'sqr': function (a) {
    return a * a
  },
  'sqrt': function (a) {
    return Math.sqrt(a)
  }
}

// function for special statements like define
// console.log(special(tokenize(splitter('(define A 5)'), [])))
function special (input) {
  var firstElem = input.shift()
  if (firstElem === 'define') {
    obj[input.shift()] = evaluator(input)
  }
  else if (firstElem === 'set!') {
    obj[input.shift()] = evaluator(input)
  }
  else if (firstElem === 'if') {
    var emp = []
    if (special(input.shift())) {
      emp.push(input.shift())
      return special(emp)
    }
    input.shift()
    emp.push(input.shift())
    return special(emp)
  }
  input.unshift(firstElem)
  return evaluator(input)
}

// evaluator function for evaluating expressions, variables and literals
function evaluator (input) {
  var firstElem = input.shift()
  var argsArr = []
  var fn

  if (typeof Number(firstElem) === 'number' && Number(firstElem) === Number(firstElem)) {
    return Number(firstElem)
  }
  if (obj[firstElem] !== undefined) {
    if (typeof obj[firstElem] === 'number') {
      return obj[firstElem]
    }
    fn = obj[firstElem]
    var l = input.length
    for (var i = 0; i < l; ++i) {
      argsArr.push(evaluator(input))
    }
    if (argsArr.length === 1) {
      return fn(argsArr.pop())
    }
    return argsArr.reduce(fn)
  }
  if (firstElem[0] === 'lambda') {
    var ln = firstElem[1].length
    for (var k = 0; k < ln; ++k) {
      obj[firstElem[1][k]] = Number(input[k])
    }
    if (typeof firstElem[2] === 'object') {
      return special(firstElem[2])
    }
    var arr = []
    arr.push(firstElem[2])
    return special(arr)
  }
  if (typeof firstElem === 'object') {
    return evaluator(firstElem)
  }
  if (firstElem === 'quote') {
    return input.shift()
  }
  if (firstElem === 'begin') {
    var len = input.length
    for (var j = 0; j < len; ++j) {
      if (j === len - 1) {
        return special(input.shift())
      }
      special(input.shift())
    }
  }
}

// console.log(special(tokenize(splitter('(define A 5)'), [])))
// console.log(special(tokenize(splitter('(A)'), [])))
// console.log(special(tokenize(splitter('(+ 2 (+ 1 1 1) A)'), [])))
// console.log(special(tokenize(splitter('(if (+ 1 2) 2 (+ 2 2))'), [])))
// console.log(special(tokenize(splitter('(set! A (+ A 1))'), [])))
// console.log(special(tokenize(splitter('A'), [])))
// console.log(special(tokenize(splitter('(quote 3)'), [])))
// console.log(special(tokenize(splitter('(begin (set! x 5) (+ x 1))'), [])))
// console.log(special(tokenize(splitter('((lambda (x y) (+ x y)) 1 6)'), [])))
// console.log(special(tokenize(splitter('((lambda (x) x) 1)'), [])))
// console.log(special(tokenize(splitter('(number? "g")'), [])))
