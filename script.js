class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && operation !== '-') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    computation = "Error";
                } else {
                    computation = prev / current;
                }
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        if(computation === "Error") {
            this.currentOperand = computation;
        } else {
            // Fix floating point issues
            this.currentOperand = Math.round(computation * 100000000) / 100000000;
        }
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        if (number === "Error") return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            let opSymbol = this.operation;
            if (opSymbol === '*') opSymbol = '×';
            if (opSymbol === '/') opSymbol = '÷';
            
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${opSymbol}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-value]');
const operationButtons = document.querySelectorAll('[data-action="operator"]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    if (button.dataset.action !== 'operator' && button.dataset.action !== 'calculate') {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.value);
            calculator.updateDisplay();
            addClickEffect(button);
        });
    }
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.value);
        calculator.updateDisplay();
        addClickEffect(button);
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
    addClickEffect(equalsButton);
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    addClickEffect(clearButton);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    addClickEffect(deleteButton);
});

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9 || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    }
});

// Simple click effect function
function addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 100);
}
