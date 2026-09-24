// ========================================
// SURPLUS2SHELTER FRONTEND
// ========================================


// -------------------------------
// MOBILE MENU
// -------------------------------

function toggleMenu() {

    const menu = document.getElementById("navMenu");

    if (menu) {
        menu.classList.toggle("show");
    }
}


// -------------------------------
// DEMO FOOD DATA
// -------------------------------

let foods = JSON.parse(
    localStorage.getItem("surplusFoods")
) || [

    {
        id: 1,
        name: "Vegetable Biryani",
        category: "Cooked Meal",
        quantity: 12,
        servings: 45,
        donor: "Green Leaf Kitchen",
        location: "Vaishali Nagar",
        distance: 2.4,
        expiry: "2026-09-24T18:30",
        status: "Available"
    },

    {
        id: 2,
        name: "Fresh Bread",
        category: "Bakery",
        quantity: 8,
        servings: 30,
        donor: "Daily Bakery",
        location: "C-Scheme",
        distance: 4.1,
        expiry: "2026-09-24T20:00",
        status: "Available"
    },

    {
        id: 3,
        name: "Rice & Dal",
        category: "Cooked Meal",
        quantity: 20,
        servings: 70,
        donor: "College Canteen",
        location: "Malviya Nagar",
        distance: 5.2,
        expiry: "2026-09-24T17:00",
        status: "Available"
    },

    {
        id: 4,
        name: "Fruit Boxes",
        category: "Fruits",
        quantity: 15,
        servings: 50,
        donor: "Fresh Mart",
        location: "Mansarovar",
        distance: 3.2,
        expiry: "2026-09-24T21:00",
        status: "Available"
    }

];

saveFoods();

function saveFoods() {

    localStorage.setItem(
        "surplusFoods",
        JSON.stringify(foods)
    );
}


// -------------------------------
// TOAST
// -------------------------------

function showToast(message) {

    const oldToast =
        document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";
    toast.innerHTML = "✓ &nbsp;" + message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// -------------------------------
// DONATION FORM
// -------------------------------

const donationForm =
    document.getElementById("donationForm");

if (donationForm) {

    donationForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const food = {

                id: Date.now(),

                name:
                    document.getElementById("foodName").value,

                category:
                    document.getElementById("category").value,

                quantity:
                    Number(
                        document.getElementById("quantity").value
                    ),

                servings:
                    Number(
                        document.getElementById("servings").value
                    ),

                donor:
                    document.getElementById("donorName").value,

                location:
                    document.getElementById("location").value,

                distance:
                    Number((Math.random() * 4 + 1).toFixed(1)),

                expiry:
                    document.getElementById("expiry").value,

                status: "Available"

            };


            foods.push(food);

            saveFoods();

            showToast(
                "Donation posted successfully!"
            );

            donationForm.reset();

            setTimeout(() => {

                window.location.href =
                    "matching.html";

            }, 1000);

        }
    );

}


// -------------------------------
// NGO FORM
// -------------------------------

const ngoForm =
    document.getElementById("ngoForm");

if (ngoForm) {

    ngoForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const requirement = {

                name:
                    document.getElementById("ngoName").value,

                location:
                    document.getElementById("ngoLocation").value,

                food:
                    document.getElementById("requiredFood").value,

                quantity:
                    document.getElementById("requiredQuantity").value,

                people:
                    document.getElementById("people").value,

                urgency:
                    document.getElementById("urgency").value

            };


            localStorage.setItem(
                "ngoRequirement",
                JSON.stringify(requirement)
            );

            showToast(
                "Shelter requirement submitted!"
            );

            ngoForm.reset();

        }
    );

}


// -------------------------------
// FORMAT DATE
// -------------------------------

function formatDate(date) {

    const d = new Date(date);

    return d.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// -------------------------------
// CHECK EXPIRY
// -------------------------------

function isExpired(food) {

    return new Date(food.expiry) <= new Date();

}


// -------------------------------
// CALCULATE MATCH
// -------------------------------

function calculateMatch(food) {

    let score = 100;


    // Distance penalty

    if (food.distance <= 2) {
        score += 0;
    }
    else if (food.distance <= 5) {
        score -= 8;
    }
    else {
        score -= 18;
    }


    // Food category

    if (food.category === "Cooked Meal") {
        score += 5;
    }


    // Quantity

    if (food.quantity >= 10) {
        score += 3;
    }


    // Expiry urgency

    const remaining =
        new Date(food.expiry) - new Date();

    const hours =
        remaining / (1000 * 60 * 60);

    if (hours < 2) {
        score += 5;
    }


    return Math.min(
        99,
        Math.max(
            65,
            Math.round(score)
        )
    );
}


// -------------------------------
// NGO FOOD LIST
// -------------------------------

const foodList =
    document.getElementById("foodList");

function displayFoodList() {

    if (!foodList) return;

    foodList.innerHTML = "";

    foods
        .filter(food =>
            food.status === "Available" &&
            !isExpired(food)
        )
        .forEach(food => {

            foodList.innerHTML += `

                <div class="food-card">

                    <span class="badge">
                        ${food.category}
                    </span>

                    <div class="food-icon-small">
                        ${getFoodIcon(food.category)}
                    </div>

                    <h3>
                        ${food.name}
                    </h3>

                    <p>
                        🍱 ${food.quantity} kg ·
                        ${food.servings} servings
                    </p>

                    <p>
                        📍 ${food.location}
                    </p>

                    <p>
                        🚚 ${food.distance} km away
                    </p>

                    <p>
                        ⏰ ${formatDate(food.expiry)}
                    </p>

                    <button
                        class="primary-btn"
                        onclick="acceptFood(${food.id})"
                    >
                        Request Food
                    </button>

                </div>
            `;

        });
}

displayFoodList();


// -------------------------------
// MATCHING PAGE
// -------------------------------

const matches =
    document.getElementById("matches");

function displayMatches() {

    if (!matches) return;

    const search =
        document.getElementById("search")?.value
        .toLowerCase() || "";

    const filter =
        document.getElementById("foodFilter")?.value
        || "all";

    const sort =
        document.getElementById("sort")?.value
        || "score";


    let available =
        foods.filter(food => {

            if (food.status !== "Available") {
                return false;
            }

            if (isExpired(food)) {
                return false;
            }

            const searchMatch =
                food.name.toLowerCase().includes(search) ||
                food.location.toLowerCase().includes(search) ||
                food.category.toLowerCase().includes(search);

            const filterMatch =
                filter === "all" ||
                food.category === filter;

            return searchMatch && filterMatch;

        });


    available.forEach(food => {

        food.score =
            calculateMatch(food);

    });


    if (sort === "score") {

        available.sort(
            (a,b) => b.score - a.score
        );

    }

    if (sort === "distance") {

        available.sort(
            (a,b) => a.distance - b.distance
        );

    }

    if (sort === "expiry") {

        available.sort(
            (a,b) =>
                new Date(a.expiry) -
                new Date(b.expiry)
        );

    }


    const count =
        document.getElementById("matchCount");

    if (count) {

        count.textContent =
            `${available.length} live matches`;

    }


    matches.innerHTML = "";


    if (available.length === 0) {

        matches.innerHTML = `

            <div class="food-card">

                <h3>No matches found</h3>

                <p>
                    Try changing your filters.
                </p>

            </div>
        `;

        return;

    }


    available.forEach(food => {

        matches.innerHTML += `

            <div class="match-card">

                <div class="match-top">

                    <span class="badge">
                        ${food.category}
                    </span>

                    <div class="match-percent">
                        ${food.score}%
                    </div>

                </div>

                <h3>
                    ${getFoodIcon(food.category)}
                    ${food.name}
                </h3>

                <p class="location">
                    📍 ${food.location}
                    · ${food.distance} km
                </p>

                <div class="match-meta">

                    <div>
                        <small>QUANTITY</small>
                        <b>${food.quantity} kg</b>
                    </div>

                    <div>
                        <small>SERVINGS</small>
                        <b>${food.servings}</b>
                    </div>

                    <div>
                        <small>DONOR</small>
                        <b>${food.donor}</b>
                    </div>

                    <div>
                        <small>SAFE UNTIL</small>
                        <b>${formatDate(food.expiry)}</b>
                    </div>

                </div>

                <button
                    class="primary-btn"
                    onclick="acceptFood(${food.id})"
                >
                    Accept Match →
                </button>

            </div>

        `;

    });

}


if (matches) {

    displayMatches();

    document
        .getElementById("search")
        ?.addEventListener(
            "input",
            displayMatches
        );

    document
        .getElementById("foodFilter")
        ?.addEventListener(
            "change",
            displayMatches
        );

    document
        .getElementById("sort")
        ?.addEventListener(
            "change",
            displayMatches
        );
}


// -------------------------------
// ACCEPT MATCH
// -------------------------------

function acceptFood(id) {

    foods = foods.map(food => {

        if (food.id === id) {

            return {
                ...food,
                status: "Accepted"
            };

        }

        return food;

    });


    saveFoods();

    showToast(
        "Match accepted! Delivery task created 🚚"
    );


    setTimeout(() => {

        if (window.location.pathname.includes(
            "matching"
        )) {

            displayMatches();

        }

        if (window.location.pathname.includes(
            "ngo"
        )) {

            displayFoodList();

        }

    }, 400);

}


// -------------------------------
// DELIVERY
// -------------------------------

const deliveryList =
    document.getElementById("deliveryList");


function displayDeliveries() {

    if (!deliveryList) return;

    const deliveries =
        foods.filter(
            food =>
                food.status === "Accepted" ||
                food.status === "Delivered"
        );


    if (deliveries.length === 0) {

        deliveryList.innerHTML = `

            <div class="food-card">

                <h3>
                    No active delivery
                </h3>

                <p>
                    Accept a match to create
                    a rescue mission.
                </p>

            </div>

        `;

        return;

    }


    deliveryList.innerHTML = "";


    deliveries.forEach(food => {

        deliveryList.innerHTML += `

            <div class="delivery-task food-card">

                <span class="badge">
                    🚚 DELIVERY READY
                </span>

                <h3>
                    ${food.name}
                </h3>

                <p>
                    📍 Pickup: ${food.location}
                </p>

                <p>
                    🍱 ${food.quantity} kg
                </p>

                <p>
                    👥 ${food.servings} meals
                </p>

                <button
                    class="primary-btn"
                    onclick="completeDelivery(${food.id})"
                >
                    Mark as Delivered
                </button>

            </div>

        `;

    });

}


displayDeliveries();


// -------------------------------
// COMPLETE DELIVERY
// -------------------------------

function completeDelivery(id) {

    foods = foods.map(food => {

        if (food.id === id) {

            return {
                ...food,
                status: "Delivered"
            };

        }

        return food;

    });


    saveFoods();

    showToast(
        "Delivery completed successfully! 🎉"
    );

    displayDeliveries();

}


// -------------------------------
// FOOD ICON
// -------------------------------

function getFoodIcon(category) {

    const icons = {

        "Cooked Meal": "🍛",

        "Bakery": "🍞",

        "Fruits": "🍎",

        "Vegetables": "🥦",

        "Packaged Food": "📦"

    };

    return icons[category] || "🍱";
}


// -------------------------------
// DASHBOARD COUNTERS
// -------------------------------

function animateCounter(
    element,
    target
) {

    if (!element) return;

    let current = 0;

    const increment =
        target / 60;

    const timer =
        setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(timer);

            }

            element.textContent =
                Math.floor(current).toLocaleString();

        }, 20);
}


const mealStat =
    document.getElementById("mealStat");

const foodStat =
    document.getElementById("foodStat");

const deliveryStat =
    document.getElementById("deliveryStat");


if (mealStat) {
    animateCounter(
        mealStat,
        12450
    );
}

if (foodStat) {
    animateCounter(
        foodStat,
        8200
    );
}

if (deliveryStat) {
    animateCounter(
        deliveryStat,
        1240
    );
}