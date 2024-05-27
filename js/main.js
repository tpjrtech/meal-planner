document.getElementById('generateMealPlanButton').addEventListener('click', async () => {
    const ingredients = document.getElementById('ingredientsInput').value;
    const events = document.getElementById('eventsInput').value;

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
        document.getElementById('mealPlanOutput').innerHTML = `<h2>Meal Plan</h2><div>${formatText(data.mealPlan)}</div>`;
        document.getElementById('scheduleOutput').innerHTML = `<h2>Schedule</h2><div>${formatText(data.schedule)}</div>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mealPlanOutput').textContent = 'Error generating meal plan';
        document.getElementById('scheduleOutput').textContent = 'Error generating schedule';
    }
});

function formatText(text) {
    return text.replace(/\n/g, '<br>');
}
