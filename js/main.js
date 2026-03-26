const typing_form = document.querySelector(".typing_form");
const chat_list = document.querySelector(".chat_list");

const API_KEY = "AIzaSyCNPfl0h4OlMxdfVqbtBWV-udyCoOjR-7E"; // ❗ حط مفتاحك
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;



// 
// 


// ==========================
// 🧠 API RESPONSE
// ==========================
const genrateAPIResponse = async (div, userMassage) => {
    const textElment = div.querySelector(".text");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: userMassage
                    }]
                }]
            })
        });

        const data = await response.json();

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        // عرض الرد
        textElment.innerText = reply;

        // ❌ إخفاء اللودينج
        const loading = div.querySelector(".loading_indicator");
        if (loading) loading.style.display = "none";

        div.classList.remove("loading");

    } catch (error) {
        textElment.innerText = "Error fetching response";

        const loading = div.querySelector(".loading_indicator");
        if (loading) loading.style.display = "none";

        div.classList.remove("loading");

        console.error(error);
    }
};


// ==========================
// ⏳ LOADING MESSAGE
// ==========================
const showLoding = (userMassage) => {
    const html = `
        <div class="massage-content">
            <img src="images/gemini.svg" alt="">
            <p class="text"></p>

            <div class="loading_indicator">
                <div class="loading_Bar"></div>
                <div class="loading_Bar"></div>
                <div class="loading_Bar"></div>
            </div>
        </div>
        <span class="material-symbols-outlined copy-btn">
            content_copy
        </span>
    `;

    const div = document.createElement("div");
    div.classList.add("massage", "incoming", "loading");
    div.innerHTML = html;

    chat_list.appendChild(div);

    chat_list.scrollTop = chat_list.scrollHeight;

    genrateAPIResponse(div, userMassage);
};


// ==========================
// 📤 USER MESSAGE
// ==========================
const handleOutGoingChat = () => {
    const input = typing_form.querySelector("input");
    const userMassage = input.value.trim();

    if (!userMassage) return;

    const html = `
        <div class="massage-content">
            <img src="images/user.png" alt="">
            <p class="text">${userMassage}</p>
        </div>
    `;

    const div = document.createElement("div");
    div.classList.add("massage", "outgoing");
    div.innerHTML = html;

    chat_list.appendChild(div);

    typing_form.reset();

    chat_list.scrollTop = chat_list.scrollHeight;

    setTimeout(() => showLoding(userMassage), 500);
};


// ==========================
// 📋 COPY BUTTON
// ==========================
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("copy-btn")) {

        const messageDiv = e.target.closest(".massage");
        const text = messageDiv.querySelector(".text").innerText;

        navigator.clipboard.writeText(text);

        // تغيير الأيقونة
        e.target.innerText = "check";

        setTimeout(() => {
            e.target.innerText = "content_copy";
        }, 1500);
    }
});


// ==========================
// 🎯 SUBMIT
// ==========================
typing_form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutGoingChat();
});
