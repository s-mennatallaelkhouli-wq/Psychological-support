// مكتبة الجمل
const quotes = [
    "أنت أقوى مما تعتقد.",
    "كل يوم فرصة جديدة.",
    "لا تستسلم، فالعقبة هي بداية الطريق.",
    "كن التغيير الذي تريد رؤيته في العالم.",
    "السعادة قرار يتخذه القلب.",
    "التقدم لا يكون دائماً للأسرع، بل لأول من لا يتوقف.",
    "القوة الحقيقية تأتي من الداخل.",
    "اضحك، فالحياة أقصر من أن نبكي عليها.",
    "انظر دائماً إلى الجانب المشرق.",
    "لا تقارن نفسك بالآخرين، لكلٍ طريقه.",
];

// الحصول على جملة اليوم بحسب التاريخ
function getDailyQuote() {
    const today = new Date().toISOString().split('T')[0];
    const list = quotes;

    const stored = localStorage.getItem('dailyQuoteDate');
    if (stored === today && localStorage.getItem('dailyQuoteText')) {
        return localStorage.getItem('dailyQuoteText');
    }

    const index = (new Date(today).getDate() + new Date(today).getMonth()) % list.length;
    const quote = list[index];
    localStorage.setItem('dailyQuoteDate', today);
    localStorage.setItem('dailyQuoteText', quote);
    return quote;
}

// تعرض الجملة
function showDailyQuote({ countView = true } = {}) {
    const el = document.getElementById('daily-quote');
    if (!el) return;
    el.textContent = getDailyQuote();
    if (countView) incrementStat('views');
}

// جملة عشوائية
function randomQuote() {
    const rand = quotes[Math.floor(Math.random() * quotes.length)];
    const el = document.getElementById('daily-quote');
    if (el) el.textContent = rand;
}

// الميزة الخاصة بالمشاركة حذفناها لتبسيط الواجهة

// حفظ الإحصائيات في localStorage
function incrementStat(key) {
    let stats = JSON.parse(localStorage.getItem('stats') || '{}');
    stats[key] = (stats[key] || 0) + 1;
    localStorage.setItem('stats', JSON.stringify(stats));
    updateStatsDisplay();
}

// عرض المقالات بناءً على الدورة الشهرية
function rotateMonthlyArticles() {
    const articles = Array.from(document.querySelectorAll('.detailed-article'));
    if (!articles.length) return;

    const cycleCount = 4; // عدد المجموعات التي تتغير كل شهر
    const month = new Date().getMonth(); // 0 = يناير
    const currentCycle = month % cycleCount;

    articles.forEach((article, index) => {
        const articleCycle = index % cycleCount;
        article.style.display = articleCycle === currentCycle ? '' : 'none';
    });
}

// جدول تحديث الجملة اليومية وتدوير المقالات تلقائياً عند منتصف الليل
function scheduleDailyQuoteUpdate() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 5, 0); // بعد منتصف الليل بخمس ثوانٍ
    const msUntilMidnight = tomorrow - now;

    setTimeout(() => {
        showDailyQuote({ countView: false });
        rotateMonthlyArticles();
        scheduleDailyQuoteUpdate();
    }, msUntilMidnight);
}


// تحميل الجملة اليومية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    showDailyQuote();
    rotateMonthlyArticles();
    scheduleDailyQuoteUpdate();

    // existing setup
    updateStatsDisplay();
    // جملة اليوم تعمل تلقائياً في الخلفية
    getDailyQuote();
    updateCounters();
    showAllQuotes();
});





function updateStatsDisplay() {
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    document.getElementById('views').textContent = 'شاهدت: ' + (stats.views || 0);
    // تمت إزالة عداد المشاركات
}

// صفحة "جميع الجمل"
function showAllQuotes() {
    const list = document.getElementById('quote-list');
    if (!list) return;
    const allQuotes = quotes;
    const last = allQuotes.slice(-30).reverse();
    last.forEach(q => {
        const li = document.createElement('li');
        li.textContent = q;
        list.appendChild(li);
    });
}

// ربط التقييم بالنجوم (تم إزالة عنصر التقييم من الصفحة)
// const stars = document.getElementById('stars');
// stars?.addEventListener('change', () => {
//     localStorage.setItem('rating', stars.value);
// });

// معالجة صفحة الاستشارة المجهولة
function submitVent() {
    const text = document.getElementById('anon-text').value.trim();
    if (!text) {
        alert('يرجى كتابة رسالتك قبل الإرسال');
        return;
    }
    // حفظ الاستشارة محلياً
    let vents = JSON.parse(localStorage.getItem('vents') || '[]');
    vents.push({
        text: text,
        date: new Date().toLocaleString('ar-SA'),
        mood: document.getElementById('mood-select')?.value || 'unknown'
    });
    localStorage.setItem('vents', JSON.stringify(vents));
    
    // تحديث العداد
    let stats = JSON.parse(localStorage.getItem('stats') || '{}');
    stats.vents = (stats.vents || 0) + 1;
    localStorage.setItem('stats', JSON.stringify(stats));
    
    // عرض رسالة تأكيد
    const responseEl = document.getElementById('vent-response');
    responseEl.textContent = 'شكراً لك! تم حفظ استشارتك. فريقنا سيرد عليك قريباً بكل الدعم والمساعدة.';
    responseEl.classList.add('show');
    
    // مسح النموذج
    document.getElementById('anon-text').value = '';
    document.getElementById('mood-select').value = '';
    
    // إخفاء الرسالة بعد 5 ثوانٍ
    setTimeout(() => {
        responseEl.classList.remove('show');
    }, 5000);
    
    // تحديث عداد الاستشارات
    updateCounters();
}

// نظام تسجيل الدخول والتسجيل
function registerUser() {
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
    const name = document.getElementById('reg-name').value.trim();
    
    if (!email || !password || !name || !confirmPassword) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('كلمات المرور غير متطابقة');
        return;
    }
    
    if (password.length < 6) {
        alert('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
        return;
    }
    
    // التحقق من وجود البريد الإلكتروني
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('هذا البريد الإلكتروني مسجل بالفعل');
        return;
    }
    
    // إضافة مستخدم جديد
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // يجب تشفيره في التطبيق الحقيقي
        registeredAt: new Date().toLocaleString('ar-SA'),
        preferences: {}
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // تسجيل الدخول التلقائي
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    alert('مرحباً ' + name + '! تم إنشاء حسابك بنجاح');
    window.location.href = 'dashboard.html';
}

function loginUser() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    if (!email || !password) {
        alert('يرجى ملء البريد الإلكتروني وكلمة المرور');
        return;
    }
    
    // البحث عن المستخدم
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return;
    }
    
    // تسجيل الدخول
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('أهلاً وسهلاً ' + user.name);
    window.location.href = 'dashboard.html';
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    alert('تم تسجيل الخروج بنجاح');
    window.location.href = 'index.html';
}

function checkLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        return JSON.parse(currentUser);
    }
    return null; // No login required
}

// تسجيل المزاج اليومي
function recordMood(mood) {
    let moods = JSON.parse(localStorage.getItem('moods') || '{}');
    moods[mood] = (moods[mood] || 0) + 1;
    localStorage.setItem('moods', JSON.stringify(moods));
    alert('شكراً لك! تم حفظ مزاجك: ' + mood);
}







function updateCounters() {
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    const visitorsEl = document.getElementById('visitors-count');
    const usersEl = document.getElementById('users-count');
    
    if (visitorsEl) {
        let visitors = parseInt(localStorage.getItem('visitors') || 0) + 1;
        localStorage.setItem('visitors', visitors);
        visitorsEl.textContent = 'الزوار: ' + visitors;
    }
    
    if (usersEl) {
        let users = JSON.parse(localStorage.getItem('users') || '[]').length;
        usersEl.textContent = 'المستخدمون: ' + users;
    }
}

// attach handler on DOM
// تم دمج DOMContentLoaded في الأعلى

