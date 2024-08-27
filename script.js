// Event listener to show quiz on page load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showQuiz();  // Initialize with a random quiz question
});

// Event listeners for UI interaction
function setupEventListeners() {
    // Buttons to toggle learning module and oxidation simulator visibility
    const learningModuleBtn = document.querySelector('.learning-module-btn');
    const completeLearningModuleBtn = document.querySelector('.complete-learning-module-btn');
    
    if (learningModuleBtn) {
        learningModuleBtn.addEventListener('click', function() {
            document.querySelector('.os-container').style.display = 'none'; // Hide the oxidation simulator
            document.getElementById('learningModule').style.display = 'block'; // Show the learning module
            document.getElementById('quizContainer').style.display = 'block'; // Show the quiz container
        });
    }

    if (completeLearningModuleBtn) {
        completeLearningModuleBtn.addEventListener('click', function() {
            document.getElementById('learningModule').style.display = 'none'; // Hide the learning module
            document.getElementById('quizContainer').style.display = 'none'; // Hide the quiz container
            document.querySelector('.os-container').style.display = 'block'; // Show the oxidation simulator again
        });
    }

    // Mapping buttons to their respective example element IDs for toggling visibility
    const exampleButtons = {
        'showLipolysisExample': 'lipolysis-example',
        'showOxidationExample': 'oxidation-example',
        'showFlavorExample': 'flavor-example',
        'showAromaExample': 'aroma-example',
        'showStabilityExample': 'stability-example',
    };

    Object.keys(exampleButtons).forEach(id => {
        const button = document.getElementById(id);
        if (button) { // Check if the button exists to avoid null errors
            button.addEventListener('click', () => toggleVisibility(exampleButtons[id]));
        }
    });

    // Slider and checkbox interactions for the oxidation simulator
    const timeSlider = document.getElementById('time-slider');
    const temperatureInput = document.getElementById('temperature');
    const airExposureCheckbox = document.getElementById('air-exposure');

    if (timeSlider) {
        timeSlider.addEventListener('input', updateOxidation);
    }

    if (temperatureInput) {
        temperatureInput.addEventListener('input', updateOxidation);
    }

    if (airExposureCheckbox) {
        airExposureCheckbox.addEventListener('change', updateOxidation);
    }
}

function toggleVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element) { // Check if the element exists to avoid null errors
        element.classList.toggle('hidden');
    }
}

// Quiz Data
const quizData = [
    {
        question: "What happens to lipids when exposed to high temperatures?",
        options: ["They remain stable", "They oxidize faster", "They freeze", "They evaporate"],
        correct: "They oxidize faster"
    },
    {
        question: "How does air exposure affect lipid oxidation?",
        options: ["Slows down oxidation", "Speeds up oxidation", "No effect", "Reverses oxidation"],
        correct: "Speeds up oxidation"
    },
    {
        question: "Why is it important to store lipids in cool places?",
        options: ["To speed up oxidation", "To keep them fresh", "To prevent freezing", "To prevent oxidation"],
        correct: "To prevent oxidation"
    },
    {
        question: "What is the relationship between time and lipid oxidation?",
        options: ["No relationship", "More time, less oxidation", "More time, more oxidation", "Time stops oxidation"],
        correct: "More time, more oxidation"
    },
    {
        question: "Can oxidation occur if lipids are kept in a vacuum?",
        options: ["Yes", "No", "Only with light", "Only with heat"],
        correct: "No"
    },
    {
        question: "How does the presence of oxygen influence lipid stability?",
        options: ["It stabilizes lipids", "It has no effect", "It causes oxidation", "It prevents oxidation"],
        correct: "It causes oxidation"
    },
    {
        question: "What role does light play in lipid oxidation?",
        options: ["No role", "Prevents oxidation", "Slows oxidation", "Accelerates oxidation"],
        correct: "Accelerates oxidation"
    },
    {
        question: "What are the signs that a lipid is oxidizing?",
        options: ["It freezes", "It turns rancid", "It evaporates", "It melts"],
        correct: "It turns rancid"
    }
];

// Show quiz with dynamically generated options
function showQuiz() {
    const quiz = getRandomQuiz();
    const quizQuestionElement = document.getElementById('quizQuestion');
    const quizOptionsContainer = document.getElementById('quizOptions');

    quizQuestionElement.textContent = quiz.question;
    quizOptionsContainer.innerHTML = '';

    quiz.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option, quiz.correct);
        quizOptionsContainer.appendChild(button);
    });

    document.getElementById('quiz').classList.remove('hidden');
}

// Select a random quiz question
function getRandomQuiz() {
    const randomIndex = Math.floor(Math.random() * quizData.length);
    return quizData[randomIndex];
}

// Function to check user's answer and provide feedback
function checkAnswer(selectedOption, correctAnswer) {
    const feedback = document.getElementById('quizFeedback');

    if (selectedOption === correctAnswer) {
        feedback.textContent = 'Correct!';
    } else {
        feedback.textContent = 'Incorrect. Try again!';
    }
}

// Reset the simulation to its initial state
function resetSimulation() {
    // Reset sliders and inputs
    document.getElementById('time-slider').value = 0;
    document.getElementById('temperature').value = 20;
    document.getElementById('air-exposure').checked = false;

    // Reset displayed day
    document.getElementById('current-day').textContent = 'Day: 0';

    // Reset lipid color and oxidation result
    const lipid = document.querySelector('.lipid');
    lipid.style.backgroundColor = '#FFFF66';  // Reset to very low oxidation color
    document.getElementById('oxidation-result').textContent = 'Oxidation Level: Very Low';

    // Reset feedback message
    document.getElementById('feedback-message').textContent = 'Move the sliders or adjust the settings to see how oxidation changes!';

    // Reset chart data
    oxidationChart.data.datasets[0].data.fill(0);  // Reset all data points to 0
    oxidationChart.update();
}

// Open and close the popup
document.getElementById('openPopup').addEventListener('click', function() {
    document.getElementById('lipidPopup').classList.remove('hidden');
    document.getElementById('lipidPopup').style.display = 'block';
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('lipidPopup').style.display = 'none';
});

// Update oxidation based on slider and checkbox values
function updateOxidation() {
    const timeSlider = document.getElementById('time-slider');
    const time = parseInt(timeSlider.value);
    const temperature = parseInt(document.getElementById('temperature').value);
    const airExposure = document.getElementById('air-exposure').checked;
    const lipid = document.querySelector('.lipid');
    const oxidationResult = document.getElementById('oxidation-result');

    let oxidationLevel = 'Very Low';
    let lipidColor = '#FFFF66';  // Light Yellow for very low oxidation
    let oxidationValue = 0;

    // Base oxidation levels on time and temperature
    if (time > 2 || temperature > 25) {
        oxidationLevel = 'Low';
        lipidColor = '#FFCC33';  // Yellow for low oxidation
        oxidationValue = 2;
    }
    if (time > 4 || temperature > 35) {
        oxidationLevel = 'Moderate';
        lipidColor = '#FF9900';  // Light Orange for moderate oxidation
        oxidationValue = 4;
    }
    if (time > 6 || temperature > 50) {
        oxidationLevel = 'High';
        lipidColor = '#FF6600';  // Orange for high oxidation
        oxidationValue = 6;
    }
    if (time > 8 || temperature > 60) {
        oxidationLevel = 'Very High';
        lipidColor = '#FF3300';  // Dark Orange for very high oxidation
        oxidationValue = 8;
    }
    if (time > 10 || temperature > 80) {
        oxidationLevel = 'Severe';
        lipidColor = '#CC0000';  // Red for severe oxidation
        oxidationValue = 10;
    }
    if (time > 15 || temperature > 100) {
        oxidationLevel = 'Extreme';
        lipidColor = '#800000';  // Dark Red for extreme oxidation
        oxidationValue = 12;
    }

    // Adjust oxidation if air exposure is checked
    if (airExposure) {
        oxidationValue += 2; // Increase oxidation value due to air exposure
        lipidColor = darkenColor(lipidColor, 20); // Darken the color to reflect increased oxidation
    }

    // Update the current day display
    document.getElementById('current-day').textContent = `Day: ${time}`;

    // Apply the selected color and oxidation level to the lipid and result text
    lipid.style.backgroundColor = lipidColor;
    oxidationResult.textContent = `Oxidation Level: ${oxidationLevel}`;
    updateFeedback(time, temperature, airExposure);
    updateOxidationChart(time, oxidationValue);
}

// Darken the color to visually represent increased oxidation due to air exposure
function darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;

    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
        .toString(16)
        .slice(1)}`;
}

// Provide user feedback based on current oxidation conditions
function updateFeedback(time, temperature, airExposure) {
    const feedbackMessage = document.getElementById('feedback-message');
    let message = '';

    if (time <= 2 && temperature <= 25 && !airExposure) {
        message = 'The olive oil remains fresh and high-quality. Low temperature, short storage time, and no air exposure effectively prevent oxidation.';
    } 
    else if (time <= 2 && temperature <= 25 && airExposure) {
        message = 'Minimal oxidation occurring. Short exposure time limits damage, but the presence of air can start the slow oxidation process.';
    } 
    else if (time <= 2 && temperature > 25 && temperature <= 40 && !airExposure) {
        message = 'Slight oxidation may occur due to elevated temperature. Keeping olive oil in cooler conditions helps maintain its quality.';
    } 
    else if (time > 2 && time <= 7 && temperature <= 25 && !airExposure) {
        message = 'Over moderate storage time, the olive oil maintains good quality. Absence of air exposure and low temperature slow down oxidation.';
    } 
    else if (time > 2 && time <= 7 && (temperature > 25 && temperature <= 40) && airExposure) {
        message = 'Noticeable oxidation is occurring. Combined effects of increased temperature, air exposure, and storage time degrade the oil quality, leading to slight off-flavors and reduced nutritional value.';
    } 
    else if (time > 7 && temperature <= 25 && !airExposure) {
        message = 'Extended storage time leads to gradual oxidation even under optimal conditions. The oil may start developing subtle off-flavors and diminished aroma.';
    } 
    else if (time > 7 && (temperature > 25 && temperature <= 40) && airExposure) {
        message = 'Significant oxidation has occurred. The olive oil exhibits noticeable rancid flavors, off-odors, and loss of beneficial antioxidants.';
    } 
    else if ((time > 2 && time <= 7) && (temperature > 40 && temperature <= 60) && airExposure) {
        message = 'Accelerated oxidation happening. High temperatures and air exposure over this period cause the oil to spoil quickly, with pronounced rancidity and possible color changes.';
    } 
    else if (time > 7 && (temperature > 40 && temperature <= 60) && airExposure) {
        message = 'Severe oxidation has degraded the olive oil extensively. It is likely unsuitable for consumption due to strong off-flavors, odors, and potential formation of harmful compounds.';
    } 
    else if (temperature > 60 && airExposure) {
        message = 'Extreme conditions causing rapid and extensive oxidation. The olive oil breaks down quickly, becoming highly rancid and unsafe for consumption.';
    } 
    else if (temperature > 60 && !airExposure) {
        message = 'High temperature alone induces significant oxidation. Even without air exposure, the oil quality deteriorates rapidly under such heat.';
    } 
    else if (time > 30) {
        message = 'Very prolonged storage time results in considerable oxidation. Regardless of other conditions, the oil has likely degraded substantially.';
    } 
    else {
        message = 'The current conditions are causing moderate oxidation. To preserve olive oil quality, reduce exposure time, temperature, and contact with air.';
    }

    feedbackMessage.textContent = message;
}

// Update the oxidation chart based on the current time and oxidation value
function updateOxidationChart(time, oxidationValue) {
    // Ensure the chart data aligns perfectly with user input
    oxidationChart.data.datasets[0].data[time] = oxidationValue;
    oxidationChart.update();
}

// Chart initialization
const ctx = document.getElementById('oxidationChart').getContext('2d');
const oxidationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({ length: 31 }, (_, i) => i.toString()),  // X-axis labels (Time in Days)
        datasets: [{
            label: 'Oxidation Level (units)',  // Added units to the label
            data: Array(31).fill(0),  // Initialize data points with zeros
            borderColor: 'red',
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (Days)', // X-axis label
                    color: '#b96d10',
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 14,  // Adjusted max value to accommodate air exposure impact
                title: {
                    display: true,
                    text: 'Oxidation Level (units)', // Y-axis label with units
                    color: '#b96d10',
                    font: {
                        size: 14
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

// Event listeners
document.getElementById('time-slider').addEventListener('input', updateOxidation);
document.getElementById('temperature').addEventListener('input', updateOxidation);
document.getElementById('air-exposure').addEventListener('change', updateOxidation);
document.getElementById('reset-button').addEventListener('click', resetSimulation); // Add event listener for reset button

document.getElementById('toggleHowToUse').addEventListener('click', function() {
    var howToUseSection = document.getElementById('howToUseSection');
    if (howToUseSection.classList.contains('hidden')) {
        howToUseSection.classList.remove('hidden');
        this.textContent = 'Hide How to Use';  // Update button text to indicate it can be hidden
    } else {
        howToUseSection.classList.add('hidden');
        this.textContent = 'Show How to Use';  // Reset button text when hidden
    }
});