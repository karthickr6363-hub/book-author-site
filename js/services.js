// Services Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initViewToggle();
});

function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const servicesContainer = document.getElementById('servicesContainer');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const view = this.dataset.view;
            if (view === 'list') {
                servicesContainer.classList.add('list-view');
            } else {
                servicesContainer.classList.remove('list-view');
            }
        });
    });
}












