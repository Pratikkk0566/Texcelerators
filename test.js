class AnimatedTestimonials {
    constructor(testimonials, options = {}) {
        this.testimonials = testimonials;
        this.autoplay = options.autoplay || false;
        this.autoplayInterval = options.autoplayInterval || 5000;
        this.activeIndex = 0;
        this.autoplayTimer = null;
        
        this.init();
    }

    init() {
        this.createImages();
        this.updateContent();
        this.bindEvents();
        
        if (this.autoplay) {
            this.startAutoplay();
        }
    }

    createImages() {
        const container = document.getElementById('imagesContainer');
        container.innerHTML = '';

        this.testimonials.forEach((testimonial, index) => {
            const img = document.createElement('img');
            img.src = testimonial.src;
            img.alt = testimonial.name;
            img.className = `testimonial-image ${index === 0 ? 'active' : ''}`;
            img.draggable = false;
            img.style.zIndex = index === 0 ? 40 : this.testimonials.length + 2 - index;
            img.style.transform = index === 0 ? 'scale(1) rotateY(0deg)' : `scale(0.95) rotateY(${this.randomRotateY()}deg)`;
            
            container.appendChild(img);
        });
    }

    randomRotateY() {
        return Math.floor(Math.random() * 21) - 10;
    }

    updateContent() {
        const contentWrapper = document.getElementById('contentWrapper');
        const nameEl = document.getElementById('testimonialName');
        const designationEl = document.getElementById('testimonialDesignation');
        const quoteEl = document.getElementById('testimonialQuote');

        const currentTestimonial = this.testimonials[this.activeIndex];

        // Fade out content
        contentWrapper.classList.remove('active');

        setTimeout(() => {
            nameEl.textContent = currentTestimonial.name;
            designationEl.textContent = currentTestimonial.designation;
            
            // Animate quote words
            this.animateQuoteWords(quoteEl, currentTestimonial.quote);
            
            // Fade in content
            contentWrapper.classList.add('active');
        }, 100);
    }

    animateQuoteWords(element, quote) {
        const words = quote.split(' ');
        element.innerHTML = '';

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'quote-word';
            span.textContent = word + ' ';
            span.style.animationDelay = `${0.02 * index}s`;
            element.appendChild(span);
        });
    }

    updateImages() {
        const images = document.querySelectorAll('.testimonial-image');
        
        images.forEach((img, index) => {
            img.classList.remove('active', 'entering');
            
            if (index === this.activeIndex) {
                img.classList.add('active', 'entering');
                img.style.zIndex = 40;
                img.style.opacity = '1';
                img.style.transform = 'scale(1) rotateY(0deg)';
            } else {
                img.style.zIndex = this.testimonials.length + 2 - index;
                img.style.opacity = '0.7';
                img.style.transform = `scale(0.95) rotateY(${this.randomRotateY()}deg)`;
            }
        });
    }

    handleNext() {
        this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
        this.updateImages();
        this.updateContent();
        this.restartAutoplay();
    }

    handlePrev() {
        this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.updateImages();
        this.updateContent();
        this.restartAutoplay();
    }

    startAutoplay() {
        if (this.autoplay) {
            this.autoplayTimer = setInterval(() => {
                this.handleNext();
            }, this.autoplayInterval);
        }
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    restartAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    bindEvents() {
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');

        prevButton.addEventListener('click', () => this.handlePrev());
        nextButton.addEventListener('click', () => this.handleNext());

        // Pause autoplay on hover
        const container = document.querySelector('.testimonials-container');
        container.addEventListener('mouseenter', () => this.stopAutoplay());
        container.addEventListener('mouseleave', () => this.startAutoplay());
    }
}

// Sample testimonials data
const testimonials = [
    {
        quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
        name: "Sarah Chen",
        designation: "Product Manager at TechFlow",
        src: "Assets/images/HomePage/Testimonials/Faculty/FrPaul.jpg"
    },
    {
        quote: "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
        name: "Michael Rodriguez",
        designation: "CTO at InnovateSphere",
        src: "Assets/images/HomePage/Testimonials/Faculty/FrSiju.JPG"
    },
    {
        quote: "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
        name: "Emily Watson",
        designation: "Operations Director at CloudScale",
        src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        quote: "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
        name: "James Kim",
        designation: "Engineering Lead at DataPro",
        src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        quote: "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
        name: "Lisa Thompson",
        designation: "VP of Technology at FutureNet",
        src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

// Initialize the testimonials component
document.addEventListener('DOMContentLoaded', () => {
    new AnimatedTestimonials(testimonials, {
        autoplay: true, // Set to false to disable autoplay
        autoplayInterval: 5000 // 5 seconds
    });
});