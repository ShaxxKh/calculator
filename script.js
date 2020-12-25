class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false
        this.clear()
    }
clear() {
    this.previousOperand = ''
    this.currentOperand = ''
    this.readyToReset = false
    this.operation = undefined
}

delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
}

appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
}
negative(sign) {
    if(this.currentOperand === ''){
    this.currentOperand = sign
    }
    else if (this.currentOperand.toString()[0] === '-'){
        this.currentOperand = this.currentOperand.toString().slice(1)
    }
    else {
        this.currentOperand = sign + this.currentOperand.toString()
    }
    
}

chooseOperation(operation) {
    if(this.currentOperand === '') return
    if(this.previousOperand !== '') {
        this.compute()
    }
    
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
}

compute() {
    let computation
    const previous = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    let decimalsPrevious
    let decimalsCurrent
    if(isNaN(previous) || isNaN(current)) return
    
    switch (this.operation) {
        case '+':
            if(previous.toString().includes('.') && current.toString().includes('.')){
                decimalsPrevious = previous.toString().split('.')[1].length
                decimalsCurrent = current.toString().split('.')[1].length

                if(decimalsPrevious >= decimalsCurrent){
                    computation = (previous * Math.pow(10, decimalsPrevious) + current * Math.pow(10, decimalsPrevious)) / Math.pow(10, decimalsPrevious)
                    }
                    else {
                    computation = (previous * Math.pow(10, decimalsCurrent) + current * Math.pow(10, decimalsCurrent)) / Math.pow(10, decimalsCurrent)
                    }
            }
            else if (previous.toString().includes('.')){
                decimalsPrevious = previous.toString().split('.')[1].length
                
                computation = (previous * Math.pow(10, decimalsPrevious) + current * Math.pow(10, decimalsPrevious)) / Math.pow(10, decimalsPrevious)

            }
            else if (current.toString().includes('.')){
                decimalsCurrent = current.toString().split('.')[1].length

                computation = (previous * Math.pow(10, decimalsCurrent) + current * Math.pow(10, decimalsCurrent)) / Math.pow(10, decimalsCurrent)
            }
            else {
                computation = previous + current
            }
            
            
            
            break
        case '-':
            if(previous.toString().includes('.') && current.toString().includes('.')){
                decimalsPrevious = previous.toString().split('.')[1].length
                decimalsCurrent = current.toString().split('.')[1].length

                if(decimalsPrevious >= decimalsCurrent){
                    computation = (previous * Math.pow(10, decimalsPrevious) - current * Math.pow(10, decimalsPrevious)) / Math.pow(10, decimalsPrevious)
                    }
                    else {
                    computation = (previous * Math.pow(10, decimalsCurrent) - current * Math.pow(10, decimalsCurrent)) / Math.pow(10, decimalsCurrent)
                    }
            }
            else if (previous.toString().includes('.')){
                decimalsPrevious = previous.toString().split('.')[1].length
                
                computation = (previous * Math.pow(10, decimalsPrevious) - current * Math.pow(10, decimalsPrevious)) / Math.pow(10, decimalsPrevious)

            }
            else if (current.toString().includes('.')){
                decimalsCurrent = current.toString().split('.')[1].length

                computation = (previous * Math.pow(10, decimalsCurrent) - current * Math.pow(10, decimalsCurrent)) / Math.pow(10, decimalsCurrent)
            }
            else {
                computation = previous - current
            }
            break
        case '*':
            computation = (previous * current).toFixed(2)
            break
        case '÷':
            computation = parseFloat((previous / current).toPrecision(2))
            break
        case '√':
            if (previous.toString()[0] === '-' && current % 2 === 1){
            computation = `-${Math.pow(parseFloat(previous.toString().slice(1)), 1/current)}`
            }
            else if (previous.toString()[0] === '-') {
                this.currentOperandTextElement.innerText = 'Error'
                this.previousOperandTextElement.innerText = ''
                
            }
            else {
                computation = parseFloat(Math.pow(previous, 1/current).toPrecision(2))
            }
            break
        case '^':
            computation = Math.pow(previous, current)
            break
        default:
            return
    }
    this.readyToReset = true
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''

}

getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if(isNaN(integerDigits)){
        integerDisplay = ''
    }
    else {
        integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
    }
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
    }
    else {
        return integerDisplay
    }
}

updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
        this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    }
    else {
        this.previousOperandTextElement.innerText = ''
    }
}

}
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const allClearButton = document.querySelector('[data-all-clear]');
const deleteButton = document.querySelector('[data-delete]');
const equalsButton = document.querySelector('[data-equals]');
const negativeButton = document.querySelector('[negative-number]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if(calculator.previousOperand === '' && calculator.currentOperand !== '' && calculator.readyToReset){
            calculator.currentOperand = ''
            calculator.readyToReset = false
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay();
    })
})
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay();
    })
})
equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})
allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})
deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})
negativeButton.addEventListener('click', button => {
    calculator.negative('-')
    calculator.updateDisplay()
})
