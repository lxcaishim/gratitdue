const prompts = [
  "Who made your day easier today, and how can you thank them?",
  "What challenge taught you something useful this week?",
  "Which small moment today made you feel calm or hopeful?",
  "What is one ability you have now that you did not have a year ago?",
  "Name one thing in your routine that quietly supports your wellbeing."
];

/** Paste your Solana mint / contract address here — Buy + footer pump link update to pump.fun/coin/<mint> */
const SOLANA_MINT = "";

function pumpCoinUrl() {
  const m = SOLANA_MINT.trim();
  return m ? `https://pump.fun/coin/${m}` : "https://pump.fun";
}

function formatCaLabel(mint) {
  const m = mint.trim();
  if (!m) return "CA: TBD";
  if (m.length <= 14) return `CA: ${m}`;
  return `CA: ${m.slice(0, 6)}…${m.slice(-4)}`;
}

function copyPayload(mint) {
  const m = mint.trim();
  return m || "CA: TBD";
}

function applyLinksAndLabels() {
  const url = pumpCoinUrl();
  const buyBtn = document.getElementById("buyBtn");
  const footerPump = document.getElementById("footerPump");
  const caLabel = document.getElementById("caLabel");

  if (buyBtn) buyBtn.href = url;
  if (footerPump) footerPump.href = url;
  if (caLabel) caLabel.textContent = formatCaLabel(SOLANA_MINT);
}

applyLinksAndLabels();

const promptBtn = document.getElementById("promptBtn");
const promptText = document.getElementById("promptText");
const journalForm = document.getElementById("journalForm");
const clearBtn = document.getElementById("clearBtn");
const saveStatus = document.getElementById("saveStatus");
const copyCaBtn = document.getElementById("copyCaBtn");
const copyStatus = document.getElementById("copyStatus");
const entryOne = document.getElementById("entryOne");
const entryTwo = document.getElementById("entryTwo");
const entryThree = document.getElementById("entryThree");
const storageKey = "gratitude-reflection-v1";

if (promptBtn && promptText) {
  promptText.textContent = prompts[0];
  promptBtn.addEventListener("click", () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptText.textContent = randomPrompt;
  });
}

if (copyCaBtn && copyStatus) {
  copyCaBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyPayload(SOLANA_MINT));
      copyStatus.textContent = "Copied";
    } catch (_error) {
      copyStatus.textContent = "Copy unavailable";
    }
    setTimeout(() => {
      copyStatus.textContent = "";
    }, 1800);
  });
}

if (journalForm && entryOne && entryTwo && entryThree && saveStatus) {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      entryOne.value = parsed.entryOne || "";
      entryTwo.value = parsed.entryTwo || "";
      entryThree.value = parsed.entryThree || "";
    } catch (_error) {
      localStorage.removeItem(storageKey);
    }
  }

  journalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        entryOne: entryOne.value.trim(),
        entryTwo: entryTwo.value.trim(),
        entryThree: entryThree.value.trim()
      })
    );
    saveStatus.textContent = "Saved locally on this device.";
  });
}

if (clearBtn && entryOne && entryTwo && entryThree && saveStatus) {
  clearBtn.addEventListener("click", () => {
    entryOne.value = "";
    entryTwo.value = "";
    entryThree.value = "";
    localStorage.removeItem(storageKey);
    saveStatus.textContent = "Cleared.";
  });
}
