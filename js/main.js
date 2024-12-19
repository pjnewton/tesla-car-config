const topBar = document.querySelector("#top-bar");
const exteriorColorSection = document.querySelector("#exterior-buttons");
const interiorColorSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const performanceBtn = document.querySelector("#performance-btn");
const totalPriceElement = document.querySelector("#total-price");
const fullSelfDrivingCheckbox = document.querySelector(
  "#full-self-driving-checkbox"
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
);
const downPaymentElement = document.querySelector("#down-payment");
const monthlyPaymentElement = document.querySelector("#monthly-payment");

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = "Stealth Grey";
const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  "Full Self-Driving": false,
};

const pricing = {
  "Performance Wheels": 2500,
  "Performance Package": 5000,
  "Full Self-Driving": 8500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Liners": 225,
  },
};

// Update total price in the UI
const updateTotalPrice = () => {
  // Reset the current price to base price
  currentPrice = basePrice;

  // Performance Wheel Option Price
  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }

  // Performance Package Option Price
  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }

  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }

  // Accessory Checkboxes
  accessoryCheckboxes.forEach((checkbox) => {
    // Extract the accessory label
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();

    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    // Add to current price if accessory is selected
    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  // Update the total price in UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

  updatePaymentBreakdown();
};

// Update payment breakdown based on current price
const updatePaymentBreakdown = () => {
  // Calculate down payment
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  // Calculate loan details (assuming 60-mo loan and 4% interest rate)
  const loanMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  // Monthly Payment Calculation - Formula: P * (r(1+r)^n / ((1+r)^n - 1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanMonths) - 1);

  monthlyPaymentElement.textContent = `$${monthlyPayment
    .toFixed(2)
    .toLocaleString()}`;
};

// Handle Top Bar on Scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

// Image Mapping
const exteriorImages = {
  "Stealth Grey": "./images/model-y-stealth-grey.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  Quicksilver: "./images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};

// Handle Color Selection
const handleColorButtonClick = (event) => {
  let button;
  // Select the button or Image
  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }
  // Remove selection from current and add selection to clicked
  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));
    button.classList.add("btn-selected");

    // Change Exterior Image
    if (event.currentTarget === exteriorColorSection) {
      selectedColor = button.querySelector("img").alt;
      updateExteriorImage();
    }

    // Change Interior Image
    if (event.currentTarget === interiorColorSection) {
      const color = button.querySelector("img").alt;
      interiorImage.src = interiorImages[color];
    }
  }
};

// Update exterior image based on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance Wheels"]
    ? "-performance"
    : "";
  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Grey";
  exteriorImage.src = exteriorImages[colorKey].replace(
    ".jpg",
    `${performanceSuffix}.jpg`
  );
};

// Wheel Selection
const handleWheelButtonCLick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll("#wheel-buttons button");
    buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));

    // Add Selected Styles to clicked button
    event.target.classList.add("bg-gray-700", "text-white");

    selectedOptions["Performance Wheels"] =
      event.target.textContent.includes("Performance");

    updateExteriorImage();

    updateTotalPrice();
  }
};

// Performance Package Selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");

  //   Update Selected Options
  selectedOptions["Performance Package"] = isSelected;

  updateTotalPrice();
};

// Full Self-Driving Selection
const fullSelfDrivingChange = () => {
  const isSelected = fullSelfDrivingCheckbox.checked;
  selectedOptions["Full Self-Driving"] = isSelected;
  updateTotalPrice();
};

// Handle Accessory CHeckbox LIsteners
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => updateTotalPrice());
});

// Initial Update Total Price
updateTotalPrice();

// Event Listeners
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonCLick);
performanceBtn.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener("change", fullSelfDrivingChange);
