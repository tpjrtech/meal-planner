document.getElementById('generateMealPlanButton').addEventListener('click', async () => {
    const ingredients = document.getElementById('ingredientsInput').value;

    try {
        const response = await fetch('https://098f3fdb-7f1f-4cf2-acfb-621edcf9b6bb-00-15r2s5k1tn8tr.janeway.replit.dev/generate-meal-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById('mealPlanOutput').textContent = data.mealPlan;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mealPlanOutput').textContent = 'Error generating meal plan';
    }
});
