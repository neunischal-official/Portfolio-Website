


let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');


menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    // disableScroll();
}

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
    // enableScroll();

}

// const typed = new Typed('.multiple-text', {
//     strings: ['an Electrical Engineer', 'a Web Developer', 'a Designer', 'a Tech Enthusiast'],
//     typeSpeed: 70,
//     backSpeed: 70,
//     backDelay: 1200,
//     loop: true,
// });

if (document.querySelector('.multiple-text') && window.Typed) {
    new Typed('.multiple-text', {
        strings: ['an Electrical Engineer', 'a Web Developer', 'a Designer', 'a Tech Enthusiast'],
        typeSpeed: 70,
        backSpeed: 70,
        backDelay: 1200,
        loop: true,
    });
}

let skillsAnimated = false;

function animateSkills() {
    document.querySelectorAll('.skill-box').forEach(box => {
        const percent = +box.dataset.percent;
        const circle = box.querySelector('circle.progress');
        const numberEl = box.querySelector('.number');
        const R = circle.r.baseVal.value;
        const C = 2 * Math.PI * R;
        const D = 2000; // ms

        // 0) reset the number to 0%
        numberEl.textContent = '0%';

        // 1) immediately snap the circle to “empty” (no transition)
        circle.style.transition = 'none';
        circle.style.strokeDasharray = `0 ${C}`;
        // force it to apply
        void circle.offsetWidth;

        // 2) *two* frames later, turn the transition back on and draw
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                circle.style.transition = `stroke-dasharray ${D}ms ease-out`;
                circle.style.strokeDasharray = `${(C * percent / 100)} ${C}`;
            });
        });

        // 3) animate the number in parallel (this bit you already have)
        let counter = 0;
        const step = Math.max(20, D / percent);
        const timer = setInterval(() => {
            numberEl.textContent = `${++counter}%`;
            if (counter >= percent) clearInterval(timer);
        }, step);
    });
}


// function reveal() {
//     // 1) “Reveal” all your .reveal elems exactly as before
//     const reveals = document.querySelectorAll('.reveal');
//     reveals.forEach(el => {
//         const top = el.getBoundingClientRect().top;
//         if (top < window.innerHeight - 50) el.classList.add('active');
//         else el.classList.remove('active');
//     });

function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        console.log('Element', el, 'top:', top);
        if (top < window.innerHeight - 50) {
            el.classList.add('active');
            console.log('→ revealed', el);
        } else {
            el.classList.remove('active');
        }
    });

    // 2) Grab the skills‐container and see if it’s currently “active”
    const skillsCont = document.querySelector('.skills-container');
    const isActive = skillsCont && skillsCont.classList.contains('active');

    // 3a) If it just became active (and wasn’t animated), fire the animation
    if (isActive && !skillsAnimated) {
        console.log('→ animating skills');
        animateSkills();
        skillsAnimated = true;
    }
    // 3b) If it’s gone out of view, clear the flag so it can re-trigger next time
    else if (!isActive && skillsAnimated) {
        console.log('→ skills left view; resetting flag');
        skillsAnimated = false;
    }
}

window.addEventListener('load', reveal);
window.addEventListener('scroll', reveal);





// 1) Modal Popup Logic
const body = document.body;
const docEl = document.documentElement;
const modalOverlay = document.getElementById('modal-overlay');
const modalBox = document.getElementById('modal-box');      // NEW
const modalMessage = document.getElementById('modal-message');
const modalOk = document.getElementById('modal-ok');

// added
const spinnerOverlay = document.getElementById('spinner-overlay');
const logoOverlay = document.getElementById('logo-loader');


function disableScroll() {
    body.classList.add('no-scroll');
    docEl.classList.add('no-scroll');
}
function enableScroll() {

    body.classList.remove('no-scroll');
    docEl.classList.remove('no-scroll');
}


function showModal(msg) {
    modalMessage.textContent = msg;
    modalOverlay.style.display = 'flex';
    // trigger the CSS animation
    requestAnimationFrame(() => {
        modalBox.classList.add('show');
    });
    modalOk.focus();
    disableScroll();  // lock scroll while modal is open
}

function hideModal() {
    // reverse the animation
    modalBox.classList.remove('show');
    // wait for the transition to finish before hiding overlay
    modalBox.addEventListener('transitionend', function _h() {
        modalOverlay.style.display = 'none';
        modalBox.removeEventListener('transitionend', _h);
        enableScroll();  // re-enable scroll once modal is fully hidden
    });
}

modalOk.addEventListener('click', hideModal);
document.addEventListener('keydown', () => {
    if (modalOverlay.style.display === 'flex') hideModal();
});



// 3) Contact Form Submission (modified)
const form = document.getElementById('contact-form');
form.addEventListener('submit', async e => {
    e.preventDefault();

    // grab inputs
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // basic validation
    if (!name || !email || !phone || !subject || !message) {
        showModal('Please fill out all details');
        return;
    }

    // spinnerOverlay.style.display = 'flex';
    logoOverlay.style.display = 'flex';
    disableScroll();

    const formData = { name, email, phone, subject, message };
    const apiUrl = 'http://localhost:5000/api/contact';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showModal('Message Sent Successfully!');
            form.reset();
        } else {
            const error = await response.json();
            showModal(`Failed to send the message: ${error.message || 'Unknown error'}`);
        }
    } catch (err) {
        showModal(`An Error Occurred!`);
        // showModal(`An error occurred: ${err.message}`);
        // showModal(`An error occurred: ${err.message}`);
    }

    finally {
        // Hide spinner whether success or failure—after modal is shown
        // spinnerOverlay.style.display = 'none';
        logoOverlay.style.display = 'none';
    }

});


// logo read more


const logoLoader = document.getElementById('logo-loader');
const readMoreLinks = document.querySelectorAll('.projects a.btn');
const loaderDuration = 4000; // 6 seconds

readMoreLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();

        // reset display and restart animation
        logoLoader.style.display = 'flex';
        const logo = logoLoader.querySelector('.loader-logo');
        // restart CSS animation
        logo.style.animation = 'none';
        void logo.offsetWidth;
        logo.style.animation = 'fadeInOut 2s ease-in-out 0s infinite';

        // Wait for the CSS animation duration (1.2s) + small buffer
        setTimeout(() => {
            window.location.href = link.href;
        }, loaderDuration);
    });
});


// Hide overlay initially
document.addEventListener('DOMContentLoaded', () => {
    logoLoader.style.display = 'none';
});



