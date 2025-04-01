(function () {
    // DOM Elements
    const chatContainer = document.createElement('div');
    const elements = {};
    const MAX_MESSAGE_LENGTH = 200; // Giới hạn 200 ký tự

    // CSS và HTML
    chatContainer.innerHTML = `
        <style>
            @keyframes fadeScaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            @keyframes fadeScaleOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9); } }
            @keyframes dots { 0% { content: '.'; } 33% { content: '..'; } 66% { content: '...'; } 100% { content: '.'; } }
            .chat-btn { position: fixed; bottom: 70px; right: 30px; width: 60px; height: 60px; cursor: pointer; z-index: 1000; animation: fadeScaleIn 0.3s ease; }
            .chat-btn.hidden { display: none; animation: fadeScaleOut 0.3s ease; }
            .chat-btn img { width: 100%; height: 100%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 50%; }
            .chat-btn img:hover { border: 1px solid #000; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); transition: all 0.3s ease; }
            .chat-box { position: fixed; bottom: 100px; right: 20px; width: 400px; height: 600px; background-color: #fff; border-radius: 15px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); display: none; flex-direction: column; overflow: hidden; z-index: 1000; font-family: Arial, sans-serif; animation: fadeScaleIn 0.3s ease; }
            .chat-box.hidden { animation: fadeScaleOut 0.3s ease; }
            .chat-box:hover { border: 1px solid #000; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4); transition: all 0.3s ease; }
            .chat-header { background-color: #0066cc; color: white; padding: 10px 15px; font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
            .chat-header span { flex-grow: 1; text-align: center; }
            .chat-icons { display: flex; align-items: center; }
            .chat-icons svg { width: 24px; height: 24px; margin-left: 10px; cursor: pointer; }
            .chat-content { flex: 1; padding: 15px; overflow-y: auto; background-color: #f9f9f9; }
            .chat-input-area { padding: 15px; border-top: 1px solid #ddd; }
            .chat-input-wrapper { position: relative; display: flex; align-items: center; }
            .chat-input { flex: 1; padding: 10px 40px 10px 10px; border: 1px solid #ccc; border-radius: 20px; outline: none; font-family: Arial, sans-serif; }
            .chat-input.error { border-color: red; }
            .chat-submit { position: absolute; right: 10px; width: 24px; height: 24px; opacity: 0.5; cursor: not-allowed; }
            .chat-submit.active { opacity: 1; cursor: pointer; }
            .chat-submit.disabled { opacity: 0.5; cursor: not-allowed; }
            .message { margin: 10px 0; padding: 10px 15px; border-radius: 10px; max-width: 70%; font-family: Arial, sans-serif; }
            .message.user { background-color: #0066cc; color: white; margin-left: auto; }
            .message.bot { background-color: #e9ecef; color: #333; }
            .message.typing::after { content: '...'; display: inline-block; width: 20px; animation: dots 1.5s infinite; }
            .footer { display: flex; justify-content: center; align-items: center; padding: 5px; font-size: 12px; color: #333; }
            .footer a { text-decoration: none; margin: 0 5px; }
            .footer .emandai, .footer .newit { color: #0066cc; }
        </style>
        <div class="chat-btn">
            <img src="https://storage.googleapis.com/system-prod/327391ed-bc6d-40c3-a750-5722f626e013.png" alt="Chat Icon">
        </div>
        <div class="chat-box" id="chatBox">
            <div class="chat-header">
                <span>ĐẠI SỨ QUÁN VIỆT NAM TẠI NHẬT BẢN</span>
                <div class="chat-icons">
                    <svg class="reload-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <svg class="minimize-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 12H18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
            </div>
            <div class="chat-content" id="chatContent">
                <div class="message bot">Xin chào! Tôi là nhân viên số hỗ trợ giải đáp thắc mắc các thủ tục lãnh sự. Tôi có thể giúp gì cho anh/chị?</div>
            </div>
            <div class="chat-input-area">
                <div class="chat-input-wrapper">
                    <input type="text" class="chat-input" placeholder="Nhập gì đó ở đây (tối đa 200 ký tự)..." onkeypress="if(event.key === 'Enter') sendMessage()" oninput="toggleSubmitButton()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="chat-submit" onclick="sendMessage()">
                        <g clip-path="url(#clip0_2893_52816)">
                            <path d="M3.4 20.3995L20.85 12.9195C21.66 12.5695 21.66 11.4295 20.85 11.0795L3.4 3.59953C2.74 3.30953 2.01 3.79953 2.01 4.50953L2 9.11953C2 9.61953 2.37 10.0495 2.87 10.1095L17 11.9995L2.87 13.8795C2.37 13.9495 2 14.3795 2 14.8795L2.01 19.4895C2.01 20.1995 2.74 20.6895 3.4 20.3995Z" fill="#353945"></path>
                        </g>
                        <defs><clipPath id="clip0_2893_52816"><rect width="24" height="24" fill="white"></rect></clipPath></defs>
                    </svg>
                </div>
                <div class="footer">
                    <span>Powered by</span><a href="https://emandai.net/en/" target="_blank" class="emandai">EM&AI</a>
                    <span>Provided by</span><a href="https://newit.co.jp/" target="_blank" class="newit">New IT</a>
                </div>
            </div>
        </div>
    `;

    // Thêm vào body và lưu DOM elements
    document.body.appendChild(chatContainer);
    elements.chatBox = document.getElementById('chatBox');
    elements.chatBtn = document.querySelector('.chat-btn');
    elements.chatContent = document.getElementById('chatContent');
    elements.input = document.querySelector('.chat-input');
    elements.submitBtn = document.querySelector('.chat-submit');
    elements.reloadBtn = document.querySelector('.reload-btn');
    elements.minimizeBtn = document.querySelector('.minimize-btn');
    elements.chatHeader = document.querySelector('.chat-header');

    // Danh sách câu trả lời
    const responses = {
        "xin visa lao động tại nhật": "Để xin visa lao động tại Nhật, bạn cần liên hệ công ty phái cử tại Việt Nam và chuẩn bị hồ sơ theo yêu cầu của Đại sứ quán. Hồ sơ thường bao gồm: giấy chứng nhận tư cách lưu trú (COE), hộ chiếu, ảnh, và hợp đồng lao động.",
        "lương công nhân tại nhật": "Lương trung bình của công nhân tại Nhật dao động từ 150,000 đến 250,000 yên/tháng, tùy thuộc vào ngành nghề, khu vực làm việc và kinh nghiệm.",
        "điều kiện làm việc tại nhật": "Công nhân tại Nhật thường làm việc 8 giờ/ngày, 5-6 ngày/tuần, được hưởng bảo hiểm xã hội, bảo hiểm y tế và hỗ trợ chỗ ở từ công ty.",
        "đổi hộ chiếu qua bưu điện": "Để cấp đổi hộ chiếu qua bưu điện, bạn cần gửi đơn xin cấp đổi, bản sao công chứng giấy tờ tùy thân, ảnh 4x6cm, và lệ phí đến Đại sứ quán Việt Nam tại Nhật Bản qua đường bưu điện. Thời gian xử lý khoảng 2-3 tuần.",
        "đăng ký kết hôn tại nhật": "Để đăng ký kết hôn tại Nhật, bạn cần nộp giấy chứng nhận độc thân (do Việt Nam cấp), hộ chiếu, giấy khai sinh và giấy đăng ký kết hôn tại cơ quan hành chính địa phương tại Nhật, sau đó hợp thức hóa tại Đại sứ quán.",
        "xin visa du lịch nhật": "Để xin visa du lịch Nhật Bản, bạn cần chuẩn bị hộ chiếu, đơn xin visa, ảnh 4.5x4.5cm, lịch trình chuyến đi, và chứng minh tài chính. Hồ sơ nộp tại Đại sứ quán hoặc Lãnh sự quán Nhật Bản tại Việt Nam.",
        "gia hạn visa tại nhật": "Để gia hạn visa tại Nhật, bạn cần nộp đơn gia hạn, hộ chiếu, thẻ ngoại kiều, và giấy tờ chứng minh lý do gia hạn (như hợp đồng lao động hoặc giấy nhập học) tại Cục Quản lý Xuất nhập cảnh Nhật Bản trước khi visa hết hạn.",
        "địa chỉ đại sứ quán": "Đại sứ quán Việt Nam tại Nhật Bản nằm tại: 50-11 Motoyoyogi-cho, Shibuya-ku, Tokyo 151-0062, Nhật Bản.",
        "liên hệ đại sứ quán": "Bạn có thể liên hệ Đại sứ quán Việt Nam tại Nhật Bản qua số điện thoại: +81-3-3466-3311 hoặc email: vnembassy-jp@mofa.gov.vn.",
        "thời gian làm việc đại sứ quán": "Đại sứ quán Việt Nam tại Nhật Bản làm việc từ thứ Hai đến thứ Sáu, 9:00-12:00 và 14:00-17:00, trừ các ngày lễ Việt Nam và Nhật Bản.",
        "default": "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến thủ tục lãnh sự, cấp đổi hộ chiếu qua đường bưu điện và các thông tin khác liên quan đến Đại sứ quán Việt Nam tại Nhật Bản. Nếu có câu hỏi nào trong phạm vi đó, tôi sẽ cố gắng hỗ trợ anh/chị!"
    };

    // Hàm chuẩn hóa chuỗi (xóa dấu)
    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    }

    // Hàm hiển thị tin nhắn từng chữ
    function typeMessage(text, className, callback) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        elements.chatContent.appendChild(messageDiv);
        let i = 0;

        function type() {
            if (i < text.length) {
                messageDiv.textContent += text.charAt(i);
                i++;
                elements.chatContent.scrollTop = elements.chatContent.scrollHeight;
                requestAnimationFrame(type);
            } else if (callback) {
                callback();
            }
        }
        requestAnimationFrame(type);
    }

    // Hàm toggle chat box
    function toggleChatBox() {
        if (!elements.chatBox || !elements.chatBtn) return;
        const isOpen = elements.chatBox.style.display === 'flex';
        elements.chatBox.classList.toggle('hidden', isOpen);
        setTimeout(() => {
            elements.chatBox.style.display = isOpen ? 'none' : 'flex';
            if (!isOpen) elements.chatBtn.classList.add('hidden');
            setTimeout(() => elements.chatBtn.style.display = isOpen ? 'block' : 'none', 300);
            if (isOpen) elements.chatBox.classList.remove('hidden');
        }, 300);
    }

    // Hàm thu nhỏ chat box
    function minimizeChatBox(event) {
        if (event) event.stopPropagation();
        if (!elements.chatBox || !elements.chatBtn) return;
        elements.chatBox.classList.add('hidden');
        setTimeout(() => {
            elements.chatBox.style.display = 'none';
            elements.chatBox.classList.remove('hidden');
            elements.chatBtn.style.display = 'block';
        }, 300);
    }

    // Hàm reload chat
    function reloadChat(event) {
        if (event) event.stopPropagation();
        if (!elements.chatContent) return;
        elements.chatContent.innerHTML = '';
        typeMessage("Xin chào! Tôi là nhân viên số hỗ trợ giải đáp thắc mắc các thủ tục lãnh sự. Tôi có thể giúp gì cho anh/chị?", "bot");
    }

    // Hàm bật/tắt nút submit
    function toggleSubmitButton() {
        if (!elements.input || !elements.submitBtn) return;
        const value = elements.input.value.trim();
        const isValid = value && value.length <= MAX_MESSAGE_LENGTH && !elements.submitBtn.classList.contains('disabled');
        elements.submitBtn.classList.toggle('active', isValid);
        elements.input.classList.toggle('error', value.length > MAX_MESSAGE_LENGTH);
    }

    // Hàm gửi tin nhắn
    function sendMessage() {
        if (!elements.input || !elements.submitBtn || !elements.submitBtn.classList.contains('active')) return;
        const message = elements.input.value.trim();
        if (message.length > MAX_MESSAGE_LENGTH) {
            typeMessage("Tin nhắn vượt quá 200 ký tự, vui lòng nhập ngắn hơn!", "bot");
            return;
        }

        const normalizedMessage = removeAccents(message.toLowerCase());
        elements.submitBtn.classList.add('disabled');
        elements.submitBtn.classList.remove('active');

        typeMessage(message, "user", () => {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot typing';
            typingDiv.textContent = '...';
            elements.chatContent.appendChild(typingDiv);
            elements.chatContent.scrollTop = elements.chatContent.scrollHeight;

            let reply = responses["default"];
            const keywords = {
                visa: [
                    { keys: ["lao dong", "lam viec"], response: "xin visa lao động tại nhật" },
                    { keys: ["du lich"], response: "xin visa du lịch nhật" },
                    { keys: ["gia han"], response: "gia hạn visa tại nhật" }
                ],
                "luong": [{ keys: ["cong nhan"], response: "lương công nhân tại nhật" }],
                "dieu kien": [{ keys: ["lam viec"], response: "điều kiện làm việc tại nhật" }],
                "doi ho chieu": [{ keys: ["buu dien"], response: "đổi hộ chiếu qua bưu điện" }],
                "dang ky": [{ keys: ["ket hon"], response: "đăng ký kết hôn tại nhật" }],
                "dia chi": [{ keys: ["dai su quan"], response: "địa chỉ đại sứ quán" }],
                "lien he": [{ keys: ["dai su quan"], response: "liên hệ đại sứ quán" }],
                "thoi gian": [{ keys: ["lam viec", "dai su quan"], response: "thời gian làm việc đại sứ quán" }]
            };

            for (const mainKey in keywords) {
                if (normalizedMessage.includes(mainKey)) {
                    const subKeywords = keywords[mainKey];
                    const match = subKeywords.find(sub => sub.keys.some(k => normalizedMessage.includes(k)));
                    if (match) {
                        reply = responses[match.response];
                        break;
                    } else if (mainKey === "visa") {
                        reply = "Bạn muốn hỏi về visa nào? Tôi có thể hỗ trợ về visa lao động, visa du lịch, hoặc gia hạn visa tại Nhật. Hãy cung cấp thêm thông tin nhé!";
                        break;
                    }
                }
            }

            if (reply === responses["default"]) {
                for (let key in responses) {
                    if (normalizedMessage.includes(removeAccents(key))) {
                        reply = responses[key];
                        break;
                    }
                }
            }

            setTimeout(() => {
                elements.chatContent.removeChild(typingDiv);
                typeMessage(reply, "bot", () => {
                    elements.submitBtn.classList.remove('disabled');
                    toggleSubmitButton();
                });
            }, 1500);
        });

        elements.input.value = '';
    }

    // Gắn sự kiện
    elements.chatBtn.addEventListener('click', toggleChatBox);
    elements.input.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    elements.input.addEventListener('input', toggleSubmitButton);
    elements.submitBtn.addEventListener('click', sendMessage);
    elements.reloadBtn.addEventListener('click', reloadChat);
    elements.minimizeBtn.addEventListener('click', minimizeChatBox);
    elements.chatHeader.addEventListener('click', minimizeChatBox); // Gắn sự kiện cho header
})();