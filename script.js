// قائمة الكلمات العربية
const wordList = [
    "سفينة", "مدينة", "صحيفة", "جزيرة", "غريبة",
    "طاولة", "نافذة", "مكتبة", "دقيقة", "فاكهة",
    "خزينة", "وسادة", "شرارة", "كتابة", "عجينة",
    "مصورة", "خسارة", "كتيبة", "بطاقة", "مساحة",
    "محفظة", "وظيفة", "قريبة", "مغفرة", "مدرسة",
    "معركة", "مطبعة", "قبيلة", "فضيلة", "رفيقة",
    "وسيلة", "كرامة", "مريضة", "مسيرة", "حصيرة",
    "خزانة", "حديقة", "مطيرة", "فريدة", "كريمة",
    "سعيدة", "نظيفة", "عريقة", "هداية", "ثمينة",
    "سحابة", "لطيفة", "عجائز", "نجيبة", "خفيفة"
];

// المتغيرات العامة
const WORD_LENGTH = 5;
let solution = "";
let attempts = 0;
let currentGuess = "";
let gamesPlayedCount = 0;
const SHOW_INTERSTITIAL_AFTER = 3; // عرض إعلان كامل الشاشة بعد كل 3 ألعاب

// العناصر في الصفحة
const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");
const newGameButton = document.getElementById("newGameButton");

// بدء لعبة جديدة
function startNewGame() {
    gamesPlayedCount++;
    
    // عرض إعلان كامل الشاشة بعد عدد معين من الألعاب
    if (gamesPlayedCount % SHOW_INTERSTITIAL_AFTER === 0) {
        showInterstitialAd();
    }
    
    // اختيار كلمة عشوائية
    solution = wordList[Math.floor(Math.random() * wordList.length)];
    console.log("الكلمة المختارة:", solution); // للتجربة فقط
    
    // إعادة تعيين المتغيرات
    attempts = 0;
    currentGuess = "";
    
    // إعادة إنشاء لوحة اللعبة
    gameBoard.innerHTML = "";
    
    // إنشاء 6 صفوف
    for (let row = 0; row < 6; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "game-row";
        
        // إنشاء 5 خانات في كل صف
        for (let col = 0; col < WORD_LENGTH; col++) {
            const cell = document.createElement("div");
            cell.className = "game-cell";
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            rowDiv.appendChild(cell);
        }
        
        gameBoard.appendChild(rowDiv);
    }
    
    message.textContent = "";
    
    // إعادة تفعيل مستمع لوحة المفاتيح
    document.removeEventListener("keydown", handleKeyPress);
    document.addEventListener("keydown", handleKeyPress);
}

// تحقق من التخمين
function checkGuess(guess) {
    if (guess.length !== WORD_LENGTH) {
        message.textContent = "يجب أن تكون الكلمة مكونة من 5 أحرف!";
        return false;
    }
    if (attempts >= 6) {
        message.textContent = "لقد انتهت محاولاتك!";
        return false;
    }
    return true;
}

// تحديث لوحة اللعبة
function updateBoard(guess) {
    const currentRow = gameBoard.children[attempts];
    const cells = currentRow.children;
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = cells[i];
        cell.textContent = guess[i];
        
        // إزالة الأنماط السابقة
        cell.classList.remove('correct', 'present', 'absent', 'filled');
        
        if (guess[i] === solution[i]) {
            cell.classList.add('correct');
        } else if (solution.includes(guess[i])) {
            cell.classList.add('present');
        } else {
            cell.classList.add('absent');
        }
    }
    attempts++;
}

// تحديث عرض التخمين الحالي
function updateInputDisplay() {
    if (attempts >= 6) return;
    
    const currentRow = gameBoard.children[attempts];
    const cells = currentRow.children;
    
    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = cells[i];
        cell.textContent = currentGuess[i] || "";
        cell.className = "game-cell" + (currentGuess[i] ? " filled" : "");
    }
}

// معالجة ضغطات المفاتيح
function handleKeyPress(event) {
    if (attempts >= 6) return;

    const key = event.key;

    if (key === "Enter") {
        if (currentGuess.length === WORD_LENGTH) {
            if (!checkGuess(currentGuess)) return;

            updateBoard(currentGuess);

            if (currentGuess === solution) {
                message.textContent = "تهانينا! لقد فزت!";
                document.removeEventListener("keydown", handleKeyPress);
            } else if (attempts === 6) {
                message.textContent = `انتهت اللعبة! الكلمة هي: ${solution}`;
                document.removeEventListener("keydown", handleKeyPress);
            }

            currentGuess = "";
        } else {
            message.textContent = "أدخل 5 أحرف قبل الضغط على Enter!";
        }
    } else if (key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateInputDisplay();
        message.textContent = "";
    } else if (/^[ء-يa-zA-Z]$/.test(key)) {
        if (currentGuess.length < WORD_LENGTH) {
            currentGuess += key;
            updateInputDisplay();
            message.textContent = "";
        }
    }
}

// إدارة الإعلانات
function showInterstitialAd() {
    const adOverlay = document.createElement('div');
    adOverlay.className = 'ad-overlay';
    document.body.appendChild(adOverlay);
    
    const interstitialAd = document.getElementById('interstitialAd');
    if (interstitialAd) {
        adOverlay.style.display = 'block';
        interstitialAd.style.display = 'block';
        
        // تحميل الإعلان
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('خطأ في تحميل الإعلان:', e);
        }
        
        // إغلاق الإعلان بعد 10 ثواني
        setTimeout(() => {
            hideInterstitialAd();
        }, 10000);
    }
}

function hideInterstitialAd() {
    const adOverlay = document.querySelector('.ad-overlay');
    const interstitialAd = document.getElementById('interstitialAd');
    
    if (adOverlay) {
        adOverlay.style.display = 'none';
    }
    if (interstitialAd) {
        interstitialAd.style.display = 'none';
    }
}

// إضافة مستمعي الأحداث لأزرار لوحة المفاتيح الافتراضية
document.querySelectorAll('.key').forEach(button => {
    button.addEventListener('click', function() {
        const key = this.getAttribute('data-key');
        if (key === 'Enter') {
            handleKeyPress({ key: 'Enter' });
        } else if (key === 'Backspace') {
            handleKeyPress({ key: 'Backspace' });
        } else {
            handleKeyPress({ key: key });
        }
    });
});

// إضافة مستمع الأحداث لزر اللعبة الجديدة
newGameButton.addEventListener("click", startNewGame);

// بدء اللعبة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    startNewGame();
});
