document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const searchInput = document.getElementById('recipeInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryTitle = document.getElementById('categoryTitle');

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) fetchSearchRecipe(query);
    }

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleSearch();
    });

    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const category = item.dataset.category;
            categoryTitle.textContent = category;
            fetchRandomMealByCategory(category);
        });
    });

    fetchRandomMealByCategory('Home');
});

async function fetchRandomMealByCategory(category) {
    let url;
    if (category.toLowerCase() === 'home') {
        url = 'https://www.themealdb.com/api/json/v1/1/random.php';
    } else {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (category.toLowerCase() === 'home') {
            if (data.meals && data.meals.length > 0) {
                fetchMealDetails(data.meals[0].idMeal);
            }
        } else {
            if (data.meals && data.meals.length > 0) {
                const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
                fetchMealDetails(randomMeal.idMeal);
            } else {
                alert('Нет блюд в этой категории');
            }
        }
    } catch(err) {
        console.error(err);
        alert('Ошибка загрузки рецепта');
    }
}

async function fetchSearchRecipe(query) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
            fetchMealDetails(data.meals[0].idMeal);
        } else {
            alert('Рецепт не найден');
        }
    } catch(err) {
        console.error(err);
        alert('Ошибка поиска');
    }
}

async function fetchMealDetails(id) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
            displayRecipe(data.meals[0]);
        }
    } catch(err) {
        console.error(err);
    }
}

function displayRecipe(meal) {
    document.getElementById('recipeTitle').textContent = meal.strMeal;

    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            const li = document.createElement('li');
            li.textContent = `${measure} ${ingredient}`;
            ingredientsList.appendChild(li);
        }
    }

    document.querySelector('.ingredients-section').style.display = 'block';

    const img = document.getElementById('recipeImage');
    img.src = meal.strMealThumb;
    img.style.display = 'block';
}
