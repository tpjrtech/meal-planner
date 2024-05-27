
document.addEventListener('DOMContentLoaded', async () => {
    const inventoryForm = document.getElementById('inventoryForm');
    const inventoryDiv = document.getElementById('inventory');
    const recipesDiv = document.getElementById('recipes');
    const mealPlanDiv = document.getElementById('mealPlan');
    const generateMealPlanButton = document.getElementById('generateMealPlan');

    // Load inventory from localStorage or initialize an empty array
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    // Fetch recipes from the JSON file
    async function fetchRecipes() {
        try {
            const response = await fetch('data/recipes.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching recipes:', error);
            return [];
        }
    }

    let recipes = await fetchRecipes();

    // Function to render the inventory list
    function renderInventory() {
        inventoryDiv.innerHTML = '';
        inventory.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <p>${item.name} - ${item.quantity} - ${item.expiration}</p>
                <button onclick="removeItem(${index})">Remove</button>
            `;
            inventoryDiv.appendChild(itemDiv);
        });
    }

    // Function to render the recipes list
    function renderRecipes() {
        recipesDiv.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';
            recipeDiv.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
                <p>Instructions: ${recipe.instructions}</p>
            `;
            recipesDiv.appendChild(recipeDiv);
        });
    }

    // Function to generate a meal plan using the backend server
    async function generateMealPlanUsingAI() {
        try {
            const availableIngredients = inventory.map(item => item.name).join(', ');
            const response = await fetch('http://localhost:3000/generate-meal-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients: availableIngredients }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const aiMealPlan = data.mealPlan;
            mealPlanDiv.innerHTML = `<h3>AI Generated Meal Plan</h3><p>${aiMealPlan.replace(/\n/g, '<br>')}</p>`;
        } catch (error) {
            console.error('Error calling backend server:', error);
        }
    }

    // Function to render the meal plan based on available inventory and recipes
    function renderMealPlan() {
        mealPlanDiv.innerHTML = '';
        const availableRecipes = recipes.filter(recipe => 
            recipe.ingredients.every(ingredient => 
                inventory.some(item => item.name.toLowerCase() === ingredient.toLowerCase() && item.quantity > 0)
            )
        );
        availableRecipes.forEach(recipe => {
            const mealDiv = document.createElement('div');
            mealDiv.className = 'meal';
            mealDiv.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
                <p>Instructions: ${recipe.instructions}</p>
            `;
            mealPlanDiv.appendChild(mealDiv);
        });
    }

    // Event listener for the inventory form submission
    inventoryForm.addEventListener('submit', e => {
        e.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemQuantity = document.getElementById('itemQuantity').value;
        const itemExpiration = document.getElementById('itemExpiration').value;
        const newItem = { name: itemName, quantity: itemQuantity, expiration: itemExpiration };
        
        // Add new item to inventory and save to localStorage
        inventory.push(newItem);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        // Re-render the inventory and meal plan
        renderInventory();
        renderMealPlan();
        
        // Reset the form
        inventoryForm.reset();
    });

    // Function to remove an item from the inventory
    window.removeItem = function(index) {
        inventory.splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        renderInventory();
        renderMealPlan();
    };

    // Event listener for the AI meal plan button
    generateMealPlanButton.addEventListener('click', generateMealPlanUsingAI);

    // Initial rendering of inventory, recipes, and meal plan
    renderInventory();
    renderRecipes();
    renderMealPlan();
});
