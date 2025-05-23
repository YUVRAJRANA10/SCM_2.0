// Toggle more reviews function with button repositioning
function toggleMoreReviews() {
    const moreReviews = document.getElementById('more-reviews');
    const seeMoreBtn = document.querySelector('.see-more-btn');
    const buttonContainer = document.getElementById('reviews-button-container');
    
    if (moreReviews.style.display === 'none') {
        // Show more reviews
        moreReviews.style.display = 'flex';
        seeMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> See Less Reviews';
        seeMoreBtn.classList.remove('animate__pulse', 'animate__infinite');
        
        // Add animation to newly revealed reviews
        const hiddenReviews = moreReviews.querySelectorAll('.review-card');
        hiddenReviews.forEach((card, index) => {
            card.classList.add('animate__animated', 'animate__fadeInUp');
            card.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Move button after the additional reviews
        document.querySelector('.additional-reviews').after(buttonContainer);
    } else {
        // Hide more reviews
        moreReviews.style.display = 'none';
        seeMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> See More Reviews';
        seeMoreBtn.classList.add('animate__pulse', 'animate__infinite');
        
        // Move button back to its original position after initial reviews
        document.getElementById('reviews-container').after(buttonContainer);
    }
}

// Improved isInViewport function with better performance
function isInViewport(element) {
    // Cache window height for performance
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Use getBoundingClientRect only once per check
    const { top, bottom } = element.getBoundingClientRect();
    
    // Use a more efficient check
    return (top <= windowHeight * 0.85 && bottom >= 0);
}

// Better throttle function with requestAnimationFrame for smoother performance
const throttle = (function() {
    let waiting = false;
    return function(callback) {
        if (!waiting) {
            waiting = true;
            requestAnimationFrame(function() {
                callback();
                waiting = false;
            });
        }
    };
})();

// Handle search functionality
function simulateSearch(button) {
    const originalContent = button.innerHTML;
    button.disabled = true;
    button.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Searching...</span>';
    
    // Simulate search delay
    setTimeout(() => {
        button.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
        button.innerHTML = originalContent;
        button.disabled = false;
        
        // Show a success animation
        button.classList.add('animate__animated', 'animate__bounceIn');
        setTimeout(() => {
            button.classList.remove('animate__animated', 'animate__bounceIn');
        }, 1000);
    }, 1500);
}

// Toggle itinerary details visibility
function toggleItinerary(itineraryId) {
    const detailsElement = document.getElementById(`${itineraryId}-details`);
    
    // Hide all other itineraries first
    document.querySelectorAll('.itinerary-details').forEach(el => {
        if (el.id !== `${itineraryId}-details`) {
        el.style.display = 'none';
        }
    });
    
    // Toggle the selected itinerary
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
        
        // Scroll to the itinerary details with smooth animation
        setTimeout(() => {
            detailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        detailsElement.style.display = 'none';
    }
}

// Improved function to switch between tour package options
function showTourOption(packageType, buttonElement) {
    console.log(`showTourOption called with packageType: ${packageType}`);
    
    // Get the parent container ID - FIXED LOGIC HERE
    let parentId;
    if (packageType.startsWith('unesco')) {
        parentId = 'unesco-wonders';
    } else if (packageType.startsWith('south')) {
        parentId = 'south-india';
    } else {
        parentId = 'north-india';
    }
    
    console.log(`Determined parentId: ${parentId}`);
    
    const container = document.getElementById(`${parentId}-details`);
    if (!container) {
        console.error(`Container with ID ${parentId}-details not found!`);
        return;
    }
    
    // Log all tour-option elements in this container
    const allPackages = container.querySelectorAll('.tour-option');
    console.log(`Found ${allPackages.length} packages in container ${parentId}-details`);
    allPackages.forEach(pkg => {
        console.log(`Package ID: ${pkg.id}, display: ${pkg.style.display}`);
    });
    
    // Hide all packages in this container
    allPackages.forEach(pkg => {
        pkg.style.display = 'none';
        console.log(`Hidden package: ${pkg.id}`);
    });
    
    // Show the selected package
    const packageId = `${packageType}-package`;
    console.log(`Looking for package with ID: ${packageId}`);
    
    const selectedPackage = document.getElementById(packageId);
    if (selectedPackage) {
        selectedPackage.style.display = 'block';
        console.log(`Made package visible: ${packageId}`);
        
        // Store the currently active package ID on the container for PDF generation
        container.dataset.activePackage = packageId;
        console.log(`Set activePackage attribute on container to: ${packageId}`);
    } else {
        console.error(`Package with ID ${packageId} not found!`);
    }
    
    // Update button active states
    const buttons = buttonElement.parentElement.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    buttonElement.classList.add('active');
    console.log(`Updated active button state for: ${packageType}`);
    
    // Add animation to the newly displayed package
    if (selectedPackage) {
        selectedPackage.classList.add('animate__animated', 'animate__fadeIn');
        setTimeout(() => {
            selectedPackage.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
    }
}

// Modified function to save itinerary as PDF with proper content
function saveItineraryPDF(itineraryId) {
    // First, make sure the itinerary details are visible
    const detailsElement = document.getElementById(`${itineraryId}-details`);
    if (!detailsElement) {
        console.error(`Details element with ID ${itineraryId}-details not found`);
        return;
    }
    
    const wasHidden = detailsElement.style.display === 'none';
    
    if (wasHidden) {
        detailsElement.style.display = 'block';
    }
    
    // Get the currently active package or default to the first one
    let activePackageId = detailsElement.dataset.activePackage;
    if (!activePackageId) {
        // Try to find the visible package
        const visiblePackage = detailsElement.querySelector('.tour-option[style*="display: block"]');
        if (visiblePackage) {
            activePackageId = visiblePackage.id;
        } else {
            // Default to first package if none are visible
            activePackageId = `${itineraryId === 'north-india' ? 'premium' : itineraryId + '-premium'}-package`;
        }
    }
    
    const activePackage = document.getElementById(activePackageId);
    if (!activePackage) {
        console.error(`Active package with ID ${activePackageId} not found`);
        return;
    }
    
    // Show loading message
    const loadingToast = document.createElement('div');
    loadingToast.classList.add('position-fixed', 'bottom-0', 'end-0', 'p-3', 'm-3', 'bg-info', 'text-white', 'rounded');
    loadingToast.style.zIndex = '5000';
    loadingToast.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating your PDF...';
    document.body.appendChild(loadingToast);
    
    // Load jsPDF library dynamically if not already loaded
    function loadJsPDF() {
        return new Promise((resolve) => {
            if (window.jspdf) {
                resolve(window.jspdf.jsPDF);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => resolve(window.jspdf.jsPDF);
            document.body.appendChild(script);
        });
    }
    
    // Generate PDF content
    loadJsPDF().then((jsPDF) => {
        // Create new PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Get itinerary data
        const itineraryNames = {
            'north-india': 'North India Heritage Tour',
            'south-india': 'South India Temples Tour',
            'unesco-wonders': 'UNESCO Wonders of India Tour'
        };
        
        // Determine package type from active package ID
        let packageType = "Premium";
        if (activePackageId.includes('standard')) {
            packageType = "Standard";
        } else if (activePackageId.includes('budget')) {
            packageType = "Budget";
        }
        
        const itineraryTitle = `${itineraryNames[itineraryId]} - ${packageType} Package`;
        
        // Add logo and header
        doc.setFontSize(22);
        doc.setTextColor(255, 153, 51); // Saffron color from Indian flag
        doc.text('Map My Heritage', 105, 20, { align: 'center' });
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text(itineraryTitle, 105, 30, { align: 'center' });
        
        // Add horizontal line
        doc.setDrawColor(19, 136, 8); // Green from Indian flag
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        
        // Extract and add itinerary content
        const packageTitle = activePackage.querySelector('h6.font-weight-bold').textContent;
        doc.setFontSize(14);
        doc.text(packageTitle, 20, 45);
        
        // Add package inclusions
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Package Inclusions:', 20, 55);
        
        const inclusionItems = Array.from(activePackage.querySelectorAll('.list-group-item')).slice(0, 5);
        inclusionItems.forEach((item, index) => {
            doc.text(`• ${item.textContent.trim()}`, 25, 65 + (index * 7));
        });
        
        // Add itinerary days
        doc.text('Itinerary Overview:', 20, 105);
        
        const timelineItems = Array.from(activePackage.querySelectorAll('.timeline-item')).slice(0, 5);
        timelineItems.forEach((item, index) => {
            const title = item.querySelector('.timeline-title').textContent;
            const description = item.querySelector('.timeline-content p').textContent;
            doc.text(`${title}`, 25, 115 + (index * 14));
            doc.setFontSize(10);
            doc.text(`${description}`, 25, 120 + (index * 14));
            doc.setFontSize(12);
        });
        
        // Add price information
        const priceInfo = activePackage.querySelector('.alert-success h6').textContent;
        doc.setFontSize(12);
        doc.text('Price Information:', 20, 195);
        doc.setFontSize(11);
        doc.text(priceInfo, 25, 202);
        
        // Add footer with contact info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Map My Heritage - Your gateway to India\'s cultural treasures', 105, 280, { align: 'center' });
        doc.text('Contact: info@mapmyheritage.in | www.mapmyheritage.in | +91-123-456-7890', 105, 285, { align: 'center' });
        
        // Save the PDF
        try {
            doc.save(`${itineraryTitle}.pdf`);
            
            // Remove loading message
            document.body.removeChild(loadingToast);
            
            // Show success message
            const successToast = document.createElement('div');
            successToast.classList.add('position-fixed', 'bottom-0', 'end-0', 'p-3', 'm-3', 'bg-success', 'text-white', 'rounded', 'animate__animated', 'animate__fadeIn');
            successToast.style.zIndex = '5000';
            successToast.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Your itinerary has been saved to your downloads folder!';
            document.body.appendChild(successToast);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successToast.classList.remove('animate__fadeIn');
                successToast.classList.add('animate__fadeOut');
                setTimeout(() => {
                    document.body.removeChild(successToast);
                }, 1000);
            }, 3000);
        } catch (e) {
            console.error("PDF generation failed:", e);
            
            // Show error message
            document.body.removeChild(loadingToast);
            const errorToast = document.createElement('div');
            errorToast.classList.add('position-fixed', 'bottom-0', 'end-0', 'p-3', 'm-3', 'bg-danger', 'text-white', 'rounded', 'animate__animated', 'animate__fadeIn');
            errorToast.style.zIndex = '5000';
            errorToast.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> There was an error generating your PDF. Please try again.';
            document.body.appendChild(errorToast);
            
            // Remove error message after 3 seconds
            setTimeout(() => {
                errorToast.classList.remove('animate__fadeIn');
                errorToast.classList.add('animate__fadeOut');
                setTimeout(() => {
                    document.body.removeChild(errorToast);
                }, 1000);
            }, 3000);
        }
        
        // If it was hidden before, hide it again
        if (wasHidden) {
            detailsElement.style.display = 'none';
        }
    }).catch(err => {
        console.error("Failed to load jsPDF:", err);
        document.body.removeChild(loadingToast);
        
        // Show error message
        const errorToast = document.createElement('div');
        errorToast.classList.add('position-fixed', 'bottom-0', 'end-0', 'p-3', 'm-3', 'bg-danger', 'text-white', 'rounded');
        errorToast.style.zIndex = '5000';
        errorToast.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> Failed to load PDF generation library. Please check your internet connection.';
        document.body.appendChild(errorToast);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(errorToast);
        }, 4000);
        
        // If it was hidden before, hide it again
        if (wasHidden) {
            detailsElement.style.display = 'none';
        }
    });
}

// Initialize animations on page load - Store variables in global scope to avoid recreation
const animatedElements = [];
let cachedScrollY = 0;
let ticking = false;

document.addEventListener('DOMContentLoaded', function() {
    // Cache all animated elements once on load
    document.querySelectorAll('.animate__animated').forEach(el => {
        if (!el.classList.contains('animate__animated--triggered')) {
            animatedElements.push(el);
        }
    });
    
    // Use passive event listener for scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Standardize animations for category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.classList.add('animate__fadeInUp');
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Apple-style text animation for hero heading with India tricolor theme
    initializeHeroHeading();
    
    // Initial check for animations
    checkAnimations();
    
    // Add this at the end of your existing DOMContentLoaded function
    setTimeout(debugPackageDisplay, 2000); // Wait 2 seconds to make sure everything is loaded
});

// Separate scroll handler for better performance
function handleScroll() {
    // Store the current scroll position
    cachedScrollY = window.scrollY;
    
    // Use requestAnimationFrame to avoid layout thrashing
    if (!ticking) {
        requestAnimationFrame(() => {
            checkAnimations();
            ticking = false;
        });
        ticking = true;
    }
}

// Separate function to check which elements are visible
function checkAnimations() {
    // Process a batch of elements at a time for smoother performance
    const elementsToRemove = [];
    
    for (let i = 0; i < animatedElements.length; i++) {
        const element = animatedElements[i];
        
        if (isInViewport(element)) {
            // Mark element as triggered
            element.classList.add('animate__animated--triggered');
            
            // Schedule removal from the array
            elementsToRemove.push(i);
            
            // Use CSS for animation instead of JS style changes
            // This avoids forced reflows
            element.classList.add('animate__triggered');
        }
    }
    
    // Remove processed elements from the array (in reverse order to avoid index shifting)
    for (let i = elementsToRemove.length - 1; i >= 0; i--) {
        animatedElements.splice(elementsToRemove[i], 1);
    }
    
    // Once we've processed all elements, remove the scroll listener to save resources
    if (animatedElements.length === 0) {
        window.removeEventListener('scroll', handleScroll);
    }
}

// Separate hero heading initialization for better organization
function initializeHeroHeading() {
    const heroHeading = document.getElementById('heroHeading');
    if (!heroHeading) return;
    
    // Get the original text and clear the heading
    const text = heroHeading.textContent;
    heroHeading.textContent = '';
    
    // Create a document fragment to minimize DOM operations
    const fragment = document.createDocumentFragment();
    
    // Pre-calculate all spans before adding to DOM
    const chars = text.split('');
    
    // Create and append spans for each character
    chars.forEach((char, index) => {
        const span = document.createElement('span');
        
        // Distribute India's tricolor
        if (index % 3 === 0) {
            span.classList.add('char-saffron');
        } else if (index % 3 === 1) {
            span.classList.add('char-white');
        } else {
            span.classList.add('char-green');
        }
        
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${index * 0.05}s`;
        
        fragment.appendChild(span);
    });
    
    // Add all spans to DOM in one operation
    heroHeading.appendChild(fragment);
    
    // Schedule highlight effects
    setTimeout(() => {
        scheduleHighlightSweep(heroHeading);
    }, chars.length * 50 + 500);
}

// Schedule highlight sweep with better performance
function scheduleHighlightSweep(heroHeading) {
    const spans = heroHeading.querySelectorAll('span');
    let animationActive = false;
    const spansArray = Array.from(spans);
    
    // Function for synchronized highlight sweep effect
    const highlightSweep = () => {
        // Skip if animation is already active
        if (animationActive) return;
        animationActive = true;
        
        // Track pending animations
        let pendingAnimations = spans.length;
        
        // Setup animation completion tracking to avoid memory leaks
        function onAnimationComplete() {
            pendingAnimations--;
            if (pendingAnimations === 0) {
                animationActive = false;
            }
        }
        
        // Use requestAnimationFrame for the initial batch
        requestAnimationFrame(() => {
            // Apply classes in batches for smoother performance
            for (let i = 0; i < spansArray.length; i++) {
                const span = spansArray[i];
                
                // Stagger the animations using setTimeout but with fewer DOM operations
                setTimeout(() => {
                    span.classList.add('animated');
                    
                    setTimeout(() => {
                        span.classList.remove('animated');
                        onAnimationComplete();
                    }, 2000);
                }, i * 50);
            }
        });
    };
    
    // First sweep after initial animation
    setTimeout(highlightSweep, 500);
    
    // Use a more efficient interval for recurring sweeps
    setInterval(() => {
        // Only start a new sweep if the heading is visible
        if (isInViewport(heroHeading) && !animationActive) {
            highlightSweep();
        }
    }, 6000);
}

// Add a custom CSS class to help with animations
if (!document.getElementById('scroll-optimize-styles')) {
    const style = document.createElement('style');
    style.id = 'scroll-optimize-styles';
    style.textContent = `
        .animate__triggered {
            will-change: opacity, transform;
            animation-play-state: running !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
}

// Add to window onload to ensure it works after the page is loaded
window.addEventListener('load', function() {
    // Add active class to view buttons when clicked
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});

// Add this to your app.js file at the end
function debugPackageDisplay() {
    console.log("Debugging package display...");
    
    // Debug helper function
    const checkPackage = (id) => {
        const el = document.getElementById(id);
        console.log(`${id}: ${el ? 'exists' : 'MISSING'}, display: ${el ? el.style.display : 'N/A'}`);
        return el;
    };
    
    // Check north india packages
    checkPackage('premium-package');
    checkPackage('standard-package');
    checkPackage('budget-package');
    
    // Check south india packages
    checkPackage('south-premium-package');
    checkPackage('south-standard-package');
    checkPackage('south-budget-package');
    
    // Check unesco packages
    checkPackage('unesco-premium-package');
    checkPackage('unesco-standard-package');
    checkPackage('unesco-budget-package');
    
    console.log("Debug complete");
}

// Add this to your js/app.js file

// Initialize destination cards
document.addEventListener('DOMContentLoaded', function() {
    // Make "Add to Itinerary" buttons interactive
    const addButtons = document.querySelectorAll('.add-itinerary-btn');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the destination title
            const card = this.closest('.destination-card');
            const title = card.querySelector('.destination-title').textContent;
            
            // Show a toast notification
            const toast = document.createElement('div');
            toast.className = 'destination-toast animate__animated animate__fadeInUp';
            toast.innerHTML = `
                <div class="destination-toast-content">
                    <i class="fas fa-check-circle"></i>
                    <span>${title} added to your itinerary</span>
                </div>
                <button class="toast-close-btn">&times;</button>
            `;
            
            document.body.appendChild(toast);
            
            // Change button state
            this.innerHTML = '<i class="fas fa-check"></i> Added';
            this.disabled = true;
            this.classList.add('added');
            
            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.classList.add('animate__fadeOutDown');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 500);
            }, 3000);
            
            // Allow adding again after 5 seconds
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> Add to Itinerary';
                this.disabled = false;
                this.classList.remove('added');
            }, 5000);
        });
    });
    
    // Handle gallery buttons
    const galleryButtons = document.querySelectorAll('.view-gallery-btn');
    
    galleryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the destination title
            const card = this.closest('.destination-card');
            const title = card.querySelector('.destination-title').textContent;
            
            // Create a modal gallery (simplified version)
            const modal = document.createElement('div');
            modal.className = 'destination-gallery-modal';
            modal.innerHTML = `
                <div class="gallery-modal-content animate__animated animate__zoomIn">
                    <div class="gallery-header">
                        <h4>${title} Gallery</h4>
                        <button class="modal-close-btn">&times;</button>
                    </div>
                    <div class="gallery-body">
                        <div class="gallery-loading">
                            <i class="fas fa-spinnerfa-spin"></i>
                            <p>Loading gallery images...</p>
                            <small>This is a demo - in a real app, actual images would load</small>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal when clicking the close button
            modal.querySelector('.modal-close-btn').addEventListener('click', function() {
                modal.classList.add('closing');
                modal.querySelector('.gallery-modal-content').classList.remove('animate__zoomIn');
                modal.querySelector('.gallery-modal-content').classList.add('animate__zoomOut');
                
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 500);
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.querySelector('.modal-close-btn').click();
                }
            });
        });
    });
});

// Fix the "Plan Your Trip" button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the hero section buttons
    const exploreBtn = document.querySelector('.hero-content .btn-outline-light');
    const planTripBtn = document.querySelector('.hero-content .btn-primary');
    
    // Explore Destinations button
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add a nice click animation
            this.classList.add('animate__animated', 'animate__pulse');
            
            // Navigate to the destinations page after animation
            setTimeout(() => {
                window.location.href = '../Place1.html';
            }, 300);
        });
    }
    
    // Plan Your Trip button - FIXED VERSION
    if (planTripBtn) {
        planTripBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add a nice click animation
            this.classList.add('animate__animated', 'animate__pulse');
            
            // Scroll to the trending itineraries section with smooth animation
            setTimeout(() => {
                const itinerariesSection = document.getElementById('trending-itineraries');
                
                if (itinerariesSection) {
                    // Scroll to the itineraries section with smooth animation
                    itinerariesSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                } else {
                    console.error("Trending itineraries section not found");
                    // Fallback to a fixed scroll position
                    window.scrollTo({
                        top: window.innerHeight + 200,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        });
    }
});

// Virtual Tour Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize virtual tour buttons
    const virtualTourBtns = document.querySelectorAll('.virtual-tour-btn');
    
    // Load the Pannellum panorama viewer library dynamically
    function loadPannellum(callback) {
        // Check if already loaded
        if (window.pannellum) {
            callback();
            return;
        }
        
        let cssLoaded = false;
        let jsLoaded = false;
        let hasError = false;
        
        function checkAllLoaded() {
            if ((cssLoaded && jsLoaded) || hasError) {
                callback();
            }
        }
        
        // Load CSS
        const pannellumCSS = document.createElement('link');
        pannellumCSS.rel = 'stylesheet';
        pannellumCSS.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        pannellumCSS.onload = function() {
            cssLoaded = true;
            checkAllLoaded();
        };
        pannellumCSS.onerror = function() {
            hasError = true;
            console.error('Failed to load Pannellum CSS');
            checkAllLoaded();
        };
        document.head.appendChild(pannellumCSS);
        
        // Load JS
        const pannellumJS = document.createElement('script');
        pannellumJS.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        pannellumJS.onload = function() {
            jsLoaded = true;
            checkAllLoaded();
        };
        pannellumJS.onerror = function() {
            hasError = true;
            console.error('Failed to load Pannellum JS');
            checkAllLoaded();
        };
        document.body.appendChild(pannellumJS);
        
        // Set a timeout in case loading takes too long
        setTimeout(function() {
            if (!cssLoaded || !jsLoaded) {
                hasError = true;
                console.error('Pannellum loading timed out');
                checkAllLoaded();
            }
        }, 10000); // 10 second timeout
    }

    virtualTourBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get destination name from the card
            const card = this.closest('.destination-card');
            const destinationName = card.querySelector('.destination-title').textContent;
            
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Get panorama URL based on destination
            const panoramaUrl = getVirtualTourUrl(destinationName);
            
            // Load Pannellum library and create viewer
            loadPannellum(() => {
                // Create modal for the virtual tour
                createVirtualTourModal(destinationName, panoramaUrl);
                
                // Reset button
                this.innerHTML = '<i class="fas fa-vr-cardboard"></i> 360° Tour';
                this.disabled = false;
            });
        });
    });
    
    // Update this function to use a different approach for virtual tours
    function getVirtualTourUrl(destinationName) {
        // Instead of using external URLs, we'll use a solid color background with text
        // This is a reliable fallback that doesn't require external resources
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="4096" height="2048" viewBox="0 0 4096 2048">
                <defs>
                    <linearGradient id="sky" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0074D9"/>
                        <stop offset="100%" stop-color="#7FDBFF"/>
                    </linearGradient>
                    <linearGradient id="ground" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#3D9970"/>
                        <stop offset="100%" stop-color="#2ECC40"/>
                    </linearGradient>
                </defs>
                <rect width="4096" height="1024" fill="url(#sky)"/>
                <rect y="1024" width="4096" height="1024" fill="url(#ground)"/>
                <text x="2048" y="1024" font-family="Arial" font-size="120" fill="white" text-anchor="middle">${destinationName} - 360° Tour Demo</text>
                <text x="2048" y="1200" font-family="Arial" font-size="60" fill="white" text-anchor="middle">This is a demonstration of the 360° tour feature.</text>
                <text x="2048" y="1300" font-family="Arial" font-size="60" fill="white" text-anchor="middle">In a production environment, this would be replaced with actual 360° photographs.</text>
            </svg>
        `)}`;
    }
    
    // Function to create virtual tour modal
    function createVirtualTourModal(destinationName, panoramaUrl) {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'virtual-tour-modal';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'virtual-tour-content';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'virtual-tour-header';
        header.innerHTML = `
            <h3>${destinationName} - 360° Virtual Tour</h3>
            <div class="virtual-tour-controls">
                <button class="btn btn-sm btn-outline-light fullscreen-btn">
                    <i class="fas fa-expand"></i>
                </button>
                <button class="btn btn-sm btn-outline-light close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Create panorama viewer container
        const panoramaContainer = document.createElement('div');
        panoramaContainer.id = 'panorama-viewer';
        panoramaContainer.className = 'panorama-container';
        
        // Add a loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'panorama-loading';
        loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading panorama...';
        panoramaContainer.appendChild(loadingMessage);
        
        // Add an error handler for panorama loading issues
        const handlePanoramaError = () => {
            panoramaContainer.innerHTML = `
                <div class="panorama-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Demo Mode</h3>
                    <p>This is a demonstration of the 360° virtual tour feature for ${destinationName}.</p>
                    <p>The interactive panorama allows visitors to explore destinations before traveling.</p>
                    <p>In a production environment, this would use high-quality equirectangular panorama images.</p>
                    <div class="demo-options mt-3">
                        <button class="btn btn-primary retry-panorama-btn">Try Demo Again</button>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(destinationName)}+360+panorama" target="_blank" class="btn btn-outline-light ml-2">
                            <i class="fas fa-external-link-alt mr-1"></i> See Real Examples
                        </a>
                    </div>
                </div>
            `;
            
            panoramaContainer.querySelector('.retry-panorama-btn').addEventListener('click', function() {
                panoramaContainer.innerHTML = '<div class="panorama-loading"><i class="fas fa-spinner fa-spin"></i> Loading demo panorama...</div>';
                setTimeout(() => {
                    initializePanorama();
                }, 500);
            });
            
            // Fix: Modify the close button handler to work with demo mode
            const closeBtn = modalContainer.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.removeEventListener('click', closeButtonHandler);
                closeBtn.addEventListener('click', function() {
                    // Just remove the modal container without trying to destroy viewer
                    document.body.removeChild(modalContainer);
                });
            }
        };
        
        // Function to initialize panorama
        function initializePanorama() {
            try {
                const viewer = pannellum.viewer('panorama-viewer', {
                    type: 'equirectangular',
                    panorama: panoramaUrl,
                    autoLoad: true,
                    autoRotate: -2,
                    compass: true,
                    hotSpotDebug: false,
                    sceneFadeDuration: 1000,
                    preview: '../images/loading-panorama.jpg',
                    error: handlePanoramaError
                });
                
                return viewer;
            } catch (error) {
                console.error('Panorama initialization error:', error);
                handlePanoramaError();
                return null;
            }
        }
        
        // Initialize panorama
        let viewer = null;
        try {
            viewer = initializePanorama();
        } catch (error) {
            console.error('Failed to initialize panorama:', error);
            handlePanoramaError();
        }
        
        // Define a reusable close button handler function
        const closeButtonHandler = function() {
            // Check if viewer exists before trying to destroy it
            if (viewer && typeof viewer.destroy === 'function') {
                try {
                    viewer.destroy();
                } catch (e) {
                    console.error('Error destroying viewer:', e);
                }
            }
            document.body.removeChild(modalContainer);
        };
        
        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(panoramaContainer);
        modalContainer.appendChild(modalContent);
        
        // Add to body
        document.body.appendChild(modalContainer);
        
        // Handle close button
        modalContainer.querySelector('.close-btn').addEventListener('click', closeButtonHandler);
        
        // Handle fullscreen button
        modalContainer.querySelector('.fullscreen-btn').addEventListener('click', function() {
            if (viewer && typeof viewer.toggleFullscreen === 'function') {
                viewer.toggleFullscreen();
            }
        });
        
        // Handle click outside to close
        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                closeButtonHandler();
            }
        });
        
        // Add animation
        setTimeout(() => {
            modalContainer.classList.add('visible');
        }, 10);
    }
});

// Interactive Heritage Map of India using Leaflet.js (completely free)
document.addEventListener('DOMContentLoaded', function() {
    // Check if the map container exists on this page
    const mapContainer = document.getElementById('heritage-map');
    if (!mapContainer) return;
    
    // Add Leaflet CSS to head
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    leafletCSS.crossOrigin = '';
    document.head.appendChild(leafletCSS);
    
    // Load Leaflet JS
    const loadLeaflet = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = resolve;
            document.body.appendChild(script);
        });
    };
    
    // Initialize map after Leaflet loads
    loadLeaflet().then(() => {
        initializeHeritageMap();
    });
    
    function initializeHeritageMap() {
        // Initialize the map centered on India
        const map = L.map('heritage-map').setView([22.5937, 78.9629], 5);
        
        // Add OpenStreetMap tile layer (completely free)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Create custom marker icons for each category
        function createCustomIcon(category) {
            return L.divIcon({
                className: `heritage-marker ${category}`,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
                popupAnchor: [0, -6]
            });
        }
        
        // Heritage sites data with categories
        const heritageSites = [
            {
                name: "Taj Mahal",
                location: [27.1751, 78.0421],
                category: "unesco",
                region: "north",
                image: "images/Taj Mahal Hero Image.png",
                description: "An ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra.",
                link: "../Unesco_Page.html"
            },
            {
                name: "Hawa Mahal",
                location: [26.9239, 75.8267],
                category: "monument",
                region: "north",
                image: "images/AdobeStock_505662817_Preview.jpeg",
                description: "Known as the 'Palace of Winds', this stunning five-story palace features 953 small windows.",
                link: "#"
            },
            {
                name: "Ellora Caves",
                location: [20.0267, 75.1772],
                category: "unesco",
                region: "west",
                image: "images/licensed-image.jpg",
                description: "A UNESCO World Heritage site featuring 34 rock-cut Buddhist, Hindu and Jain cave temples.",
                link: "#"
            },
            {
                name: "Sun Temple Konark",
                location: [19.8876, 86.0945],
                category: "unesco",
                region: "east",
                image: "images/sun_temple_konark.jpg",
                description: "This 13th-century Sun Temple takes the form of a massive chariot with intricately carved wheels.",
                link: "#"
            },
            {
                name: "Qutub Minar",
                location: [28.5244, 77.1855],
                category: "unesco",
                region: "north",
                image: "images/qutub1_042717100950.jpg",
                description: "The tallest brick minaret in the world, this UNESCO World Heritage site was built in 1220 AD.",
                link: "#"
            },
            {
                name: "Meenakshi Temple",
                location: [9.9195, 78.1193],
                category: "ancient",
                region: "south",
                image: "images/download.jpg",
                description: "A historic Hindu temple located in the temple city of Madurai, dedicated to goddess Meenakshi.",
                link: "#"
            },
            {
                name: "National Museum, Delhi",
                location: [28.6129, 77.2295],
                category: "museum",
                region: "north",
                image: "images/NAtional-museum.jpg",
                description: "One of the largest museums in India with a diverse collection of artifacts from prehistoric era to modern works of art.",
                link: "#"
            },
            {
                name: "Amber Fort",
                location: [26.9855, 75.8513],
                category: "monument",
                region: "north",
                image: "images/Amber_fort.jpg",
                description: "A majestic fort located in Amer, Rajasthan, known for its artistic Hindu style elements.",
                link: "#"
            },
            {
                name: "Khajuraho Group of Monuments",
                location: [24.8530, 79.9199],
                category: "unesco",
                region: "central",
                image: "images/khajurao.jpg",
                description: "Famous for their Nagara-style architectural symbolism and erotic sculptures.",
                link: "#"
            },
            {
                name: "Ajanta Caves",
                location: [20.5519, 75.7030],
                category: "unesco",
                region: "west",
                image: "images/ajanta-caves.jpg",
                description: "Buddhist rock-cut cave temples dating from the 2nd century BCE to about 480 CE.",
                link: "#"
            },
            {
                name: "Victoria Memorial",
                location: [22.5448, 88.3426],
                category: "museum",
                region: "east",
                image: "images/victoria-memorial.jpg",
                description: "A large marble building in Kolkata, which was built between 1906 and 1921 as a memorial to Queen Victoria.",
                link: "#"
            }
        ];
        
        // Create markers on the map
        const markers = [];
        
        // Add markers for each heritage site
        heritageSites.forEach(site => {
            // Create marker with custom icon based on category
            const marker = L.marker(site.location, {
                icon: createCustomIcon(site.category)
            }).addTo(map);
            
            // Create popup content
            const popupContent = `
                <h6>${site.name}</h6>
                <p>${site.category.charAt(0).toUpperCase() + site.category.slice(1)} Site</p>
            `;
            
            // Bind popup to marker
            marker.bindPopup(popupContent);
            
            // Store category and region for filtering
            marker.properties = {
                category: site.category,
                region: site.region,
                siteData: site
            };
            
            // Add click event to update sidebar info
            marker.on('click', function() {
                updateSiteInfo(site);
            });
            
            markers.push(marker);
        });
        
        // Function to update site info in sidebar
        function updateSiteInfo(site) {
            // Show site info div, hide placeholder
            document.getElementById('site-info-placeholder').style.display = 'none';
            document.getElementById('site-info').style.display = 'block';
            
            // Update site info
            document.getElementById('site-image').src = site.image;
            document.getElementById('site-image').alt = site.name;
            document.getElementById('site-name').textContent = site.name;
            document.getElementById('site-description').textContent = site.description;
            document.getElementById('site-category').textContent = site.category.toUpperCase();
            document.getElementById('site-more-link').href = site.link;
            
            // Set category badge color
            const categoryBadge = document.getElementById('site-category');
            categoryBadge.className = 'badge badge-' + site.category;
        }
        
        // Set up filter change event listeners
        const categoryFilters = document.querySelectorAll('.map-filters .custom-control-input');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', updateMapFilters);
        });
        
        // Set up region button click events
        const regionButtons = document.querySelectorAll('.region-btn');
        regionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add a nice visual transition when clicking
                this.classList.add('animate__animated', 'animate__pulse');
                setTimeout(() => {
                    this.classList.remove('animate__animated', 'animate__pulse');
                }, 700);
                
                // Toggle active class
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    // Reset to full India view
                    map.setView([22.5937, 78.9629], 5);
                } else {
                    // Remove active class from all buttons
                    regionButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Fly to region
                    const region = this.dataset.region;
                    flyToRegion(region);
                }
                
                // Apply filters
                updateMapFilters();
            });
        });
        
        // Function to filter markers based on category and region selections
        function updateMapFilters() {
            // Get checked categories
            const checkedCategories = Array.from(document.querySelectorAll('.map-filters .custom-control-input:checked'))
                .map(input => input.dataset.category);
            
            // Get selected region (if any)
            const activeRegionBtn = document.querySelector('.region-btn.active');
            const selectedRegion = activeRegionBtn ? activeRegionBtn.dataset.region : null;
            
            // Update markers visibility
            markers.forEach(marker => {
                const { category, region } = marker.properties;
                
                // Check if marker should be visible based on category and region
                const isCategoryVisible = checkedCategories.includes(category);
                const isRegionMatch = !selectedRegion || region === selectedRegion;
                
                // Update marker visibility
                if (isCategoryVisible && isRegionMatch) {
                    // If it was removed, add back to map
                    if (!map.hasLayer(marker)) {
                        marker.addTo(map);
                    }
                } else {
                    // Remove from map
                    map.removeLayer(marker);
                }
            });
        }
        
        // Function to fly to specific regions
        function flyToRegion(region) {
            const regionCoordinates = {
                north: { center: [28.7041, 77.1025], zoom: 6 },  // Delhi centered
                south: { center: [11.1271, 78.6569], zoom: 6 },  // Tamil Nadu centered
                east: { center: [22.9868, 87.8550], zoom: 6 },   // West Bengal centered
                west: { center: [19.7515, 75.7139], zoom: 6 },   // Maharashtra centered
                central: { center: [22.9734, 78.6569], zoom: 6 } // Madhya Pradesh centered
            };
            
            const coords = regionCoordinates[region] || { center: [22.5937, 78.9629], zoom: 5 };
            map.setView(coords.center, coords.zoom);
        }
    }
});
// Destination Gallery Implementation - Add this to the end of your existing app.js file
document.addEventListener('DOMContentLoaded', function() {
    // Keep existing gallery buttons functionality
    const origGalleryButtons = document.querySelectorAll('.view-gallery-btn');
    
    // Replace the click event on gallery buttons with the new implementation
    origGalleryButtons.forEach(button => {
        // Remove any existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new event listener with gallery functionality
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the destination title
            const card = this.closest('.destination-card');
            const title = card.querySelector('.destination-title').textContent;
            
            // Get destination-specific images based on title
            let galleryImages = [];
            
            // Set gallery images based on destination
            switch(title) {
                case 'Hawa Mahal':
                    galleryImages = [
                        { src: 'images/AdobeStock_505662817_Preview.jpeg', caption: 'The stunning facade of Hawa Mahal' },
                        { src: 'images/hawa-mahal-2.jpg', caption: 'Intricate lattice windows of the palace' },
                        { src: 'images/hawa-mahal-3.jpg', caption: 'View of Hawa Mahal from the street' },
                        { src: 'images/hawa-mahal-4.jpg', caption: 'Interior corridors of the Palace of Winds' },
                        { src: 'images/hawa-mahal-5.jpg', caption: 'The iconic pink sandstone architecture' }
                    ];
                    break;
                case 'Ellora Caves':
                    galleryImages = [
                        { src: 'images/licensed-image.jpg', caption: 'The magnificent rock-cut temples of Ellora' },
                        { src: 'images/ellora-caves-2.jpg', caption: 'Intricate carvings inside the Buddhist caves' },
                        { src: 'images/ellora-caves-3.jpg', caption: 'The impressive Kailasha Temple carved from a single rock' },
                        { src: 'images/ellora-caves-4.jpg', caption: 'Detailed sculptures depicting mythological scenes' },
                        { src: 'images/ellora-caves-5.jpg', caption: 'Panoramic view of the cave complex' }
                    ];
                    break;
                case 'Sun Temple Konark':
                    galleryImages = [
                        { src: 'images/sun_temple_konark.jpg', caption: 'The majestic Sun Temple at Konark' },
                        { src: 'images/konark-2.jpg', caption: 'The iconic chariot wheels of the temple' },
                        { src: 'images/konark-3.jpg', caption: 'Intricate stone carvings on the temple walls' },
                        { src: 'images/konark-4.jpg', caption: 'The temple during sunrise - a tribute to the Sun God' },
                        { src: 'images/konark-5.jpg', caption: 'Detailed sculptures depicting daily life and mythology' }
                    ];
                    break;
                default:
                    // Default gallery with placeholder images
                    galleryImages = [
                        { src: 'images/placeholder-1.jpg', caption: 'View of the heritage site' },
                        { src: 'images/placeholder-2.jpg', caption: 'Architectural details' },
                        { src: 'images/placeholder-3.jpg', caption: 'Historical context' }
                    ];
            }
            
            // Create a modal gallery
            const modal = document.createElement('div');
            modal.className = 'destination-gallery-modal';
            modal.innerHTML = `
                <div class="gallery-modal-content animate__animated animate__zoomIn">
                    <div class="gallery-header">
                        <h4>${title} Gallery</h4>
                        <button class="modal-close-btn">&times;</button>
                    </div>
                    <div class="gallery-main">
                        <div class="gallery-image-container">
                            <img src="${galleryImages[0].src}" alt="${title}" class="gallery-main-image">
                            <div class="gallery-caption">${galleryImages[0].caption}</div>
                            <button class="gallery-nav gallery-prev" style="visibility: hidden;">&#10094;</button>
                            <button class="gallery-nav gallery-next">&#10095;</button>
                        </div>
                    </div>
                    <div class="gallery-thumbnails">
                        ${galleryImages.map((img, index) => 
                            `<div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                                <img src="${img.src}" alt="Thumbnail ${index + 1}">
                            </div>`
                        ).join('')}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Show modal with animation
            setTimeout(() => {
                modal.classList.add('visible');
            }, 10);
            
            // Current image index
            let currentIndex = 0;
            
            // Close button
            const closeButton = modal.querySelector('.modal-close-btn');
            closeButton.addEventListener('click', () => {
                modal.classList.remove('visible');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
            
            // Click outside to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeButton.click();
                }
            });
            
            // Navigation
            const prevButton = modal.querySelector('.gallery-prev');
            const nextButton = modal.querySelector('.gallery-next');
            const mainImage = modal.querySelector('.gallery-main-image');
            const caption = modal.querySelector('.gallery-caption');
            const thumbnails = modal.querySelectorAll('.gallery-thumbnail');
            
            // Update image function
            function updateImage(index) {
                currentIndex = index;
                
                // Update main image and caption
                mainImage.src = galleryImages[index].src;
                caption.textContent = galleryImages[index].caption;
                
                // Update thumbnails
                thumbnails.forEach((thumb, i) => {
                    if (i === index) {
                        thumb.classList.add('active');
                    } else {
                        thumb.classList.remove('active');
                    }
                });
                
                // Update navigation buttons
                prevButton.style.visibility = index > 0 ? 'visible' : 'hidden';
                nextButton.style.visibility = index < galleryImages.length - 1 ? 'visible' : 'hidden';
            }
            
            // Navigation event handlers
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    updateImage(currentIndex - 1);
                }
            });
            
            nextButton.addEventListener('click', () => {
                if (currentIndex < galleryImages.length - 1) {
                    updateImage(currentIndex + 1);
                }
            });
            
            // Thumbnail clicks
            thumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    const index = parseInt(thumbnail.getAttribute('data-index'));
                    updateImage(index);
                });
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', function galleryKeyHandler(e) {
                if (!modal.classList.contains('visible')) {
                    document.removeEventListener('keydown', galleryKeyHandler);
                    return;
                }
                
                switch(e.key) {
                    case 'ArrowLeft':
                        if (currentIndex > 0) {
                            updateImage(currentIndex - 1);
                        }
                        break;
                    case 'ArrowRight':
                        if (currentIndex < galleryImages.length - 1) {
                            updateImage(currentIndex + 1);
                        }
                        break;
                    case 'Escape':
                        closeButton.click();
                        break;
                }
            });
        });
    });
});