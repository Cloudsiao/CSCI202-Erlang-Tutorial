
const matchingSteps = {
    prolog: [
        ["Initial Query",
         "person(X, 25) = person(john, Y).",
         "Both X and Y are unbound."],

        ["First Argument",
         "X = john",
         "Prolog binds X to john."],

        ["Second Argument",
         "Y = 25",
         "Prolog binds Y to 25."],

        ["Success",
         "X = john, Y = 25",
         "Both terms successfully unify."]
    ],

    erlang: [
        ["Initial Expression",
         "{X, 25} = {john, 25}.",
         "Erlang evaluates the right-hand value."],

        ["First Element",
         "X = john",
         "The pattern binds X to john."],

        ["Second Element",
         "25 = 25",
         "The literals match."],

        ["Success",
         "X = john",
         "The expression succeeds."]
    ]
};

const languageChoice =
    document.getElementById("language-choice");
const matchingTitle =
    document.getElementById("matching-title");
const matchingExpression =
    document.getElementById("matching-expression");
const matchingExplanation =
    document.getElementById("matching-explanation");
const previousButton =
    document.getElementById("matching-prev");
const nextButton =
    document.getElementById("matching-next");

if (languageChoice && matchingTitle) {
    let currentStep = 0;

    function renderMatching() {
        const steps = matchingSteps[languageChoice.value];
        const [title, expression, explanation] =
            steps[currentStep];

        matchingTitle.textContent = title;
        matchingExpression.textContent = expression;
        matchingExplanation.textContent = explanation;

        previousButton.disabled = currentStep === 0;
        nextButton.textContent =
            currentStep === steps.length - 1
                ? "Restart"
                : "Next Step";
    }

    languageChoice.addEventListener("change", () => {
        currentStep = 0;
        renderMatching();
    });

    previousButton.addEventListener("click", () => {
        currentStep--;
        renderMatching();
    });

    nextButton.addEventListener("click", () => {
        const steps = matchingSteps[languageChoice.value];
        currentStep = (currentStep + 1) % steps.length;
        renderMatching();
    });

    renderMatching();
}


// Backtracking vs. function-clause selection

const executionExamples = {
    prolog: {
        program: `color(red).
color(blue).
color(green).

?- color(X).`,

        steps: [
            {
                title: "Start Query",
                code: "?- color(X).",
                explanation:
                    "Prolog searches for a fact that satisfies color(X)."
            },
            {
                title: "First Solution",
                code: "color(red).\nX = red",
                explanation:
                    "The first fact succeeds. X is bound to red."
            },
            {
                title: "Backtrack",
                code: "X = red ;",
                explanation:
                    "The user requests another answer. Prolog returns " +
                    "to its choice point and undoes the binding X = red."
            },
            {
                title: "Second Solution",
                code: "color(blue).\nX = blue",
                explanation:
                    "The next fact succeeds. X is now bound to blue."
            },
            {
                title: "Backtrack Again",
                code: "X = blue ;",
                explanation:
                    "Prolog undoes the binding and tries another fact."
            },
            {
                title: "Third Solution",
                code: "color(green).\nX = green",
                explanation:
                    "The third fact succeeds. X is bound to green."
            },
            {
                title: "Search Exhausted",
                code: "X = green ;\nfalse.",
                explanation:
                    "No further facts are available, so the search ends."
            }
        ]
    },

    erlang: {
        program: `color(1) -> red;
color(2) -> blue;
color(3) -> green.

color(2).`,

        steps: [
            {
                title: "Function Call",
                code: "color(2).",
                explanation:
                    "Erlang evaluates the argument, which is 2."
            },
            {
                title: "Check First Clause",
                code: "color(1) -> red;",
                explanation:
                    "1 does not match 2, so Erlang checks the next clause."
            },
            {
                title: "Check Second Clause",
                code: "color(2) -> blue;",
                explanation:
                    "The pattern matches 2. Erlang selects this clause."
            },
            {
                title: "Return Result",
                code: "blue",
                explanation:
                    "The function returns blue. No backtracking occurs."
            }
        ]
    }
};

const traceLanguage =
    document.getElementById("trace-language");

if (traceLanguage) {
    const traceProgram =
        document.getElementById("trace-program");
    const traceProgress =
        document.getElementById("trace-progress");
    const traceTitle =
        document.getElementById("trace-title");
    const traceCode =
        document.getElementById("trace-code");
    const traceExplanation =
        document.getElementById("trace-explanation");
    const tracePrev =
        document.getElementById("trace-prev");
    const traceNext =
        document.getElementById("trace-next");

    let traceStep = 0;

    function renderTrace() {
        const example = executionExamples[traceLanguage.value];
        const steps = example.steps;
        const current = steps[traceStep];

        traceProgram.textContent = example.program;
        traceProgress.textContent =
            `Step ${traceStep + 1} of ${steps.length}`;
        traceTitle.textContent = current.title;
        traceCode.textContent = current.code;
        traceExplanation.textContent = current.explanation;

        tracePrev.disabled = traceStep === 0;
        traceNext.textContent =
            traceStep === steps.length - 1
                ? "Restart"
                : "Next Step";
    }

    traceLanguage.addEventListener("change", () => {
        traceStep = 0;
        renderTrace();
    });

    tracePrev.addEventListener("click", () => {
        if (traceStep > 0) traceStep--;
        renderTrace();
    });

    traceNext.addEventListener("click", () => {
        const steps = executionExamples[traceLanguage.value].steps;
        traceStep = (traceStep + 1) % steps.length;
        renderTrace();
    });

    renderTrace();
}


// Akka vs Erlang supervision demonstration

const supervisionSystem =
    document.getElementById("supervision-system");

if (supervisionSystem) {
    const strategySelect =
        document.getElementById("supervision-strategy");
    const supervisorLabel =
        document.getElementById("supervisor-label");
    const workers =
        document.getElementById("supervision-workers");
    const explanation =
        document.getElementById("supervision-explanation");
    const result =
        document.getElementById("supervision-result");
    const failButton =
        document.getElementById("supervision-fail");
    const resetButton =
        document.getElementById("supervision-reset");

    const strategies = {
        erlang: [
            ["one_for_one", "One for one"],
            ["one_for_all", "One for all"],
            ["rest_for_one", "Rest for one"]
        ],
        akka: [
            ["stop", "Stop (Typed default)"],
            ["restart", "Restart"],
            ["resume", "Resume"]
        ]
    };

    const outcomes = {
        one_for_one: {
            states: ["Running", "Restarted", "Running"],
            message: "Only Worker B is restarted."
        },
        one_for_all: {
            states: ["Restarted", "Restarted", "Restarted"],
            message: "All workers are restarted."
        },
        rest_for_one: {
            states: ["Running", "Restarted", "Restarted"],
            message: "Worker B and later-started Worker C restart."
        },
        stop: {
            states: ["Running", "Stopped", "Running"],
            message: "Child B stops. Its parent remains active."
        },
        restart: {
            states: ["Running", "Restarted", "Running"],
            message: "Child B restarts with fresh behavior state."
        },
        resume: {
            states: ["Running", "Resumed", "Running"],
            message: "Child B resumes without reinitialization."
        }
    };

    let failed = false;

    function renderSupervision() {
        const system = supervisionSystem.value;
        const strategy = strategySelect.value;

        supervisorLabel.textContent =
            system === "erlang"
                ? "Dedicated OTP Supervisor"
                : "Akka Parent Actor";

        const states = failed
            ? outcomes[strategy].states
            : ["Running", "Running", "Running"];

        workers.textContent =
            states.map((state, i) =>
                `Worker ${"ABC"[i]}: ${state}`
            ).join("\n");

        explanation.textContent =
            system === "erlang"
                ? "An OTP supervisor applies a restart strategy."
                : "Akka Typed applies the configured behavior strategy.";

        result.textContent = failed
            ? outcomes[strategy].message
            : "All workers are running. Simulate a failure.";

        failButton.disabled = failed;
    }

    function changeSystem() {
        const system = supervisionSystem.value;

        strategySelect.innerHTML = "";

        strategies[system].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            strategySelect.appendChild(option);
        });

        failed = false;
        renderSupervision();
    }

    supervisionSystem.addEventListener("change", changeSystem);

    strategySelect.addEventListener("change", () => {
        failed = false;
        renderSupervision();
    });

    failButton.addEventListener("click", () => {
        failed = true;
        renderSupervision();
    });

    resetButton.addEventListener("click", () => {
        failed = false;
        renderSupervision();
    });

    changeSystem();
}
