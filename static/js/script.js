
console.log("JavaScript del zoológico cargado");

// Elementos de la ventana del video
const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoModalPlayer");
const videoTitle = document.getElementById("videoModalTitle");
const closeVideoModal = document.getElementById("closeVideoModal");

// Comprobar que el HTML tenga los elementos necesarios
if (!videoModal || !videoPlayer || !videoTitle || !closeVideoModal) {
    console.error("No se encontraron los elementos de la ventana de video.");
} else {

    // Obtener el ID de un video de YouTube desde su URL
    function getYouTubeVideoId(url) {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname.replace(/^www\./, "");

            let videoId = null;

            if (hostname === "youtu.be") {
                videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
            } else if (
                hostname === "youtube.com" ||
                hostname === "m.youtube.com" ||
                hostname === "youtube-nocookie.com"
            ) {
                if (parsedUrl.pathname === "/watch") {
                    videoId = parsedUrl.searchParams.get("v");
                } else {
                    const parts = parsedUrl.pathname.split("/").filter(Boolean);

                    if (["embed", "shorts", "live"].includes(parts[0])) {
                        videoId = parts[1];
                    }
                }
            }

            return videoId && /^[\w-]{11}$/.test(videoId)
                ? videoId
                : null;

        } catch (error) {
            console.error("URL de video no válida:", url);
            return null;
        }
    }

    // Preparar las miniaturas y los botones de reproducción
    document.querySelectorAll(".video-preview").forEach((button) => {
        const url = button.dataset.videoUrl;
        const title = button.dataset.videoTitle || "Video";
        const videoId = getYouTubeVideoId(url);
        const placeholder = button.querySelector(
            ".video-preview__placeholder"
        );

        if (videoId && placeholder) {
            const thumbnail = document.createElement("img");

            thumbnail.src =
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            thumbnail.alt = `Vista previa de ${title}`;
            thumbnail.className = "video-preview__image";
            thumbnail.loading = "lazy";

            // Si YouTube no proporciona la miniatura, mostrar un aviso
            thumbnail.addEventListener("error", () => {
                const message = document.createElement("span");
                message.className = "video-preview__placeholder";
                message.textContent = "Miniatura no disponible";
                thumbnail.replaceWith(message);
            }, { once: true });

            placeholder.replaceWith(thumbnail);

        } else if (!videoId && placeholder) {
            placeholder.textContent = "URL de YouTube no válida";
        }

        // Abrir el video al hacer clic
        button.addEventListener("click", () => {
            const videoUrl = button.dataset.videoUrl;
            const videoTitleText = button.dataset.videoTitle || "Video";
            const id = getYouTubeVideoId(videoUrl);

            if (!id) {
                window.open(videoUrl, "_blank", "noopener,noreferrer");
                return;
            }

            videoTitle.textContent = videoTitleText;
            videoPlayer.replaceChildren();

            const iframe = document.createElement("iframe");

            iframe.src =
                `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;

            iframe.title = `Video de ${videoTitleText}`;
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";

            videoPlayer.appendChild(iframe);

            videoModal.classList.add("is-open");
            videoModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");

            closeVideoModal.focus();
        });
    });

    // Cerrar la ventana y detener el video
    function closeModal() {
        videoModal.classList.remove("is-open");
        videoModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        videoPlayer.replaceChildren();
    }

    closeVideoModal.addEventListener("click", closeModal);

    // Cerrar al pulsar el fondo oscuro
    videoModal.addEventListener("click", (event) => {
        if (event.target === videoModal) {
            closeModal();
        }
    });

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            videoModal.classList.contains("is-open")
        ) {
            closeModal();
        }
    });
}
