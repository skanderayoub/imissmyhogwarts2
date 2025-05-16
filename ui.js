export function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}

export function createFloatingCandle(x, y) {
    const candle = document.createElement("div");
    candle.className = "floating-candle";
    candle.style.left = `${x}px`;
    candle.style.top = `${y}px`;
    document.body.appendChild(candle);
    setTimeout(() => candle.remove(), 5000);
}

export function setupMouseEffects() {
    document.addEventListener("mousemove", (e) => {
        const now = Date.now();
        if (!window.lastSparkle || now - window.lastSparkle > 50) {
            createSparkle(e.clientX, e.clientY);
            if (Math.random() < 0.1) {
                createFloatingCandle(e.clientX, e.clientY);
            }
            window.lastSparkle = now;
        }
    });
}

export async function updateCursorStyle(cursorValue) {
    const root = document.documentElement;
    const extensions = ["cur", "ani"];
    let cursorUrl, pointerUrl;
    let success = false;

    for (const ext of extensions) {
        cursorUrl = `url('assets/cursors/${cursorValue}/cursor.${ext}')`;
        pointerUrl = `url('assets/cursors/${cursorValue}/pointer.${ext}')`;
        try {
            const cursorImg = new Image();
            const pointerImg = new Image();
            cursorImg.src = `assets/cursors/${cursorValue}/cursor.${ext}`;
            pointerImg.src = `assets/cursors/${cursorValue}/pointer.${ext}`;
            await Promise.all([
                new Promise((resolve, reject) => {
                    cursorImg.onload = resolve;
                    cursorImg.onerror = () =>
                        reject(new Error(`Failed to load cursor: ${cursorUrl}`));
                }),
                new Promise((resolve, reject) => {
                    pointerImg.onload = resolve;
                    pointerImg.onerror = () =>
                        reject(new Error(`Failed to load pointer: ${pointerUrl}`));
                }),
            ]);
            root.style.setProperty("--cursor-url", cursorUrl);
            root.style.setProperty("--pointer-url", pointerUrl);
            console.log(`Cursor updated to: ${cursorUrl}, Pointer: ${pointerUrl}`);
            success = true;
            break;
        } catch (error) {
            console.warn(`Failed with ${ext}: ${error.message}`);
            continue;
        }
    }

    if (!success) {
        const fallbackUrl = `url('assets/wand.png')`;
        try {
            const fallbackImg = new Image();
            fallbackImg.src = "assets/wand.png";
            await new Promise((resolve, reject) => {
                fallbackImg.onload = resolve;
                fallbackImg.onerror = () =>
                    reject(new Error("Failed to load fallback wand.png"));
            });
            root.style.setProperty("--cursor-url", fallbackUrl);
            root.style.setProperty("--pointer-url", fallbackUrl);
            console.warn(`Fell back to: ${fallbackUrl}`);
        } catch (error) {
            console.error(error.message);
            root.style.setProperty("--cursor-url", "default");
            root.style.setProperty("--pointer-url", "pointer");
            console.warn("Ultimate fallback to browser default cursors");
        }
    }

    document.body.style.cursor = "auto";
    document.querySelectorAll('[style*="cursor"]').forEach((el) => {
        el.style.cursor = "auto";
    });
    setTimeout(() => {
        document.body.style.cursor = `${root.style.getPropertyValue(
            "--cursor-url"
        )} 0 0, auto`;
        document
            .querySelectorAll(
                '.character-card, button[class~="audio"], select, .tab-button'
            )
            .forEach((el) => {
                el.style.cursor = `${root.style.getPropertyValue(
                    "--pointer-url"
                )} 4 4, pointer`;
            });
    }, 0);
}