document.addEventListener("DOMContentLoaded", () => {

    /* MAIN SLIDER */
    const listImages = document.querySelector(".list-images");

    if (listImages) {
        let imgs = listImages.querySelectorAll("img");
        const btnLeft = document.querySelector(".btn-left");
        const btnRight = document.querySelector(".btn-right");

        let current = 1;
        let width = imgs[0].offsetWidth;

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

        let timer = setInterval(nextSlide, 3000);

        btnRight?.addEventListener("click", () => {
            clearInterval(timer);
            nextSlide();
            timer = setInterval(nextSlide, 3000);
        });

        btnLeft?.addEventListener("click", () => {
            clearInterval(timer);
            prevSlide();
            timer = setInterval(nextSlide, 3000);
        });

        window.addEventListener("resize", () => {
            updateWidth();
            listImages.style.transition = "none";
            listImages.style.transform = `translateX(${-width * current}px)`;
        });
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

    /* MODAL */
    const userBtn = document.querySelector(".js-ti-user");
    const modal = document.querySelector(".js-modal");
    const modalContainer = document.querySelector(".js-modal-container");
    const modalClose = document.querySelector(".js-modal-close");

    function showModal() {
        modal?.classList.add("open");
    }

    function hideModal() {
        modal?.classList.remove("open");
    }

    userBtn?.addEventListener("click", showModal);
    modalClose?.addEventListener("click", hideModal);

    modal?.addEventListener("click", hideModal);

    modalContainer?.addEventListener("click", event => {
        event.stopPropagation();
    });

});