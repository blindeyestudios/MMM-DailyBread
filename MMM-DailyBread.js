Module.register("MMM-DailyBread", {
    defaults: {
        updateInterval: 24 * 60 * 60 * 1000,
        fadeSpeed: 2000,
        apiUrl: "https://beta.ourmanna.com/api/v1/get/?format=json&order=daily"
    },

    start: function () {
        this.verse = "Loading verse...";
        this.reference = "";
        this.scheduleUpdate(0);
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "bible-verse-wrapper";

        const verseEl = document.createElement("div");
        verseEl.className = "bible-verse-text";
        verseEl.innerHTML = `"${this.verse}"`;

        const refEl = document.createElement("div");
        refEl.className = "bible-verse-reference";
        refEl.innerHTML = this.reference;

        wrapper.appendChild(verseEl);
        wrapper.appendChild(refEl);
        return wrapper;
    },

    scheduleUpdate: function (delay) {
        const nextLoad = typeof delay === "number" && delay >= 0 ? delay : this.config.updateInterval;
        setTimeout(() => {
            this.getVerse();
        }, nextLoad);
    },

    getVerse: function () {
        fetch(this.config.apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data?.verse?.details) {
                    const { text, reference } = data.verse.details;
                    this.verse = text;
                    this.reference = reference;
                    this.updateDom(this.config.fadeSpeed);
                } else {
                    this.verse = "Verse not available.";
                    this.reference = "";
                }
            })
            .catch(err => {
                console.error("MMM-DailyBread fetch error:", err);
                this.verse = "Error fetching verse.";
                this.reference = "";
            })
            .finally(() => {
                this.scheduleUpdate();
            });
    }
});
