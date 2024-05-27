document.getElementById('generateMealPlanButton').addEventListener('click', async () => {
    const ingredients = document.getElementById('ingredientsInput').value;
    const events = document.getElementById('eventsInput').value;

    document.getElementById('mealPlanOutput').innerHTML = '';
    document.getElementById('scheduleOutput').innerHTML = '';
    document.getElementById('progressBarContainer').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    animateProgressBar();

    try {
        const response = await fetch('https://098f3fdb-7f1f-4cf2-acfb-621edcf9b6bb-00-15r2s5k1tn8tr.janeway.replit.dev/generate-meal-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients, events })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById('mealPlanOutput').innerHTML = `<h2>Meal Plan</h2><pre>${formatText(data.mealPlan)}</pre>`;
        document.getElementById('scheduleOutput').innerHTML = `<h2>Schedule</h2><pre>${formatText(data.schedule)}</pre>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mealPlanOutput').textContent = 'Error generating meal plan';
        document.getElementById('scheduleOutput').textContent = 'Error generating schedule';
    } finally {
        document.getElementById('progressBarContainer').style.display = 'none';
    }
});

function formatText(text) {
    return text.replace(/\n/g, '<br>');
}

function animateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width++;
            progressBar.style.width = width + '%';
            progressBar.textContent = width + '%';
        }
    }, 50); // Adjust the speed as necessary
}
