/* 
    Mr Cold Mail - Funnel Script 
    Handles: Modals, Order Flow, RupantorPay Integration, Review System, Timer
*/

// Configuration
const API_KEY = "W3nKbuIhpquY2JxJMOTi9UTOq5b1zrYbRN5Quk3xBM90dpPACT"; // User API Key
const SUCCESS_URL = window.location.origin + "/pages/success.html";
const FAIL_URL = window.location.origin + "/pages/fail.html";
const CANCEL_URL = window.location.origin + "/pages/cancel.html";

let currentOrder = {
    name: "",
    phone: "",
    amount: 249,
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
    
    // Trigger Upsell Popup
    closeCheckout();
    document.getElementById('upsellModal').classList.remove('hidden');
});

// 3. Upsell / Downsell Logic
function addToOrder() {
    currentOrder.amount = 249 + 149;
    currentOrder.items.push("500+ Extra Viral AI VIDEO + Canva Templates");
    initiatePayment();
}

function showDownsell() {
    document.getElementById('upsellModal').classList.add('hidden');
    document.getElementById('downsellModal').classList.remove('hidden');
}

function applyDownsell() {
    currentOrder.amount = 199;
    currentOrder.items = ["Special Offer: Main Bundle Only"];
    initiatePayment();
}

function proceedToPaymentAt(amt) {
    currentOrder.amount = amt;
    initiatePayment();
}

// 4. RupantorPay Payment Integration
function initiatePayment() {
    console.log("Initiating payment for:", currentOrder);
    
    // In a real production environment, you should ideally do this on a backend
    // but here we provide the frontend implementation structure for RupantorPay.
    
    const transactionId = 'TXN_' + Date.now();
    
    // Build the request body for RupantorPay
    const paymentData = {
        api_key: API_KEY,
        amount: currentOrder.amount,
        customer_name: currentOrder.name,
        customer_phone: currentOrder.phone,
        transaction_id: transactionId,
        success_url: SUCCESS_URL,
        fail_url: FAIL_URL,
        cancel_url: CANCEL_URL,
        metadata: JSON.stringify(currentOrder.items)
    };

    // Note: To avoid CORS issues or revealing API keys, this is usually handled via server-side redirect or a form submission.
    // Creating a dynamic form and submitting it is a common way for payment gateways.
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://payment.rupantorpay.com/api/payment/checkout';

    for (const key in paymentData) {
        if (paymentData.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = paymentData[key];
            form.appendChild(hiddenField);
        }
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
