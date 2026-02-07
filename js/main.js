// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown');

    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
    }

    // Debug: Check if elements exist
    if (!mobileMenuToggle) {
        console.warn('Mobile menu toggle button not found');
    }
    if (!mainNav) {
        console.warn('Main navigation not found');
    }

    // Toggle mobile menu - simplified and more reliable
    if (mobileMenuToggle && mainNav) {
        // Function to toggle menu
        function toggleMenu() {
            const isActive = mainNav.classList.contains('active');
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            if (overlay) {
                overlay.classList.toggle('active');
            }
            // Prevent body scroll when menu is open
            if (!isActive) {
                document.body.classList.add('menu-open');
                document.body.style.overflow = 'hidden';
            } else {
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        }

        // Event handler - works for both click and touch
        function handleMenuToggle(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            toggleMenu();
        }

        // Use click event (works on both desktop and mobile)
        mobileMenuToggle.addEventListener('click', handleMenuToggle, true); // Use capture phase

        // Also add touchstart for immediate mobile response (before click)
        mobileMenuToggle.addEventListener('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            toggleMenu();
        }, { passive: false, capture: true });
    }

    // Close mobile menu function
    function closeMenu() {
        // Remove body lock first to ensure navigation works
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';

        if (mainNav) {
            mainNav.classList.remove('active');
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Close menu when clicking on overlay
    if (overlay) {
        function handleOverlayClick(e) {
            // Don't close if clicking on the menu itself
            if (mainNav && mainNav.contains(e.target)) {
                return;
            }
            // Only close if clicking directly on the overlay, not on menu items
            if (e.target === overlay) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            }
        }

        overlay.addEventListener('click', handleOverlayClick, false);
        overlay.addEventListener('touchend', function (e) {
            // Don't close if touching the menu
            if (mainNav && mainNav.contains(e.target)) {
                return;
            }
            if (e.target === overlay) {
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            }
        }, { passive: false });
    }

    // Click outside to close - but not on the button itself or navigation links
    document.addEventListener('click', function (e) {
        // Only handle clicks when menu is open
        if (mainNav && mainNav.classList.contains('active')) {
            // Don't close if clicking the toggle button (it will handle its own toggle)
            if (mobileMenuToggle && (mobileMenuToggle === e.target || mobileMenuToggle.contains(e.target))) {
                return;
            }
            // Don't close if clicking on overlay (it has its own handler)
            if (overlay && overlay === e.target) {
                closeMenu();
                return;
            }
            // Don't close if clicking inside the menu - let links navigate
            if (mainNav.contains(e.target)) {
                // If clicking a link, let it navigate (don't prevent default)
                const link = e.target.closest('a');
                if (link && link.href && !link.classList.contains('dropdown-toggle')) {
                    // Allow navigation to proceed naturally
                    return;
                }
                return;
            }
            // Close if clicking outside the menu
            closeMenu();
        }
    }, false);

    // Touch outside to close (for mobile) - but not on the button itself or navigation links
    document.addEventListener('touchend', function (e) {
        // Only handle touches when menu is open
        if (mainNav && mainNav.classList.contains('active')) {
            // Don't close if touching the toggle button (it will handle its own toggle)
            if (mobileMenuToggle && (mobileMenuToggle === e.target || mobileMenuToggle.contains(e.target))) {
                return;
            }
            // Check if we're touching inside the menu
            if (mainNav.contains(e.target)) {
                // Don't close if touching on dropdown toggle (it handles its own toggle)
                if (e.target.closest('.dropdown-toggle')) {
                    return;
                }
                // Don't close if touching on a navigation link (let it navigate)
                const link = e.target.closest('a');
                if (link && link.href && !link.classList.contains('dropdown-toggle')) {
                    // Allow link navigation to proceed - don't prevent default
                    return;
                }
                // Don't close for any other touches inside the menu
                return;
            }
            // Close if touching directly on the overlay
            if (overlay && e.target === overlay) {
                closeMenu();
            }
        }
    }, { passive: true });

    // Handle dropdown toggle on mobile/tablet
    dropdownToggles.forEach(function (toggle) {
        let lastToggleTime = 0;
        const TOGGLE_DEBOUNCE = 350; // Slightly increased for mobile reliability

        function handleDropdownToggle(e) {
            // Check if we're on mobile/tablet (screen width <= 1024px)
            if (window.innerWidth < 1025) {
                const now = Date.now();
                if (now - lastToggleTime < TOGGLE_DEBOUNCE) return;
                lastToggleTime = now;

                e.preventDefault();
                e.stopPropagation();

                const dropdown = toggle.closest('.dropdown');
                if (!dropdown) return;

                // Toggle current dropdown
                const isOpening = !dropdown.classList.contains('active');

                // Optional: Close other dropdowns if opening one
                if (isOpening) {
                    document.querySelectorAll('.dropdown.active').forEach(activeDropdown => {
                        if (activeDropdown !== dropdown) {
                            activeDropdown.classList.remove('active');
                        }
                    });
                }

                dropdown.classList.toggle('active');
            }
        }

        // Use click event primarily
        toggle.addEventListener('click', handleDropdownToggle, true);

        // Ensure prompt response on touch-heavy devices
        toggle.addEventListener('touchstart', function (e) {
            if (window.innerWidth < 1025) {
                handleDropdownToggle(e);
            }
        }, { passive: false });
    });

    // Handle clicks on dropdown menu links
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(function (link) {
        // Handle click event - ensure menu closes but allow navigation
        link.addEventListener('click', function (e) {
            // CRITICAL: Never prevent default - allow normal link navigation
            if (window.innerWidth < 1025) {
                // Close dropdown
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
                // Close menu immediately - remove body lock to allow navigation
                closeMenu();
                // Don't prevent default - let the link navigate normally
            }
        }, false); // Use bubble phase to not interfere with navigation
    });

    // Also close menu when clicking regular nav links on mobile
    // Use a more specific selector to ensure we get all navigation links
    const navLinks = document.querySelectorAll('.main-nav a:not(.dropdown-toggle)');
    navLinks.forEach(function (link) {
        // Handle click event - ensure menu closes but allow navigation
        link.addEventListener('click', function (e) {
            // CRITICAL: Never prevent default - allow normal link navigation
            if (window.innerWidth < 1025 && mainNav && mainNav.classList.contains('active')) {
                // Close menu immediately - remove body lock to allow navigation
                closeMenu();
                // Don't prevent default - let the link navigate normally
            }
        }, false); // Use bubble phase to not interfere with navigation
    });

    // Close dropdowns when clicking outside on mobile
    function handleCloseDropdownsOutside(e) {
        if (window.innerWidth < 1025) {
            // Don't close if clicking on a dropdown link (let it navigate)
            if (e.target.closest('.dropdown-menu a')) {
                return;
            }

            // Don't close if clicking on the dropdown toggle (it handles its own toggle)
            if (e.target.closest('.dropdown-toggle') || e.target.classList.contains('dropdown-toggle')) {
                return;
            }

            // Don't close if clicking on the dropdown arrow
            if (e.target.closest('.dropdown-arrow')) {
                return;
            }

            dropdownMenus.forEach(function (dropdown) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    }

    document.addEventListener('click', handleCloseDropdownsOutside);
    document.addEventListener('touchend', handleCloseDropdownsOutside);

    // Handle window resize - close mobile menu if resizing to desktop
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 1024) {
                closeMenu();
                dropdownMenus.forEach(function (dropdown) {
                    dropdown.classList.remove('active');
                });
            }
        }, 250);
    });

    // Accordion functionality for FAQs
    function initAccordions() {
        const accordionItems = document.querySelectorAll('.accordion-item');

        if (accordionItems.length === 0) {
            return; // No accordions found
        }

        accordionItems.forEach(function (item) {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            if (!header || !content) {
                return; // Skip if elements not found
            }

            // Set initial max-height based on content
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }

            // Add click event listener
            header.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const isActive = item.classList.contains('active');
                const currentContent = item.querySelector('.accordion-content');

                // Close all other accordions
                accordionItems.forEach(function (otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        if (otherContent) {
                            otherContent.style.maxHeight = '0';
                        }
                    }
                });

                // Toggle current accordion
                if (isActive) {
                    item.classList.remove('active');
                    if (currentContent) {
                        currentContent.style.maxHeight = '0';
                    }
                } else {
                    item.classList.add('active');
                    if (currentContent) {
                        currentContent.style.maxHeight = currentContent.scrollHeight + 'px';
                    }
                }
            }, false);

            // Touch support for mobile
            header.addEventListener('touchend', function (e) {
                e.preventDefault();
                e.stopPropagation();
                header.click();
            }, { passive: false });

            // Pointer events for better cross-device support
            header.addEventListener('pointerdown', function (e) {
                if (e.pointerType === 'touch') {
                    e.preventDefault();
                }
            });
        });

        // Handle window resize to recalculate accordion heights
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                accordionItems.forEach(function (item) {
                    if (item.classList.contains('active')) {
                        const content = item.querySelector('.accordion-content');
                        if (content) {
                            content.style.maxHeight = content.scrollHeight + 'px';
                        }
                    }
                });
            }, 100);
        });
    }

    // Initialize accordions - use a small delay to ensure DOM is fully ready
    setTimeout(function () {
        initAccordions();
    }, 100);

    // Portfolio Filter Functionality
    function initPortfolioFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item-new');

        if (filterButtons.length === 0 || portfolioItems.length === 0) {
            return; // Portfolio section not found
        }

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const filterValue = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                // Filter portfolio items with smooth animation
                portfolioItems.forEach(function (item) {
                    const itemCategory = item.getAttribute('data-category');
                    const shouldShow = filterValue === 'all' || itemCategory === filterValue;
                    const isCurrentlyVisible = !item.classList.contains('hidden');

                    if (shouldShow && !isCurrentlyVisible) {
                        // Show item with fade-in animation
                        item.classList.remove('hidden');
                        item.style.transition = 'none';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        // Force reflow to ensure initial state is applied
                        void item.offsetWidth;
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    } else if (!shouldShow && isCurrentlyVisible) {
                        // Hide item with fade-out animation
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(-20px)';
                        setTimeout(function () {
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    // Initialize portfolio filters
    setTimeout(function () {
        initPortfolioFilters();
    }, 100);

    // Dynamic Navigation Active State
    function highlightActiveNav() {
        const currentPath = window.location.pathname;
        const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
        const navLinks = document.querySelectorAll('.main-nav a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Remove hardcoded active class first to avoid conflicts
            link.classList.remove('active');

            if (href === filename || (filename === 'index.html' && href === '#')) {
                link.classList.add('active');

                // Also highlight parent dropdown if applicable
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const toggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (toggle) toggle.classList.add('active');
                }
            }
        });
    }

    // Initialize active nav highlighting
    highlightActiveNav();
});

