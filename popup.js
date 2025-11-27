const inputTextArea = document.getElementById('input')
const outputTextArea = document.getElementById('output')
const formatBtn = document.getElementById('formatBtn')
const clearBtn = document.getElementById('clearBtn')
const copyBtn = document.getElementById('copyBtn')
const messageDiv = document.getElementById('message')

// formats the individual value
function formatValue(key, value) {
  switch (typeof value){
    case "string":
      return `"<${key}>"`
    case "number":
      return `<${key}>`
    case "bigint":
      return `<${key}>`
    case "boolean":
      return `<${key}>`
    case "undefined":
      return `<${key}>`
    case "object":
      return `<${key}>`
    default:
      return `<${key}>`
  }
I}

// Runs formatValue on the entire JSON (nested)

function formatJson(obj){
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('Input must be a valid JSON object');
    }
    result = {}
    for (key,value in Object.values(obj)){
        if(Array.isArray(value)){
            result[key] = value.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    return formatJson(item)
                } else {
                    return formatValue(`${key}[${index}]`, item)
                }
            })
        } else if (typeof item === 'object' && item !== null){
            result[key] = formatJson(value)
        } else {
            result[key] = formatValue(value);
        }
    }
  return result
}

function customStringify(obj, space = 2){
    const indent = typeof space === 'number' ? ' '.repeat(space) : space;
    const newline = indent ? '\n' : '';
    const separator = indent ? ',\n' : ', ';
    const colonSpace = ' ';

    
}