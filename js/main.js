document.getElementById('generateMealPlanButton').addEventListener('click', async () => {
    const startDate = document.getElementById('startDateInput').value;
    const startTime = document.getElementById('startTimeInput').value;
    const ingredients = document.getElementById('ingredientsInput').value;
    
    const eventElements = document.querySelectorAll('.event');
    const events = Array.from(eventElements).map(eventElement => {
        const date = eventElement.querySelector('.eventDate').value;
        const description = eventElement.querySelector('.eventDescription').value;
        return `${date}: ${description}`;
    }).join(', ');

    document.getElementById('mealPlanOutput').innerHTML = '';
    document.getElementById('scheduleOutput').innerHTML = '';
    document.getElementById('progressBarContainer').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';

    let progressBarInterval;
    try {
        progressBarInterval = setInterval(animateProgressBar, 100); // Start the progress bar animation

        const response = await fetch('https://098f3fdb-7f1f-4cf2-acfb-621edcf9b6bb-00-15r2s5k1tn8tr.janeway.replit.dev/generate-meal-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startDate, startTime, ingredients, events })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById('mealPlanOutput').innerHTML = `<h2>Meal Plan</h2><pre>${formatText(data.mealPlan)}</pre>`;
        document.getElementById('scheduleOutput').innerHTML = `<h2>Schedule</h2><pre>${formatText(data.schedule)}</pre>`;
        document.getElementById('refineOutputButton').style.display = 'inline';
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mealPlanOutput').textContent = 'Error generating meal plan';
        document.getElementById('scheduleOutput').textContent = 'Error generating schedule';
    } finally {
        clearInterval(progressBarInterval); // Stop the progress bar animation
        document.getElementById('progressBarContainer').style.display = 'none';
    }
});

document.getElementById('addEventButton').addEventListener('click', () => {
    const eventsContainer = document.getElementById('eventsContainer');
    const newEvent = document.createElement('div');
    newEvent.classList.add('event');
    newEvent.innerHTML = `
        <input type="date" class="eventDate" placeholder="Event date">
        <input type="text" class="eventDescription" placeholder="Event description">
    `;
    eventsContainer.appendChild(newEvent);
});

document.getElementById('refineOutputButton').addEventListener('click', async () => {
    const mealPlan = document.getElementById('mealPlanOutput').innerText;
    const schedule = document.getElementById('scheduleOutput').innerText;

    document.getElementById('mealPlanOutput').innerHTML = '';
    document.getElementById('scheduleOutput').innerHTML = '';
    document.getElementById('progressBarContainer').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';

    let progressBarInterval;
    try {
        progressBarInterval = setInterval(animateProgressBar, 100); // Start the progress bar animation

        const response = await fetch('https://098f3fdb-7f1f-4cf2-acfb-621edcf9b6bb-00-15r2s5k1tn8tr.janeway.replit.dev/refine-output', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mealPlan, schedule })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById('mealPlanOutput').innerHTML = `<h2>Refined Meal Plan</h2><pre>${formatText(data.mealPlan)}</pre>`;
        document.getElementById('scheduleOutput').innerHTML = `<h2>Refined Schedule</h2><pre>${formatText(data.schedule)}</pre>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mealPlanOutput').textContent = 'Error refining meal plan';
        document.getElementById('scheduleOutput').textContent = 'Error refining schedule';
    } finally {
        clearInterval(progressBarInterval); // Stop the progress bar animation
        document.getElementById('progressBarContainer').style.display = 'none';
    }
});

function formatText(text) {
    return text.replace(/\n/g, '<br>');
}

function animateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    let width = parseInt(progressBar.style.width);
    if (isNaN(width)) width = 0;
    if (width < 100) {
        width++;
        progressBar.style.width = width + '%';
        progressBar.textContent = width + '%';
    }
}
