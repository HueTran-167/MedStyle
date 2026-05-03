document.addEventListener("DOMContentLoaded", () => {

    /* MAIN SLIDER */
    const listImages = document.querySelector(".list-images");

    if (listImages) {
        let imgs = listImages.querySelectorAll("img");
        const btnLeft = document.querySelector(".btn-left");
        const btnRight = document.querySelector(".btn-right");

        let current = 1;
        let width = imgs[0].offsetWidth;
        let timer = null;

        const firstClone = imgs[0].cloneNode(true);
        const lastClone = imgs[imgs.length - 1].cloneNode(true);

        listImages.appendChild(firstClone);
        listImages.prepend(lastClone);

        imgs = listImages.querySelectorAll("img");
        const total = imgs.length;

        listImages.style.transition = "none";
        listImages.style.transform = `translateX(${-width * current}px)`;

        function updateWidth() {
            width = imgs[0].offsetWidth;
        }

        function moveSlide() {
            updateWidth();
            listImages.style.transition = "0.5s ease";
            listImages.style.transform = `translateX(${-width * current}px)`;
        }

        function nextSlide() {
            current++;
            moveSlide();
        }

        function prevSlide() {
            current--;
            moveSlide();
        }

        function startSlider() {
            stopSlider();
            timer = setInterval(nextSlide, 3000);
        }

        function stopSlider() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        listImages.addEventListener("transitionend", () => {
            updateWidth();

            if (current === total - 1) {
                listImages.style.transition = "none";
                current = 1;
                listImages.style.transform = `translateX(${-width * current}px)`;
            }

            if (current === 0) {
                listImages.style.transition = "none";
                current = total - 2;
                listImages.style.transform = `translateX(${-width * current}px)`;
            }
        });

        btnRight?.addEventListener("click", () => {
            nextSlide();
            startSlider();
        });

        btnLeft?.addEventListener("click", () => {
            prevSlide();
            startSlider();
        });

        window.addEventListener("resize", () => {
            updateWidth();
            listImages.style.transition = "none";
            listImages.style.transform = `translateX(${-width * current}px)`;
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopSlider();
            } else {
                updateWidth();
                listImages.style.transition = "none";
                listImages.style.transform = `translateX(${-width * current}px)`;
                startSlider();
            }
        });

        window.addEventListener("focus", () => {
            updateWidth();
            listImages.style.transition = "none";
            listImages.style.transform = `translateX(${-width * current}px)`;
            startSlider();
        });

        startSlider();
    }

    /* VIDEO HOVER PLAY */
    const videos = document.querySelectorAll(".video-wrapper video");

    videos.forEach(video => {
        video.addEventListener("mouseenter", () => {
            video.play();
        });

        video.addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0;
            video.load();
        });
    });

    /* PROMO POPUP */
    const promoPopup = document.getElementById("promoPopup");
    const closePromoPopup = document.getElementById("closePromoPopup");

    if (promoPopup && closePromoPopup) {
        setTimeout(() => {
            promoPopup.classList.add("active");
        }, 800);

        closePromoPopup.addEventListener("click", () => {
            promoPopup.classList.remove("active");
        });

        promoPopup.addEventListener("click", event => {
            if (event.target === promoPopup) {
                promoPopup.classList.remove("active");
            }
        });
    }

});