document.addEventListener('DOMContentLoaded', () => {
    const TYPE_WORDS = ["a Student Pursuing Web Development", "and Trying to Study Cybersec"];
    const TYPE_WAIT = 2000;

    const txtElement = document.querySelector('.txt-type');

    class TypeWriter {
        constructor(el, words, wait) {
            this.txtElement = el;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            if(this.txtElement) this.txtElement.innerHTML = `<span class="txt-cursor">${this.txt}</span>`;

            let typeSpeed = 100;
            if (this.isDeleting) typeSpeed /= 2;

            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 500;
            }
            setTimeout(() => this.type(), typeSpeed);
        }
    }
    if(txtElement) new TypeWriter(txtElement, TYPE_WORDS, TYPE_WAIT);

    const canvas = document.getElementById('neuroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];
        let mouse = { x: null, y: null, radius: (canvas.height / 80) * (canvas.width / 80) };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
            init();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y;
                this.directionX = directionX; this.directionY = directionY;
                this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#00f3ff';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 10;
                    if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 10;
                    if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 11000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 1) - 0.5;
                let directionY = (Math.random() * 1) - 0.5;
                let color = '#00f3ff';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        ctx.strokeStyle = 'rgba(0, 243, 255,' + (1 - (distance / 20000)) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }
        init();
        animate();
    }

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cards = document.querySelectorAll('.tilt-card');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            if(cursorDot) {
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
            }
            if(cursorOutline) {
                cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
            }
        });

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xRotation = -1 * ((y - rect.height / 2) / 30);
                const yRotation = (x - rect.width / 2) / 30;
                card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    const sanitizeInput = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    const contactForm = document.getElementById('secureContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusMsg = document.getElementById('formStatus');
            const cleanName = sanitizeInput(document.getElementById('name').value);

            if(cleanName.length < 2) {
                statusMsg.textContent = "Error: Invalid Input";
                statusMsg.style.color = "#ff3333";
                return;
            }

            statusMsg.textContent = `Transmission secure. Received, ${cleanName}.`;
            statusMsg.style.color = "#00f3ff";
            contactForm.reset();
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    });
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    const visionBtn = document.getElementById('vision-btn');
    const futureVision = document.getElementById('future-vision');
    if (visionBtn && futureVision) {
        visionBtn.addEventListener('click', () => {
            futureVision.classList.toggle('show');
        });
    }

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if(burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }
});
