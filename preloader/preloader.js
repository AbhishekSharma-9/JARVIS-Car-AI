// preloader.js

(function() {
    // 1. Create the preloader HTML structure
    const preloaderHTML = `
        <div id="preloader">
            <div class="jarvis-loader">
                <div class="loader-ring ring-1"></div>
                <div class="loader-ring ring-2"></div>
                <div class="loader-core"></div>
            </div>
            <p class="loading-text">INITIALIZING JARVIS AI...</p>
        </div>
    `;

    // 2. Insert the preloader HTML into the body
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

    // 3. Add the event listener to hide the preloader
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        
        // Use a timeout for a smoother transition
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('preloader-hidden');
            }
        }, 500);
    });
})();