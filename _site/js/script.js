let cards = Array.from(document.querySelectorAll(".pexeso__card"));
let firstCard = null;
let secondCard = null;
let isProcessing = false;
let currentPlayer = 1; // Hráč 1 začíná
let score1 = 0;
let score2 = 0;

// Funkce na promíchání polí (Fisher-Yates Shuffle)
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Funkce pro zvýraznění hráče
const updatePlayerHighlight = () => {
    const player1 = document.querySelector("#player1");
    const player2 = document.querySelector("#player2");

    player1.classList.toggle("active", currentPlayer === 1);
    player2.classList.toggle("active", currentPlayer === 2);
};

// Funkce na přepnutí hráče
const switchPlayer = () => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerHighlight();
};

// Funkce na aktualizaci skóre
const updateScore = () => {
    if (currentPlayer === 1) {
        score1++;
        document.querySelector("#score1").textContent = `${score1}`;
    } else {
        score2++;
        document.querySelector("#score2").textContent = `${score2}`;
    }
};

// Kontrola, zda jsou všechny karty otočené
const allCardsFlipped = () => {
    return document.querySelectorAll(".pexeso__card:not(.flipped)").length === 0;
};

// Určení vítěze
const determineWinner = () => {
    if (score1 > score2) {
        return "Hráč 1 je vítěz!";
    } else if (score2 > score1) {
        return "Hráč 2 je vítěz!";
    } else {
        return "Je to remíza!";
    }
};

// Ukončení hry
const endGame = () => {
    const winnerMessage = determineWinner();
    const winnerElement = document.querySelector("#winner");

    // Vložíme zprávu o vítězi do stránky
    winnerElement.textContent = winnerMessage;

    console.log(winnerMessage); // Pro ladění v konzoli
};

// Přidání posluchačů na kartičky
const addListenersToCards = () => {
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (isProcessing) {
                console.log("Probíhá vyhodnocení, vyčkej.");
                return;
            }

            if (card.classList.contains("flipped")) {
                console.log("Tato karta už je otočená.");
                return;
            }

            card.classList.add("flipped");

            if (!firstCard) {
                firstCard = card;
            } else if (!secondCard) {
                secondCard = card;

                isProcessing = true;
                setTimeout(() => {
                    const firstCardID = firstCard.querySelector(".pexeso__image--front").id.split('_')[0];
                    const secondCardID = secondCard.querySelector(".pexeso__image--front").id.split('_')[0];

                    if (firstCardID === secondCardID) {
                        console.log("Máme pár!");
                        updateScore();
                    } else {
                        console.log("To není pár!");
                        firstCard.classList.remove("flipped");
                        secondCard.classList.remove("flipped");
                        switchPlayer();
                    }

                    firstCard = null;
                    secondCard = null;
                    isProcessing = false;

                    // Kontrola na konec hry
                    if (allCardsFlipped()) {
                        endGame();
                    }
                }, 1000);
            }
        });
    });
};

// Funkce na spuštění hry
const startGame = () => {
    // Odstraníme třídu 'flipped' ze všech karet
    cards.forEach((card) => {
        card.classList.remove("flipped");
    });

    // Přidáme třídu 'shuffle' na všechny karty
    cards.forEach((card) => {
        card.classList.add("shuffle");
    });

    // Po 0,5 sekundě odstraníme třídu 'shuffle' a promícháme karty
    setTimeout(() => {
        cards.forEach((card) => {
            card.classList.remove("shuffle");
        });

        const grid = document.querySelector(".pexeso__grid");
        let shuffledCards = shuffle(cards);

        grid.innerHTML = ""; // Vymažeme starou mřížku
        shuffledCards.forEach((card) => {
            grid.appendChild(card); // Přidáme promíchané kartičky
        });

        console.log("Kartičky byly promíchány a uspořádány v mřížce!");

        // Přidáme posluchače na nové kartičky
        addListenersToCards();
        currentPlayer = 1; // Reset na hráče 1
        score1 = 0;
        score2 = 0;
        document.querySelector("#score1").textContent = ` ${score1}`;
        document.querySelector("#score2").textContent = ` ${score2}`;
        document.querySelector("#winner").textContent = ""; // Vymažeme zprávu o vítězi
        updatePlayerHighlight(); // Zvýrazní hráče na tahu
    }, 500); // Čas animace odpovídá časování v CSS (0.5s)
};

// Přidání posluchače na tlačítko "Začít hrát"
let startButton = document.querySelector(".pexeso__start");
startButton.addEventListener("click", startGame);

// Načtení posluchačů při prvním načtení
addListenersToCards();
updatePlayerHighlight();
