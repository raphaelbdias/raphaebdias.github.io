/*********************************************
 * Combined Rataalada-Style
 *  - Boot -> Clear -> Traceroute -> Clear -> Hide Intro
 *  - Then multi-tests with inline input in main terminal
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
  
  /**
   * “Tests” data: each test is an array of 3 riddles (question, answer, hint).
   * Add or remove tests as needed!
   */
  const tests = [
    // Test #1
    [
      {
        question: "WHAT IS BLACK AND BLUE AND DEAD ALL OVER?",
        answer: "BATMAN",
        hint: "A DIRECT REFERENCE TO THE MOVIE, USUALLY TAUNTING THE CAPED CRUSADER."
      },
      {
        question: "THOSE WHO MAKE ME ARE LIKELY TO BREAK ME.",
        answer: "THE LAW",
        hint: "CREATED BY LEGISLATORS WHO OFTEN FAIL TO ABIDE BY IT."
      },
      {
        question: "I CAN BE EASY OR A DEAD END. CAREFUL WHEN YOU CROSS ME.",
        answer: "STREET",
        hint: "SOMETHING YOU TRAVEL ON EVERY DAY—SOMETIMES DANGEROUS."
      }
    ],
    // Test #2
    [
      {
        question: "IT SINKS AND SWIMS. IT CAN BE ROTTEN EVEN WHEN IT'S ALL DRESSED UP.",
        answer: "ICEBERG",
        hint: "THINK: ROTTEN ON THE OUTSIDE, OR TOTALLY FROZEN…"
      },
      {
        question: "THE MORE I'M REVEALED, THE LESS I EXIST.",
        answer: "SECRET",
        hint: "ONCE YOU TELL IT, IT DISAPPEARS."
      },
      {
        question: "PAYBACK COMES TO ALL WHO ACCEPT ONE.",
        answer: "BRIBE",
        hint: "COMMON IN GOTHAM’S CORRUPT POLITICS."
      }
    ],
    // Test #3
    [
      {
        question: "UNDERNEATH THE BRIDGE THE TARP HAS SPRUNG A LEAK. IT'S OKAY TO EAT FISH BECAUSE THEY DON'T HAVE ANY... WHAT?",
        answer: "FEELINGS",
        hint: "A LYRICAL REFERENCE…"
      },
      {
        question: "WHEN THE GAME IS ON, WHAT CORRUPTS ABSOLUTELY?",
        answer: "POWER",
        hint: "A FAMOUS SAYING: ABSOLUTE POWER CORRUPTS ABSOLUTELY."
      },
      {
        question: "WITHOUT A DOUBT, GOTHAM'S ELITE LIVE HERE―BETWEEN LIGHT AND DARK.",
        answer: "THE SHADOWS",
        hint: "THINK OF THE LINE: 'LIVE IN THE SHADOWS.'"
      }
    ]
    // Add more tests (#4, #5, etc.) if you like
  ];
  
  // We’ll track the chosen test (array of 3 riddles)
  let chosenTest = null;
  let currentRiddleIndex = 0;  // 0..2 for each test
  let awaitingYesNo = false;   // Are we awaiting user’s Y/N to play?
  let awaitingTestChoice = false; // Are we awaiting the user to pick a test?
  
  // DOM references
  const introScreen    = document.getElementById("intro-screen");
  const introText      = document.getElementById("intro-text");
  const terminalOutput = document.getElementById("terminal-output");
  
  /** 
   * Type lines in #intro-text line-by-line
   */
  function typeLinesInIntro(lines, onComplete, delay = 700) {
    let idx = 0;
    function printNextLine() {
      if (idx < lines.length) {
        introText.textContent += lines[idx] + "\n";
        idx++;
        setTimeout(printNextLine, delay);
      } else {
        // Done
        setTimeout(onComplete, 800);
      }
    }
    printNextLine();
  }
  
  /**
   * Step A: Boot lines, then clear
   */
  function playBootSequence() {
    typeLinesInIntro(bootSequenceLines, () => {
      introText.textContent = "";
      playTraceroute();
    });
  }
  
  /**
   * Step B: Traceroute, then hide the intro
   */
  function playTraceroute() {
    typeLinesInIntro(tracerouteLines, () => {
      introText.textContent = "";
      introScreen.classList.add("hidden");
      // Now prompt user: Y/N?
      startGamePrompt();
    });
  }
  
  /**
   * Print text in #terminal-output
   */
  function printToTerminal(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
  
  /**
   * Create an inline prompt: “<?>” plus <input>, 
   * callback is triggered on Enter with the user’s typed command.
   */
  function createInlinePrompt(promptLabel, callback) {
    const container = document.createElement("div");
    container.className = "inline-prompt";
  
    if (promptLabel) {
      const labelSpan = document.createElement("span");
      labelSpan.textContent = promptLabel;
      container.appendChild(labelSpan);
    }
  
    const blinkSpan = document.createElement("span");
    blinkSpan.className = "blinking-cursor";
    blinkSpan.textContent = "<?>";
    container.appendChild(blinkSpan);
  
    const inputField = document.createElement("input");
    inputField.type = "text";
    container.appendChild(inputField);
  
    terminalOutput.appendChild(container);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    inputField.focus();
  
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const userCmd = inputField.value;
        container.innerHTML = `> ${userCmd}`;
        callback(userCmd.trim());
      }
    });
  }
  
  /**
   * Show the initial Y/N “WANT TO PLAY?”
   */
  function startGamePrompt() {
    printToTerminal(">> I'VE BEEN EXPECTING YOU. WANT TO PLAY A GAME?");
    printToTerminal(">> PROCEED? [Y/N]");
    createInlinePrompt("", (userCmd) => {
      handleYesNo(userCmd);
    });
    awaitingYesNo = true;
  }
  
  /**
   * Handle the user’s Y/N
   */
  function handleYesNo(cmd) {
    const c = cmd.toLowerCase();
    if (c === "y" || c === "yes") {
      printToTerminal(">> EXCELLENT. LET’S BEGIN...");
      awaitingYesNo = false;
      // Now ask: which test do you want?
      printToTerminal(`>> WE HAVE ${tests.length} DIFFERENT CHALLENGES. CHOOSE A NUMBER (1 - ${tests.length}):`);
      createInlinePrompt("", (testChoice) => {
        handleTestChoice(testChoice);
      });
      awaitingTestChoice = true;
    } else if (c === "n" || c === "no") {
      printToTerminal(">> VERY WELL. PERHAPS ANOTHER TIME...");
      awaitingYesNo = false;
    } else {
      printToTerminal(">> PLEASE TYPE 'Y' OR 'N'.");
      createInlinePrompt("", (again) => handleYesNo(again));
    }
  }
  
  /**
   * Let user pick a test number
   */
  function handleTestChoice(cmd) {
    const choice = parseInt(cmd, 10); // convert to number
    if (isNaN(choice) || choice < 1 || choice > tests.length) {
      printToTerminal(">> INVALID CHOICE. PLEASE ENTER A VALID NUMBER.");
      createInlinePrompt("", (again) => handleTestChoice(again));
    } else {
      // valid
      printToTerminal(`>> YOU CHOSE TEST #${choice}. GOOD LUCK...`);
      awaitingTestChoice = false;
      chosenTest = tests[choice - 1]; // because array is zero-based
      currentRiddleIndex = 0;
      // show first riddle
      setTimeout(() => showRiddle(currentRiddleIndex), 800);
    }
  }
  
  /**
   * Show the current riddle from chosenTest
   */
  function showRiddle(index) {
    if (!chosenTest) return;
    if (index >= chosenTest.length) {
      // done all riddles in this test
      printToTerminal(">> YOU’VE COMPLETED THIS CHALLENGE. TAKE YOUR REWARD...");
      printToTerminal(">> [ REWARD UNLOCKED ]");
      printToTerminal(">> COME BACK SOON FOR MORE CHALLENGES!");
      return;
    }
    const r = chosenTest[index];
    printToTerminal(">> " + r.question);
    createInlinePrompt("", (answer) => handleRiddleAnswer(answer));
  }
  
  /**
   * Check the user’s answer for the current riddle
   */
  function handleRiddleAnswer(answer) {
    const riddleObj = chosenTest[currentRiddleIndex];
    const correct   = riddleObj.answer.toLowerCase().trim();
    const userAns   = answer.toLowerCase().trim();
  
    if (userAns === correct) {
      printToTerminal(">> CORRECT!");
      currentRiddleIndex++;
      setTimeout(() => showRiddle(currentRiddleIndex), 800);
    } else if (userAns === "hint") {
      printToTerminal(">> HINT: " + riddleObj.hint);
      createInlinePrompt("", (again) => handleRiddleAnswer(again));
    } else {
      printToTerminal(">> WRONG. TYPE 'HINT' OR TRY AGAIN.");
      createInlinePrompt("", (again) => handleRiddleAnswer(again));
    }
  }
  
  /**
   * On DOM load, do the boot + traceroute + main prompt
   */
  window.addEventListener("DOMContentLoaded", () => {
    playBootSequence();
  });
  