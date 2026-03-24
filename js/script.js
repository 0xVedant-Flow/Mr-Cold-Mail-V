/* 
    Mr Cold Mail - Funnel Script 
    Handles: Modals, Order Flow, RupantorPay Integration, Review System, Timer
*/

// Configuration
const API_KEY = "i9tXBNxUC2b1TqhO208jB9MP2ImgiDaNRlG55buta7AbVvVtGM"; // User API Key
const PAYMENT_LINK = "https://rupantorpay.com/paymentlink/eyJ1aWQiOiIyMjQ3IiwiYnJhbmRfaWQiOiIxMzQ0IiwiY3VzdG9tZXJfYW1vdW50IjoiMTk5In0";
const SUCCESS_URL = window.location.origin + "/pages/success.html";
const FAIL_URL = window.location.origin + "/pages/fail.html";
const CANCEL_URL = window.location.origin + "/pages/cancel.html";

let currentOrder = {
    name: "",
    phone: "",
    amount: 199,
    items: ["Viral AI VIDEO Reels Mega Bundle"]
};

// 1. Modal Logic
function openCheckout() {
    document.getElementById('checkoutModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 2. Checkout Form Submission
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    currentOrder.name = document.getElementById('custName').value;
    currentOrder.phone = document.getElementById('custPhone').value;
    
    // Direct Payment (Bypassing Upsell/Downsell)
    closeCheckout();
    initiatePayment();
});

// 3. Upsell / Downsell Logic
function addToOrder() {
    currentOrder.amount = 199 + 149;
    currentOrder.items.push("500+ Extra Viral AI VIDEO + Canva Templates");
    initiatePayment();
}

function showDownsell() {
    document.getElementById('upsellModal').classList.add('hidden');
    document.getElementById('downsellModal').classList.remove('hidden');
}

function applyDownsell() {
    currentOrder.amount = 149;
    currentOrder.items = ["Special Offer: Main Bundle Only"];
    initiatePayment();
}

function proceedToPaymentAt(amt) {
    currentOrder.amount = amt;
    initiatePayment();
}

// 4. RupantorPay Payment Integration
async function initiatePayment() {
    console.log("Initiating payment for:", currentOrder);
    
    // Use Static Payment Link for ৳199 bundle for reliability
    if (currentOrder.amount === 199 && typeof PAYMENT_LINK !== 'undefined') {
        window.location.href = PAYMENT_LINK;
        return;
    }
    
    // In a real production environment, you should ideally do this on a backend
    // to keep your API Key secure. This client-side fetch is for demonstration and
    // will work if the provider supports CORS.
    
    const transactionId = 'TXN_' + Date.now();
    
    try {
        const response = await fetch('https://payment.rupantorpay.com/api/payment/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY, // The W3nK... key goes here
                'X-CLIENT': 'mrcoldmail.netlify.app'
            },
            body: JSON.stringify({
                amount: currentOrder.amount.toString(),
                customer_name: currentOrder.name,
                customer_phone: currentOrder.phone,
                customer_email: "iswgtm@gmail.com",
                transaction_id: transactionId,
                success_url: SUCCESS_URL,
                fail_url: FAIL_URL,
                cancel_url: CANCEL_URL,
                metadata: JSON.stringify(currentOrder.items),
                desc: "2400+ Viral AI VIDEO Reels Mega Bundle"
            })
        });

        const data = await response.json();
        
        if (data.status === 'success' || data.payment_url) {
            window.location.href = data.payment_url;
        } else {
            console.error("Payment initiation failed:", data);
            alert("পেমেন্ট শুরু করতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন বা ওয়াটসঅ্যাপে যোগাযোগ করুন।");
            // Fallback: If JSON API fails, try direct form submit as backup
            fallbackFormSubmit(transactionId);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        fallbackFormSubmit(transactionId);
    }
}

// Fallback method using standard Form POST if Fetch/CORS fails
function fallbackFormSubmit(transactionId) {
    const paymentData = {
        api_key: API_KEY,
        amount: currentOrder.amount,
        customer_name: currentOrder.name,
        customer_phone: currentOrder.phone,
        customer_email: "iswgtm@gmail.com",
        transaction_id: transactionId,
        success_url: SUCCESS_URL,
        fail_url: FAIL_URL,
        cancel_url: CANCEL_URL,
        desc: "2400+ Viral AI VIDEO Reels Mega Bundle"
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://payment.rupantorpay.com/api/payment/checkout';

    for (const key in paymentData) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = paymentData[key];
        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
}

// 5. User Review System (localStorage)
const reviewForm = document.getElementById('reviewForm');
const dynamicReviews = document.getElementById('dynamicReviews');

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('mrcm_reviews')) || [];
    dynamicReviews.innerHTML = '';
    
    reviews.reverse().forEach(rev => {
        const stars = '⭐'.repeat(rev.rating);
        const div = document.createElement('div');
        div.className = 'glass-card p-6 border-white/5 opacity-80';
        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="font-bold text-slate-200">${rev.name}</span>
                <span class="text-xs text-yellow-400">${stars}</span>
            </div>
            <p class="text-slate-400 text-sm italic">"${rev.comment}"</p>
        `;
        dynamicReviews.appendChild(div);
    });
}

if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newRev = {
            name: document.getElementById('revName').value,
            rating: parseInt(document.getElementById('revRating').value),
            comment: document.getElementById('revComment').value,
            date: new Date().toISOString()
        };
        
        const reviews = JSON.parse(localStorage.getItem('mrcm_reviews')) || [];
        reviews.push(newRev);
        localStorage.setItem('mrcm_reviews', JSON.stringify(reviews));
        
        loadReviews();
        reviewForm.reset();
        alert('আপনার রিভিউ যোগ করা হয়েছে! ধন্যবাদ।');
    });
}

// 6. Countdown Timer
function startTimer(durationInSeconds) {
    let timer = durationInSeconds;
    setInterval(function () {
        let hours = parseInt(timer / 3600, 10);
        let minutes = parseInt((timer % 3600) / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if(document.getElementById('hours')) document.getElementById('hours').textContent = hours;
        if(document.getElementById('minutes')) document.getElementById('minutes').textContent = minutes;
        if(document.getElementById('seconds')) document.getElementById('seconds').textContent = seconds;

        if (--timer < 0) {
            timer = 59; // Reset for demo purposes
        }
    }, 1000);
}

// 7. Sticky Buy Button Visibility
window.addEventListener('scroll', function() {
    const stickyBuy = document.getElementById('stickyBuy');
    if (window.scrollY > 800) {
        stickyBuy.classList.add('show');
    } else {
        stickyBuy.classList.remove('show');
    }
});

// 8. FAQ Toggle
function toggleFaq(el) {
    const content = el.querySelector('div');
    const icon = el.querySelector('i');
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// Initialize
window.onload = function() {
    startTimer(2800); // ~46 mins default
    loadReviews();
};
