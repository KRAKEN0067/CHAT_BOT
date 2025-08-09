const input = document.getElementById('prompt-input');
const button = document.getElementById('submit-button');
const responseArea = document.getElementById('response-area');

button.addEventListener('click', async()=>{
    const prompt = input.value;
    if(!prompt){
        alert("please enter a prompt.");
        return;
    }

    responseArea.textContent = "Generating...";

    const response = await fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}`);
    const data = await response.json();
    responseArea.textContent = data.message;
    input.value = "";
})