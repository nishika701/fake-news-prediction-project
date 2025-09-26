// Function for the Fake News Detector
async function checkNews() {
    const input = document.getElementById("newsInput").value.trim();
    const resultDiv = document.getElementById("result");

    // Clear previous results and show loading state
    resultDiv.textContent = '⏳ Checking...';
    resultDiv.style.color = '#555';

    if (!input) {
        resultDiv.textContent = "⚠️ Please enter some text!";
        resultDiv.style.color = "red";
        return;
    }

    try {
        const response = await fetch("https://news-predictor.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: input })
        });

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.prediction) {
            resultDiv.textContent = `Prediction: ${data.prediction}`;
            resultDiv.style.color = (data.prediction === "FAKE") ? "red" : "green";
        } else {
            resultDiv.textContent = "❌ Error: " + (data.error || "Unknown error");
            resultDiv.style.color = "orange";
        }
    } catch (err) {
        resultDiv.textContent = "🚨 Server error. Try again later!";
        resultDiv.style.color = "red";
        console.error("Fetch error:", err); // Log the error for debugging
    }
}

// Quiz functionality - wrapped in DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const resultsContainer = document.getElementById('results');

    // Define the correct answers and their explanations
    const correctAnswers = {
        q1: {
            answer: 'A',
            explanation: 'Emotional language, sensationalism, and clickbait headlines are common tactics used to attract clicks and shares, regardless of the truth.'
        },
        q2: {
            answer: 'B',
            explanation: 'Verifying information with multiple credible sources (like major news outlets, government websites, or academic institutions) is the most effective way to confirm its accuracy.'
        },
        q3: {
            answer: 'C',
            explanation: 'Fake news is often created to manipulate public opinion or to generate revenue through advertising, not to inform or entertain in a legitimate way.'
        },
        q4: {
            answer: 'B',
            explanation: 'Excessive punctuation and all-caps headlines are hallmarks of sensationalized and untrustworthy content, designed to provoke an emotional response rather than to convey neutral facts.'
        },
        q5: {
            answer: 'C',
            explanation: 'Always verify information before sharing. A well-known person\'s opinion can be wrong, and basing a share on "likes" is a recipe for spreading misinformation.'
        }
    };

    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let score = 0;
            const userAnswers = {};

            const formData = new FormData(quizForm);
            for (const [key, value] of formData.entries()) {
                userAnswers[key] = value;
            }

            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'block';

            const feedbackList = document.createElement('ul');

            // Check answers, provide feedback, and build the list
            for (const question in correctAnswers) {
                const correctAnswer = correctAnswers[question].answer;
                const userChoice = userAnswers[question];
                const isCorrect = userChoice && userChoice === correctAnswer;

                const listItem = document.createElement('li');
                const questionNumber = question.replace('q', '');
                
                let feedbackText = `<strong>Question ${questionNumber}:</strong> `;

                if (isCorrect) {
                    score++;
                    feedbackText += `<span class="correct">✅ Correct!</span><br>`;
                } else {
                    feedbackText += `<span class="incorrect">❌ Incorrect.</span> The correct answer was ${correctAnswer}.<br>`;
                }

                feedbackText += `<small>${correctAnswers[question].explanation}</small>`;
                listItem.innerHTML = feedbackText;
                feedbackList.appendChild(listItem);
            }

            const scoreParagraph = document.createElement('p');
            scoreParagraph.innerHTML = `You scored ${score} out of 5!`;
            scoreParagraph.style.fontSize = '1.2em';
            scoreParagraph.style.fontWeight = 'bold';
            
            resultsContainer.appendChild(scoreParagraph);
            resultsContainer.appendChild(feedbackList);
        });
    }
});