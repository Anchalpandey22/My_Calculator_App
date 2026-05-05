import { useState } from 'react'
import './App.css'

function App() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [operator, setOperator] = useState(null)
  const [prevValue, setPrevValue] = useState(null)
  const [waitingForNext, setWaitingForNext] = useState(false)
  const [complete, setComplete] = useState(false)

  function handleNumber(num) {
    if (complete) {
      setDisplay(String(num))
      setExpression(String(num))
      setComplete(false)
      setWaitingForNext(false)
      return
    }

    if (waitingForNext) {
      setDisplay(String(num))
      setWaitingForNext(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
    setExpression(prev => prev + num)
  }

  function handleDecimal() {
    if (complete) {
      setDisplay('0.')
      setExpression('0.')
      setComplete(false)
      setWaitingForNext(false)
      return
    }

    if (waitingForNext) {
      setDisplay('0.')
      setExpression(prev => prev + '0.')
      setWaitingForNext(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
      setExpression(prev => (prev === '' ? '0' : prev) + '.')
    }
  }

  function handleOperator(op) {
    const current = parseFloat(display)
    const opSymbol = op === '*' ? ' × ' : op === '/' ? ' ÷ ' : ` ${op} `
    
    if (complete) {
      setPrevValue(current)
      setOperator(op)
      setExpression(display + opSymbol)
      setComplete(false)
      setWaitingForNext(true)
      return
    }

    if (operator && waitingForNext) {
      setOperator(op)
      setExpression(prev => prev.trim().split(' ').slice(0, -1).join(' ') + opSymbol)
      return
    }

    if (prevValue === null) {
      setPrevValue(current)
    } else if (operator) {
      const result = calculate(prevValue, current, operator)
      setDisplay(String(result))
      setPrevValue(result)
    }

    setWaitingForNext(true)
    setOperator(op)
    setExpression(prev => (prev === '' ? display : prev) + opSymbol)
  }

  function calculate(a, b, op) {
    const res = op === '+' ? a + b : 
                op === '-' ? a - b : 
                op === '*' ? a * b : 
                b !== 0 ? a / b : 'Error'
    return Math.round(res * 100000000) / 100000000 // Handle floating point issues
  }

  function handleEquals() {
    if (!operator || prevValue === null || waitingForNext) return
    const current = parseFloat(display)
    const result = calculate(prevValue, current, operator)
    
    setExpression(prev => `${prev} =`)
    setDisplay(String(result))
    setOperator(null)
    setPrevValue(null)
    setWaitingForNext(false)
    setComplete(true)
  }

  function handleClear() {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setPrevValue(null)
    setWaitingForNext(false)
    setComplete(false)
  }

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display-section">
          <div className="expression">{expression || '\u00A0'}</div>
          <div className="display">{display}</div>
        </div>
        <div className="buttons">
          <button className="btn-clear" onClick={handleClear}>C</button>
          <button className="btn-op" onClick={() => handleOperator('/')}>÷</button>
          <button className="btn-op" onClick={() => handleOperator('*')}>×</button>
          <button className="btn-op" onClick={() => handleOperator('-')}>−</button>

          <button onClick={() => handleNumber('7')}>7</button>
          <button onClick={() => handleNumber('8')}>8</button>
          <button onClick={() => handleNumber('9')}>9</button>
          <button className="btn-op" onClick={() => handleOperator('+')}>+</button>

          <button onClick={() => handleNumber('4')}>4</button>
          <button onClick={() => handleNumber('5')}>5</button>
          <button onClick={() => handleNumber('6')}>6</button>
          <button className="btn-equals" onClick={handleEquals}>=</button>

          <button onClick={() => handleNumber('1')}>1</button>
          <button onClick={() => handleNumber('2')}>2</button>
          <button onClick={() => handleNumber('3')}>3</button>
          
          <button className="btn-zero" onClick={() => handleNumber('0')}>0</button>
          <button onClick={handleDecimal}>.</button>
        </div>
      </div>
    </div>
  )
}

export default App