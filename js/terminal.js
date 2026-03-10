/**
 * Eric-OS Terminal Logic v1.0
 * Handles command parsing, dynamic input width, and UI feedback.
 */

const userInput = document.getElementById('user-input');
const terminalOutput = document.getElementById('terminal-output');
const windowBody = document.querySelector('.window-body');

// 1. command impact table
const COMMANDS = {
    help: "Available commands: <span class='highlight'>about</span>, <span class='highlight'>skills</span>, <span class='highlight'>projects</span>, <span class='highlight'>contact</span>, <span class='highlight'>clear</span>",
    about: "Hello! I'm Eric, an honors degree student majoring in Computer Science at McMaster University, with an outstanding GPA of 3.77/4.0.<br> I once worked as a Web development and database intern at EY, and am skilled at optimizing complex workflows and solving practical problems through technical means.",
    skills: "<span class='highlight'>Languages:</span> Java, Python, C/C++, SQL, HTML, CSS, JS<br> I have practical experience in front-end, back-end, and database architecture optimization. Additionally, I am well-versed in cutting-edge tools like LLM (large language model), RAG workflow, Git, and Linux (Bash).",
    projects: "I participated in the development of an AI consultation platform for international students based on the RAG workflow, which significantly improved the efficiency and accuracy of policy research.<br> Additionally, I developed a WeChat automatic push tool based on Node.js, and utilized GitHub Actions to achieve 24/7 automated data delivery.",
    contact: "You can contact me via email at<br><span class='highlight'> zhang169@mcmaster.</span> or <span class='highlight'>ericzhang1227@outlook.com</span>.<br> I also highly encourage you to communicate with your peers and establish professional connections on LinkedIn.",
    whoami: "You are a guest user exploring Eric's virtual workspace.",
};

// 2. Listener function: handle user input
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const rawValue = userInput.value; // get the raw input value
        const cmd = rawValue.trim().toLowerCase(); // input clear: remove space and convert to lowercase
        
        // run the command
        handleCommand(cmd, rawValue);
        
        // Reset the content and width after pressing Enter.
        userInput.value = '';
        userInput.style.width = '0ch'; 
    }
});

// 3. core listener function
userInput.addEventListener('input', function() {
    const length = this.value.length;
    // dynamically adjust the input box width based on the input length
    if (length > 0) {
        this.style.width = length + 'ch';
    } else {
        this.style.width = '0ch';
    }
});
/**
 * typewriting function
 * @param {HTMLElement} element - 要插入文字的 DOM 元素
 * @param {string} text - 要打印的完整字符串（支持 HTML 标签，但建议先传纯文本）
 * @param {number} speed - 每个字出现的间隔时间（毫秒）
 */
async function typeWriterHTML(element, html, speed = 20) {
    element.innerHTML = "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const nodes = Array.from(tempDiv.childNodes);

    for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (let char of node.textContent) {
                element.innerHTML += char;
                await new Promise(resolve => setTimeout(resolve, speed));
                scrollToBottom();
            }
        } else {
            element.appendChild(node.cloneNode(true));
        }
    }
}
/**
 * @param {string} cmd - The processed pure instruction
 * @param {string} rawValue - The original text input by the user (for display back)
 */
async function handleCommand(cmd, rawValue) {
    const inputArea = document.getElementById('input-area');
    const userInput = document.getElementById('user-input');
    inputArea.style.display = 'none';

    // a. create display back line
    const echoLine = document.createElement('p');
    echoLine.className = 'line';
    echoLine.innerHTML = `<span class="prompt">guest@eric-os:~$</span> ${rawValue}`;
    
    // Obtain the current input line and ensure that the new content is inserted before it.
    terminalOutput.appendChild(echoLine);

    // b. logical branch
    if (cmd === 'clear') {
        const lines = document.querySelectorAll('.line');
        lines.forEach(line => line.remove());
        inputArea.style.display = 'flex'; // Clear the screen and resume input immediately.
        userInput.focus();
        return;
    }

    if (cmd !== '') {
        // show the loading animation
        const loader = document.createElement('p');
        loader.className = 'line';
        terminalOutput.appendChild(loader);
        
        const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
        let i = 0;
        const loaderInterval = setInterval(() => {
            loader.innerHTML = `<span class="highlight">${frames[i % frames.length]}</span> Processing...`;
            i++;
        }, 80);

        // await 600 ms
        await new Promise(resolve => setTimeout(resolve, 600));

        clearInterval(loaderInterval);
        loader.remove();

        // output the real response
        const response = document.createElement('p');
        response.className = 'line';
        terminalOutput.appendChild(response);

        const content = COMMANDS[cmd] || `Command not found: ${cmd}`;
        await typeWriterHTML(response, content, 30);
    }

    inputArea.style.display = 'flex';
    terminalOutput.appendChild(inputArea); 
    userInput.focus();
    
    scrollToBottom();
}

/**
 * automatic scroll to bottom function
 */
function scrollToBottom() {
    if (windowBody) {
        setTimeout(() => {
            windowBody.scrollTop = windowBody.scrollHeight;
        }, 10);
    }
}

// 4. Initialization: Clicking anywhere in the window automatically focuses on the input box.
document.addEventListener('click', () => {
    userInput.focus();
});

