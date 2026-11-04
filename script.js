
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

