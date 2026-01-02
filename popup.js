//todo: Add support for curl to get a formatted CURL
// body - modify data to format acording to the formatValue function
// URL -

const inputTextArea = document.getElementById('input')
const outputTextArea = document.getElementById('output')
const formatBtn = document.getElementById('formatBtn')
const clearBtn = document.getElementById('clearBtn')
const copyBtn = document.getElementById('copyBtn')
const messageDiv = document.getElementById('message')

let currentMode = 'json'; // 'json' or 'url'

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

function formatUrl(url){
  // const new_url = url.replace(/^"(.*)"$/, '$1');
  // Replace version (e.g., v2, v1) with [x-version] in pattern /api:key:version/
  let formattedUrl = url.replace(/(\/api:[^:]+:)[^\/]+(\/.*)/g, '$1[x-version]$2');
  // Replace path parameters {param_name} with [param_name]
  formattedUrl = formattedUrl.replace(/\{([^}]+)\}/g, '[$1]');
  return `${formattedUrl}?x-data-source=[x-source]`;
}

function updateUIForMode() {
  if (currentMode === 'json'){
    modeTitle.textContent = 'JSON Formatter';
    inputLabel.textContent = 'Input JSON:';
    inputTextArea.placeholder = '{"name":"","age":15}';
    formatBtn.textContent = 'Format JSON';
    toggleLabels[0].classList.add('active');
    toggleLabels[1].classList.remove('active');
  } else {
    modeTitle.textContent = 'URL Formatter';
    inputLabel.textContent = 'Input URL:';
    inputTextArea.placeholder = 'https://example.com?name=&age=15';
    formatBtn.textContent = 'Format URL';
    toggleLabels[0].classList.remove('active');
    toggleLabels[1].classList.add('active');
  }

  // Clear inputs when switching modes
  inputTextArea.value = '';
  outputTextArea.value = '';
  messageDiv.style.display = 'none';
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
      showMessage(`Please enter ${currentMode === 'json' ? "json" : "url"} to format`, 'error');
      return;
    }

    if (currentMode === 'json'){
      const jsonObj = JSON.parse(inputText);
      const formatted = formatJson(jsonObj);
      let jsonString = stringify(formatted, 2);
        
      // Display the result
      outputTextArea.value = jsonString;
    } else {
      const url = inputText;
      const formatted = formatUrl(url)
      outputTextArea.value = formatted;
    }

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

modeToggle.addEventListener('change', (e) => {
  currentMode = e.target.checked ? 'url' : 'json';
  updateUIForMode();
});

// Initialize UI
updateUIForMode();
