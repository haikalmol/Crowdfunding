const selection_modal = document.getElementById("selection_modal");
const success_modal = document.getElementById("success_modal");
const back_project_btn = document.getElementById("back_project");
const close_modal_btn = document.getElementById("close_modal");

// click on back-this-project button to open selection modal
back_project_btn.onclick = function () {
  selection_modal.style.display = "block";
  gsap.from(form, { opacity: 0 });
  form.scrollIntoView({ behavior: "smooth" });
  document.body.style.overflow = "hidden";
};

// close selection modal from close button
close_modal_btn.onclick = function (e) {
  e.preventDefault();
  gsap.to(form, { duration: 1, y: "100%", clearProps: "y" });
  gsap.to(selection_modal, { display: "none" });
  document.body.style.overflow = "";
};

// click away from modal to close it
window.onclick = function (event) {
  if (event.target == selection_modal) {
    gsap.to(form, { duration: 1, y: "100%", clearProps: "y" });
    gsap.to(selection_modal, { display: "none" });
    document.body.style.overflow = "";
  }
  if (event.target == success_modal) {
    gsap.to("#success_modal>section", { duration: 0.5, y: "100%", clearProps: "y" });
    gsap.to(success_modal, { display: "none" });
    document.body.style.overflow = "";
  }
  if (event.target == mobile_menu) {
    gsap.to(mobile_menu, { opacity: 0, display: "none", clearProps: "all", onComplete: () => mobile_menu.classList.add("hidden") });
    gsap.to("#mobile-menu>nav", { y: -50, opacity: 1, clearProps: "y" });
    document.querySelector("header>a").style.display = "block";
    document.querySelector("header>button").classList.remove("hidden");
    document.body.style.overflow = "";
  }
};

// select radio button to select product
const radio_btns = document.querySelectorAll('input[type="radio"]');
radio_btns.forEach((radio) => {
  radio.addEventListener("change", () => {
    // hide all pledges
    hideAllPledges();
    // show selected pledge
    document.querySelector(`#${radio.value}`).classList.remove("hidden");
    // in case no_reward is selected, set selected_number_input to null
    let selected_number_input = document.querySelector(`input[name=${radio.value}]`) || null;
    // enable selected number input
    if (selected_number_input) selected_number_input.disabled = false;
  });
});

function hideAllPledges() {
  disableNumberInputs();
  radio_btns.forEach((radio) => {
    let pledge = document.querySelector(`#${radio.value}`);
    if (pledge.classList.contains("hidden")) return;
    pledge.classList.add("hidden");
  });
}

function disableNumberInputs() {
  document.querySelectorAll("input[type=number]").forEach((input) => {
    input.disabled = true;
  });
}

// select reward
const reward_btns = document.querySelectorAll(".reward");
reward_btns.forEach((reward) => {
  reward.addEventListener("click", (e) => {
    // open selection modal
    selection_modal.style.display = "block";
    document.body.style.overflow = "hidden";
    // scroll to product
    document.getElementById(`${reward.dataset.reward}_product`).scrollIntoView({ behavior: "smooth" });
    gsap.from(form, { opacity: 0 });
    // check product
    document.querySelector(`input[value=${reward.dataset.reward}]`).checked = true;
    // hide all pledges
    hideAllPledges();
    // show selected pledge
    document.querySelector(`#${reward.dataset.reward}`).classList.remove("hidden");
    // enable selected pledge's number input
    document.querySelector(`input[name=${reward.dataset.reward}]`).disabled = false;
  });
});

// submit form
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let data = [];
  for (let pair of formData.entries()) {
    data.push({ [pair[0]]: pair[1] });
  }
  calculateStats(data);
  document.querySelector("input[type=radio]:checked").checked = false;
  hideAllPledges();
  gsap.to(form, { duration: 1, y: "100%", clearProps: "y" });
  gsap.to(selection_modal, { display: "none" });
  success_modal.style.display = "flex";
  gsap.from("#success_modal>section", { duration: 0.5, y: "-100%" });
  document.body.style.overflow = "hidden";
});

// close success modal
success_modal.querySelector("section>button").addEventListener("click", () => {
  gsap.to("#success_modal>section", { duration: 0.5, y: "100%", clearProps: "y" });
  gsap.to(success_modal, { display: "none" });
  document.body.style.overflow = "";
});

const TARGET_AMOUNT = 100000;
let amount_raised = 89914;
let progress_bar = (amount_raised / TARGET_AMOUNT) * 100;
let products_left = {
  bamboo: 101,
  black_stand: 64,
  mahoganny: 0,
};
let total_backers = 5007;

function calculateStats(data) {
  if (data[0].product == "no_reward") {
    ++total_backers;
    document.getElementById("total_backers").innerText = total_backers.toLocaleString();
    return;
  }

  let pledge = {
    name: data[0].product,
    amount: data[1][data[0].product],
  };
  amount_raised = amount_raised + parseFloat(pledge.amount);
  document.getElementById("amount_raised").innerText = `$${amount_raised.toLocaleString()}`;

  progress_bar = (amount_raised / TARGET_AMOUNT) * 100;
  // round progress_bar to two decimal places
  progress_bar = Math.round(progress_bar * 100) / 100;
  document.getElementById("progress_bar").style.width = `${progress_bar}%`;

  ++total_backers;
  document.getElementById("total_backers").innerText = total_backers.toLocaleString();

  --products_left[pledge.name];
  document.querySelectorAll(`.${pledge.name}_left`).forEach((element) => {
    element.innerText = products_left[pledge.name];
  });
}

// bookmarking
const bk_mk_btn = document.querySelector(".btn-bk-mk");
const bk_mk_svg = document.querySelector(".btn-bk-mk>svg");
const bk_mk_txt = document.querySelector(".btn-bk-mk>span");
bk_mk_btn.addEventListener("click", (e) => {
  if (bk_mk_txt.innerText == "Bookmark") {
    bk_mk_txt.innerText = "Bookmarked";
    bk_mk_txt.style.color = "#147b74";
    bk_mk_svg.querySelector("g>circle").style.fill = "#3cb4ac";
    bk_mk_svg.querySelector("g>path").style.fill = "#FFFFFF";
  } else {
    bk_mk_txt.innerText = "Bookmark";
    bk_mk_txt.style.color = "";
    bk_mk_svg.querySelector("g>circle").style.fill = "";
    bk_mk_svg.querySelector("g>path").style.fill = "";
  }
});

// toggle mobile menu
const menu_btn = document.querySelector("header>button");
const mobile_menu = document.getElementById("mobile-menu");
menu_btn.addEventListener("click", () => {
  mobile_menu.classList.remove("hidden");
  gsap.from("#mobile-menu>nav", { y: -50, opacity: 0 });
  document.querySelector("header>a").style.display = "none";
  document.querySelector("header>button").classList.add("hidden");
  document.body.style.overflow = "hidden";
});
mobile_menu.querySelector("div>button").addEventListener("click", () => {
  gsap.to(mobile_menu, { opacity: 0, display: "none", clearProps: "all", onComplete: () => mobile_menu.classList.add("hidden") });
  gsap.to("#mobile-menu>nav", { y: -50, opacity: 1, clearProps: "y" });
  document.querySelector("header>a").style.display = "block";
  document.querySelector("header>button").classList.remove("hidden");
  document.body.style.overflow = "";
});

// Animations
// logo and menus
gsap.from("header>a", { x: -100, opacity: 0, duration: 1 });
gsap.from("header>button , #desktop-menu", { x: 100, opacity: 0, duration: 1 });
gsap.from("#desktop-menu>a", { opacity: 0, stagger: 0.2 });
// first section in main
gsap.from("main>section", { y: 100, opacity: 0, duration: 1 });
gsap.from("main>section>img", { y: 100, startAt: { x: "-50%" }, opacity: 0, duration: 1 });
// animate stats
gsap.registerPlugin(ScrollTrigger);
const obj = { target: 1 };
function animateStats(stat, id) {
  gsap.to(obj, {
    duration: 2,
    target: stat,
    ease: "power4.out",
    onUpdate: () => (document.getElementById(id).innerText = `${parseInt(obj.target).toLocaleString()}`),
    scrollTrigger: {
      trigger: `#${id}`,
      toggleActions: "play",
    },
  });
}
animateStats(amount_raised, "amount_raised");
animateStats(total_backers, "total_backers");
animateStats(56, "days_left");
//animate progress bar
gsap.to(obj, {
  duration: 2,
  target: progress_bar,
  ease: "power4.out",
  onUpdate: () => (document.getElementById("progress_bar").style.width = `${obj.target}%`),
  scrollTrigger: {
    trigger: "#progress_bar",
    toggleActions: "play",
  },
});
// animate products on entry
gsap.utils.toArray(".product").forEach((element) => {
  gsap.from(element, {
    duration: 1,
    opacity: 0,
    y: 50,
    scrollTrigger: {
      trigger: element,
      toggleActions: "play",
      start: "50px bottom",
    },
  });
});
