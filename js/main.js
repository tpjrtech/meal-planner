
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

document.addEventListener('DOMContentLoaded', async () => {
    const inventoryForm = document.getElementById('inventoryForm');
    const inventoryDiv = document.getElementById('inventory');
    const recipesDiv = document.getElementById('recipes');
    const mealPlanDiv = document.getElementById('mealPlan');
    const generateMealPlanButton = document.getElementById('generateMealPlan');

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

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

    async function generateMealPlanUsingAI() {
        try {
            const availableIngredients = inventory.map(item => item.name).join(', ');
            const prompt = `Given the following available ingredients: ${availableIngredients}, suggest a weekly meal plan including recipes.`;

            const response = await axios.post(
                'https://api.openai.com/v1/engines/davinci-codex/completions',
                {
                    prompt: prompt,
                    max_tokens: 150,
                    n: 1,
                    stop: null,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    },
                }
            );

            const aiMealPlan = response.data.choices[0].text.trim();
            mealPlanDiv.innerHTML = `<h3>AI Generated Meal Plan</h3><p>${aiMealPlan.replace(/\n/g, '<br>')}</p>`;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
        }
    }

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

    inventoryForm.addEventListener('submit', e => {
        e.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemQuantity = document.getElementById('itemQuantity').value;
        const itemExpiration = document.getElementById('itemExpiration').value;
        const newItem = { name: itemName, quantity: itemQuantity, expiration: itemExpiration };
        
        inventory.push(newItem);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        renderInventory();
        renderMealPlan();
        
        inventoryForm.reset();
    });

    window.removeItem = function(index) {
        inventory.splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        renderInventory();
        renderMealPlan();
    };

    generateMealPlanButton.addEventListener('click', generateMealPlanUsingAI);

    renderInventory();
    renderRecipes();
    renderMealPlan();
});
