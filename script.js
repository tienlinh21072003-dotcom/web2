// Smooth scrolling cho navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero carousel functionality
let currentSlide = 0;
const indicators = document.querySelectorAll('.indicator');
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');
const ctaButton = document.querySelector('.cta-button');

const heroContent = [
    {
        title: "DIVA NAILS AND SPA",
        subtitle: "Premium nail salon in Nitro, WV - Professional service, high-quality products",
        button: "BOOK NOW"
    },
    {
        title: "CREATIVE NAIL ART",
        subtitle: "Unique nail designs customized to your personal style",
        button: "VIEW DESIGNS"
    },
    {
        title: "PERFECT NAIL CARE",
        subtitle: "Comprehensive nail treatment with premium imported products",
        button: "BOOK NOW"
    }
];

function updateHeroContent(index) {
    if (heroTitle) heroTitle.textContent = heroContent[index].title;
    if (heroSubtitle) heroSubtitle.textContent = heroContent[index].subtitle;
    if (ctaButton) ctaButton.textContent = heroContent[index].button;
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

// Auto-rotate hero content
setInterval(() => {
    currentSlide = (currentSlide + 1) % heroContent.length;
    updateHeroContent(currentSlide);
}, 5000);

// Manual indicator clicks
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        updateHeroContent(currentSlide);
    });
});

// Cart functionality
let cart = [];
const cartCountElement = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItemsContainer = document.querySelector('.cart-items');
const totalAmountElement = document.querySelector('.total-amount');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.close-cart');

// Add to cart functionality
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPriceText = productCard.querySelector('.product-price').textContent;
        const productPrice = parseInt(productPriceText.replace(/\D/g, ''));
        const productImage = productCard.querySelector('.product-image img').src;
        
        // Check if product already in cart
        const existingProduct = cart.find(item => item.name === productName);
        
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Add animation effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Show success message
        showNotification('Service added to cart!');
    });
});

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Cart is empty</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}đ</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-qty" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase-qty" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Add event listeners for quantity buttons
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity++;
                updateCart();
            });
        });
        
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
                showNotification('Service removed from cart');
            });
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmountElement.textContent = formatPrice(total) + 'đ';
}

// Format price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Open cart
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Cart icon click
if (cartIcon) {
    cartIcon.addEventListener('click', openCart);
}

// Close cart button
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
}

// Overlay click
if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}

// Initialize cart
updateCart();

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #00d4ff, #5b21b6);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.trim();
        if (searchTerm) {
            showNotification(`Searching: "${searchTerm}"`);
            // Here you would implement actual search functionality
        }
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .collection-card, .contact-card').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    
    if (heroLeft && heroRight) {
        heroLeft.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroRight.style.transform = `translateY(${scrolled * -0.3}px)`;
    }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    
    console.log('Hamburger menu element:', hamburgerMenu);
    console.log('Nav menu element:', navMenu);
    
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Hamburger clicked!');
            
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const isActive = navMenu.classList.contains('active');
            console.log('Menu active:', isActive);
            
            // Prevent body scroll when menu is open
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                console.log('Nav link clicked, closing menu');
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside (but not on hamburger)
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active')) {
                if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
                    console.log('Click outside, closing menu');
                    hamburgerMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    } else {
        console.error('Hamburger menu or nav menu not found!');
    }
});

// Product quick view functionality
const quickViewButtons = document.querySelectorAll('.quick-view');
quickViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        showNotification(`Quick view: ${productName}`);
    });
});

// Collection card hover effects
const collectionCards = document.querySelectorAll('.collection-card');
collectionCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02) rotate(1deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Social media links
const socialLinks = document.querySelectorAll('.social-icons a, .footer-social a');
socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.querySelector('i').className;
        showNotification(`Opening ${platform.includes('facebook') ? 'Facebook' : 
                        platform.includes('instagram') ? 'Instagram' : 
                        platform.includes('youtube') ? 'YouTube' : 
                        platform.includes('tiktok') ? 'TikTok' : 
                        platform.includes('twitter') ? 'Twitter' : 'Social Media'}`);
    });
});

// Currency selector
const currencySelector = document.querySelector('.currency-selector');
if (currencySelector) {
    currencySelector.addEventListener('click', function() {
        showNotification('Currency selector feature coming soon!');
    });
}

// User icon click - removed

// Cart icon click - handled above in cart functionality

// CTA button functionality
const ctaButtons = document.querySelectorAll('.cta-button, .collection-btn, .learn-more-btn, .submit-btn');
ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent;
        showNotification(`Processing: ${buttonText}`);
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Contact form functionality
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for contacting us! We will respond as soon as possible.');
        this.reset();
    });
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSlide > 0) {
        currentSlide--;
        updateHeroContent(currentSlide);
    } else if (e.key === 'ArrowRight' && currentSlide < heroContent.length - 1) {
        currentSlide++;
        updateHeroContent(currentSlide);
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    const scrolled = window.pageYOffset;
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    
    if (heroLeft && heroRight) {
        heroLeft.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroRight.style.transform = `translateY(${scrolled * -0.3}px)`;
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Lightbox functionality
function openLightbox(imageSrc, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightbox.classList.add('active');
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox when clicking outside the image
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Scroll to Top Button - Works exactly like HOME button
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        // Click animation effect
        scrollToTopBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.9) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollPosition > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
    }
});

// Contact Form Show/Hide functionality
function toggleContactForm() {
    const messageTrigger = document.getElementById('showFormBtn');
    const contactFormContainer = document.getElementById('contactFormContainer');
    
    if (!messageTrigger || !contactFormContainer) {
        console.error('Elements not found!');
        return;
    }
    
    console.log('Toggle clicked!');
    
    const currentDisplay = window.getComputedStyle(contactFormContainer).display;
    const isVisible = currentDisplay !== 'none';
    
    console.log('Current display:', currentDisplay);
    console.log('Is visible:', isVisible);
    
    if (isVisible) {
        // Hide form
        contactFormContainer.classList.remove('show');
        contactFormContainer.classList.add('hide');
        messageTrigger.classList.remove('active');
        
        setTimeout(() => {
            contactFormContainer.style.display = 'none';
            contactFormContainer.classList.remove('hide');
        }, 300);
    } else {
        // Show form
        contactFormContainer.style.display = 'block';
        contactFormContainer.classList.add('show');
        messageTrigger.classList.add('active');
        
        // Smooth scroll to form
        setTimeout(() => {
            contactFormContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
}

console.log('✨ Diva Nails and Spa website loaded successfully!');
