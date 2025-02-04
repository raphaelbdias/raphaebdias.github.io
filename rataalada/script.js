/*********************************************
 * Rataalada-Style Multi-Level Game
 * - Boot -> Clear -> Traceroute -> Hide Intro
 * - Tests in Sequential Order (No initial selection)
 * - Typewriter effect for riddles & messages
 * - Each victory: shows doc link & asks Y/N to proceed
 *********************************************/

// 1) Boot lines
const bootSequenceLines = [
  "systemctl stop sshd",
  "systemctl status sshd",
  "● sshd.service - openssh daemon",
  "   loaded: loaded (/lib/systemd/system/sshd.service; enabled; vendor preset: enabled)",
  "   active: inactive (dead)",
  "   docs: man:sshd(8)",
  "         man:sshd_config(5)",
  "   main pid: 1228 (code=exited, status=0/success)",
  "rm /var/log/sshd.log",
  "echo -n > ~/.bash_history",
  "exit"
];

// 2) Traceroute lines
const tracerouteLines = [
  ">> traceroute rataalada.com",
  "pos-0-3-0-0-cr01.arkham.gothamdata.net [27.05.19.39]",
  "tbr2.n54gthm.ip.gothamisp2.net [01.03.19.40]",
  "cr2.n54gthm.ip.gothamisp2.net [58.12.19.41]",
  "cr2.gthmx.ip.gothamisp2.net [140.10.19.48]",
  "cr1.gthmx.ip.gothamisp2.net [405.03.19.87]",
  "cr3.gthmx.ip.gothamisp3.net [16.04.19.43]",
  "corrections.arkham.gov [258.10.19.74]",
  "",
  ">> rerouting...",
  ">> ssh upstanding-citizen@rataalada.com"
];

/** Example tests. You can replace these with your actual riddles. */
const test1 = [
  { question: "WHAT IS BLACK AND BLUE AND DEAD ALL OVER?", answer: "BATMAN", hint: "A DIRECT REFERENCE..." },
  { question: "THOSE WHO MAKE ME ARE LIKELY TO BREAK ME.", answer: "THE LAW", hint: "CREATED BY LEGISLATORS..." },
  { question: "I CAN BE EASY OR A DEAD END. CAREFUL WHEN YOU CROSS ME.", answer: "STREET", hint: "SOMETHING YOU TRAVEL ON..." }
];
const test2 = [
  { question: "THE MORE I'M REVEALED, THE LESS I EXIST. WHAT AM I?", answer: "SECRET", hint: "ONCE YOU SAY IT OUT LOUD..." },
  { question: "IF YOU ARE JUSTICE, PLEASE DO NOT LIE. WHAT IS THE PRICE FOR YOUR BLIND EYE?", answer: "BRIBE", hint: "EVERY CORRUPT OFFICIAL..." },
  { question: "I AM FIRST A FRAUD OR A TRICK. WHAT AM I?", answer: "CONFUSION", hint: "UP TO YOUR MISINTERPRETATION." }
];
const test3 = [
  { question: "UNDERNEATH THE BRIDGE THE TARP HAS SPRUNG A LEAK...", answer: "FEELINGS", hint: "A LYRICAL REFERENCE..." },
  { question: "WHEN THE GAME IS ON, WHAT CORRUPTS ABSOLUTELY?", answer: "POWER", hint: "ABSOLUTE POWER CORRUPTS..." },
  { question: "WITHOUT A DOUBT, GOTHAM'S ELITE LIVE HERE—BETWEEN LIGHT AND DARK.", answer: "THE SHADOWS", hint: "THINK 'LIVE IN THE SHADOWS'." }
];
const test4 = [
  { question: "IT STARTS WITH AN 'E' AND HAS ONLY ONE LETTER IN IT. WHAT IS IT?", answer: "ENVELOPE", hint: "IT LITERALLY CONTAINS 'ONE LETTER'." },
  { question: "FEAR HE WHO HIDES BEHIND...WHAT?", answer: "MASK", hint: "A FACE COVERING..." },
  { question: "ONCE YOU'VE BEEN SET UP, IT HITS YOU AT THE END STRAIGHT ON.", answer: "PUNCHLINE", hint: "A JOKE STRUCTURE..." },
  { question: "TO WIT: A WILD CARD IN THE TRUEST SENSE.", answer: "JOKER", hint: "LIKE A CERTAIN CLOWN VILLAIN..." }
];
const tests = [test1, test2, test3, test4];

/** Random “correct” or “wrong” lines, removed once used to avoid repetition. */
let correctResponses = [
  "YOU ARE SMARTER THAN I THOUGHT YOU'D BE. TRY THIS NEXT RIDDLE.",
  "YOU ARE CORRECT AGAIN. I AM IMPRESSED.",
  "ANOTHER TRUTH UNMASKED. ONTO THE NEXT ONE.",
  "YOU MAY HAVE GOTTEN THIS ONE, BUT I HOLD ALL THE ANSWERS..."
];
let wrongResponses = [
  "YOU'RE CLEARLY NOT AS SMART AS I EXPECTED. TRY AGAIN.",
  "STOP GUESSING AND START THINKING—AGAIN!",
  "YOU GOT IT WRONG. WOULD YOU CARE TO TRY AGAIN?",
  "HOW WILL GOTHAM BE SAVED WITH ANSWERS LIKE THAT?",
  "THINK HARDER. YOU'RE NOT UNMASKING THE TRUTH YET."
];

function pickAndRemove(arr) {
  if (arr.length === 0) return "NO MORE RESPONSES AVAILABLE.";
  const idx = Math.floor(Math.random() * arr.length);
  const choice = arr[idx];
  arr.splice(idx, 1);
  return choice;
}

/** Player stats & test flow. */
let health = 100;
let popularity = 50;
let currentTestIndex = 0;
let currentRiddleIndex = 0;
let points = 0;
let rounds = 0;
const maxRounds = 6;      // max attempts
const neededPoints = 3;   // need 3 correct

// DOM references
const introScreen    = document.getElementById("intro-screen");
const introText      = document.getElementById("intro-text");
const terminalOutput = document.getElementById("terminal-output");

/****************************************************
 *  TYPEWRITER EFFECT
 ****************************************************/
function typeToTerminal(text, callback, speed = 30) {
  let i = 0;
  const line = document.createElement("div");
  line.textContent = "";
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;

  const timer = setInterval(() => {
    line.textContent += text[i];
    i++;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    if (i >= text.length) {
      clearInterval(timer);
      if (callback) callback();
    }
  }, speed);
}

/** Quick print with no typewriter. */
function printToTerminal(text) {
  const div = document.createElement("div");
  div.textContent = text;
  terminalOutput.appendChild(div);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

/** Animate the intro lines in #intro-text (for boot/traceroute). */
function typeLinesInIntro(lines, onComplete, delay=700) {
  let idx = 0;
  function nextLine() {
    if (idx < lines.length) {
      introText.textContent += lines[idx] + "\n";
      idx++;
      setTimeout(nextLine, delay);
    } else {
      setTimeout(onComplete, 800);
    }
  }
  nextLine();
}

/**
 * Step 1: Boot lines
 */
function playBootSequence() {
  typeLinesInIntro(bootSequenceLines, () => {
    introText.textContent = "";
    playTraceroute();
  });
}

/**
 * Step 2: Traceroute
 */
function playTraceroute() {
  typeLinesInIntro(tracerouteLines, () => {
    introText.textContent = "";
    introScreen.classList.add("hidden");
    startGamePrompt();
  });
}

/** Create inline “<?> + input” prompt. */
function createInlinePrompt(callback) {
  const container = document.createElement("div");
  container.className = "inline-prompt";

  const blinkSpan = document.createElement("span");
  blinkSpan.className = "blinking-cursor";
  blinkSpan.textContent = "<?>";
  container.appendChild(blinkSpan);

  const inputField = document.createElement("input");
  container.appendChild(inputField);

  terminalOutput.appendChild(container);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  inputField.focus();

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const userCmd = inputField.value.trim();
      container.innerHTML = `> ${userCmd}`;
      callback(userCmd);
    }
  });
}

/**
 * 1) Y/N to start the entire game
 */
function startGamePrompt() {
  printToTerminal(">> I'VE BEEN EXPECTING YOU. WANT TO PLAY A GAME?");
  printToTerminal(">> PROCEED? [Y/N]");
  createInlinePrompt((cmd) => {
    handleYesNo(cmd);
  });
}

/**
 * Y/N logic
 */
function handleYesNo(userCmd) {
  const c = userCmd.toLowerCase();
  if (c === "y" || c === "yes") {
    printToTerminal(">> EXCELLENT. LET’S BEGIN...");
    currentTestIndex = 0;  // start at test #1
    setTimeout(() => startTest(currentTestIndex), 1000);
  } else if (c === "n" || c === "no") {
    printToTerminal(">> VERY WELL. PERHAPS ANOTHER TIME...");
  } else {
    printToTerminal(">> PLEASE TYPE 'Y' OR 'N'.");
    createInlinePrompt((again) => handleYesNo(again));
  }
}

/** Begin a specific test. */
function startTest(testIdx) {
  currentRiddleIndex = 0;
  points = 0;
  rounds = 0;
  printToTerminal(`\n>> STARTING TEST #${testIdx + 1}...`);
  setTimeout(showRiddle, 1000);
}

/** Show the current riddle (with typewriter). */
function showRiddle() {
  if (rounds >= maxRounds && points < neededPoints) {
    return doGameOver();
  }
  if (points >= neededPoints) {
    return doVictory();
  }
  const test = tests[currentTestIndex];
  if (!test) {
    printToTerminal(">> NO MORE TESTS AVAILABLE.");
    return;
  }
  if (currentRiddleIndex >= test.length) {
    if (points >= neededPoints) {
      doVictory();
    } else {
      doGameOver();
    }
    return;
  }

  const riddleObj = test[currentRiddleIndex];
  typeToTerminal(">> " + riddleObj.question, () => {
    createInlinePrompt((answer) => handleRiddleAnswer(answer));
  });
}

/** Evaluate user's answer. */
function handleRiddleAnswer(ans) {
  rounds++;
  const test = tests[currentTestIndex];
  const riddleObj = test[currentRiddleIndex];
  const correctAns = riddleObj.answer.toLowerCase().trim();
  const userAns    = ans.toLowerCase().trim();

  if (rounds > maxRounds && points < neededPoints) {
    return doGameOver();
  }

  if (userAns === correctAns) {
    points++;
    popularity += 10;

    if (points >= neededPoints) {
      typeToTerminal(">> CORRECT! YOU’VE HIT THE REQUIRED NUMBER OF RIGHT ANSWERS.", () => {
        setTimeout(doVictory, 800);
      });
    } else {
      const c = pickAndRemove(correctResponses);
      typeToTerminal(">> " + c, () => {
        currentRiddleIndex++;
        setTimeout(showRiddle, 800);
      });
    }
  } else if (userAns === "hint") {
    typeToTerminal(">> HINT: " + riddleObj.hint, () => {
      createInlinePrompt((again) => handleRiddleAnswer(again));
    });
  } else {
    // Wrong
    health -= 10;
    popularity -= 5;

    if (rounds >= maxRounds && points < neededPoints) {
      return doGameOver();
    }
    const w = pickAndRemove(wrongResponses);
    typeToTerminal(">> " + w, () => {
      setTimeout(showRiddle, 800);
    });
  }
}

/** Game Over sequence. */
function doGameOver() {
  typeToTerminal("\n>> YOU HAVE FAILED TO SAVE GOTHAM.", () => {
    typeToTerminal(">> WHAT IS BLACK AND BLUE AND DEAD ALL OVER? THE BATMAN.", () => {
      typeToTerminal("\n>> BAD MOVE. GOTHAM HAS PERISHED.", () => {
        typeToTerminal("\n>> GAME OVER <?>");
      });
    });
  });
}

/**
 * Victory => user got enough correct.
 * Show classified doc link, then ask [Y/N] to continue or exit.
 */
function doVictory() {
  typeToTerminal("\n>> YOU’VE PASSED THIS CHALLENGE...", () => {
    typeToTerminal(">> [ REWARD UNLOCKED ]", () => {
      typeToTerminal(`\nHEALTH: ${health}\nPOPULARITY: ${popularity}`, () => {
        // Provide a link to a “classified doc” for this test
        provideCaseFileLink(currentTestIndex, () => {
          // After they see the link, prompt if they want next test
          typeToTerminal("\n>> VIEW THE DOCUMENT. WHEN YOU’RE READY, TYPE [Y/N] TO PROCEED...", () => {
            createInlinePrompt((cmd) => {
              const c = cmd.toLowerCase();
              if (c === "y" || c === "yes") {
                // Clear screen & move on
                terminalOutput.innerHTML = "";
                if (currentTestIndex < tests.length - 1) {
                  currentTestIndex++;
                  startTest(currentTestIndex);
                } else {
                  typeToTerminal(">> YOU’VE COMPLETED ALL THE TESTS. GOTHAM THANKS YOU!");
                }
              } else {
                // End
                typeToTerminal(">> VERY WELL. PERHAPS ANOTHER TIME...");
              }
            });
          });
        });
      });
    });
  });
}

/**
 * Provide a link to a “classified doc” for each test.
 * Then use the callback once we've appended it.
 */
function provideCaseFileLink(testIdx, callback) {
  // You can have a separate doc for each test (like classified1.html, classified2.html, etc.)
  const docLink = `classified${(testIdx + 7)/2}.html`; // e.g. "classified1.html"
  
  const line = document.createElement("div");
  line.innerHTML = `\n>> Download GCPD File for Test #${testIdx + 1}: 
                    <a href="${docLink}" target="_blank">Case File #${testIdx + 45}</a>`;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;

  if (callback) callback();
}

/** On load => Boot + Traceroute => Start Game Prompt */
window.addEventListener("DOMContentLoaded", () => {
  playBootSequence();
});
