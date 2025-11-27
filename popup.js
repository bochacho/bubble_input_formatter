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
}

// Runs formatValue on the entire JSON (nested)

function formatJson(obj){
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('Input must be a valid JSON object');
    }
    const result = {}
    for (const [key,value] of Object.entries(obj)){
        if(Array.isArray(value)){
            result[key] = value.forEach((item,index) => {
                if (typeof item === 'object' && item !== null) {
                    return formatJson(item)
                } else {
                    return formatValue(`${key}[${index}]`, item)
                }
            })
        } else if (typeof value === 'object' && value !== null){
            result[key] = formatJson(value)
        } else {
            result[key] = formatValue(key, value);
        }
    }
  return result
}

function stringify(obj, space=2){
  const indent = typeof space === 'number' ? ' '.repeat(space) : space;
  const newline = indent ? '\n' : '';
  const separator = indent ? ',\n' : ', ';
  const colonSpace = ' ';

  const cleaned = Object.entries(obj).map(([k,v]) => {
    const inner = v.replace(/^"(.*)"$/, '$1'); 
    const needsQuotes = v.startsWith('"');
    const line = `"${k}":${colonSpace}${needsQuotes ? `"${inner}"` : inner}`;
    return indent ? `${indent}${line}` : line;   
  })

  if (indent) {
    return `{\n${cleaned.join(separator)}\n}`;
  }
  return `{ ${cleaned.join(separator)} }`;
}

function showMessage(text, type = 'success') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

formatBtn.addEventListener('click', () => {
  try {
    const inputText = inputTextArea.value.trim();

    if (!inputText) {
      showMessage('Please enter JSON to format', 'error');
      return;
    }

    const jsonObj = JSON.parse(inputText);

    const formatted = formatJson(jsonObj);

    let jsonString = stringify(formatted, 2);

    // Display the result
    outputTextArea.value = jsonString;
    showMessage('JSON formatted successfully!', 'success');

  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
    outputTextArea.value = '';
  }
});

clearBtn.addEventListener('click', () => {
  inputTextArea.value = '';
  outputTextArea.value = '';
  messageDiv.style.display = 'none';
});


copyBtn.addEventListener('click', async () => {
  const outputText = outputTextArea.value;

  if (!outputText) {
    showMessage('Nothing to copy', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText);
    showMessage('Copied to clipboard!', 'success');
  } catch (error) {
    showMessage('Failed to copy to clipboard', 'error');
  }
});
