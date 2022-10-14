const selectBattles = document.querySelector("#battles");
const selectTargets = document.querySelector("#targets");
const titlesContainer = document.querySelector("#titlesContainer");
const achievementsContainer = document.querySelector("#achievementsContainer");
const unmetContainer = document.querySelector("#unmetContainer");
const imgContainer = document.querySelector("#imgContainer");
const bodyContainer = document.querySelector("#bodyContainer");
const codeContainer = document.querySelector("#codeContainer");
let battleBaseUrl = "https://cssbattle.dev/battle/#";
let targetBaseUrl = "https://cssbattle.dev/play/#";
let targetImgBaseUrl = "./targets-img/#.png";

let battles = {};
let battleUrl = "";
let battleTitle = "";
let currentBattle = {};
let targetUrl = "";
let targetTitle = "";
let currentTarget = {};

const fetchBattlesJSON = async () => {
    const response = await fetch("./battles.json");
    battles = await response.json();
    return battles;
};

const fetchTarget = async (id) => {
    const response = await fetch("./targets/target-" + id + ".html");
    const target = await response.text();
    return target;
};

const selectBattlesEvent = (e) => {
    e.preventDefault();
    currentBattle = battles.list[e.target.selectedOptions[0].index - 1];
    battleUrl = battleBaseUrl.replace("#", e.target.value);
    battleTitle = e.target.selectedOptions[0].innerText;
    populateTargets();
};

const selectTargetsEvent = (e) => {
    e.preventDefault();
    codeContainer.removeEventListener("click", clickCodeEvent);
    titlesContainer.innerHTML = "";
    achievementsContainer.innerHTML = "";
    imgContainer.innerHTML = "";
    bodyContainer.innerHTML = "";
    codeContainer.firstChild.innerHTML = "";
    const id = e.target.value;
    currentTarget =
        currentBattle.targets[e.target.selectedOptions[0].index - 1];
    targetUrl = targetBaseUrl.replace("#", id);
    targetTitle = e.target.selectedOptions[0].innerText;
    fetchTarget(id).then((html) => {
        displayTarget(id, html);
    });
};

const loadBodyEvent = (e) => {
    e.target.contentDocument.body.style.overflow = "hidden";
};

const clickCodeEvent = (e) => {
    const code = e.target.innerText;
    try {
        navigator.clipboard.writeText(code);
    } catch (err) {
        console.error(err.name, err.message);
    }
};

const clickUnmetEvent = (e) => {
    e.preventDefault();
    const [battleId, targetId] = e.target.innerText.split("-");
    window.scrollTo(0, 0);
    selectBattles.value = battleId;
    selectBattles.dispatchEvent(new Event("change"));
    selectTargets.value = targetId;
    selectTargets.dispatchEvent(new Event("change"));
};

const populateBattles = (battles) => {
    let option = null;
    let title = null;
    battles.forEach((battle) => {
        option = document.createElement("option");
        option.value = battle.id;
        option.dataset.targets = battle.targetsnb;
        title = document.createTextNode(
            "Battle #" + battle.id + " - " + battle.title
        );
        option.appendChild(title);
        selectBattles.appendChild(option);
    });
    selectTargets.removeEventListener("change", selectTargetsEvent);
    selectBattles.addEventListener("change", selectBattlesEvent);
};

const populateUnmet = (unmetTargets) => {
    if (unmetTargets.length === 0) {
        unmetContainer.innerText = "No unmet, well done!";
        return;
    }
    unmetTargets.forEach((id) => {
        const target = document.createElement("a");
        //target.href = "#";
        target.dataset.target = id;
        target.innerText = id;
        unmetContainer.append(target);
        target.addEventListener("click", clickUnmetEvent);
    });
};

const populateTargets = () => {
    while (selectTargets.lastElementChild && selectTargets.children.length > 1)
        selectTargets.removeChild(selectTargets.lastElementChild);
    currentBattle.targets.forEach((target) => {
        option = document.createElement("option");
        option.value = target.id;
        title = document.createTextNode(
            "Target #" + target.id + " - " + target.title
        );
        option.appendChild(title);
        selectTargets.appendChild(option);
    });
    selectTargets.addEventListener("change", selectTargetsEvent);
};

const displayTarget = (id, html) => {
    const battleLink = document.createElement("a");
    battleLink.href = battleUrl;
    battleLink.target = "_blank";
    battleLink.innerText = battleTitle;
    const targetLink = document.createElement("a");
    targetLink.href = targetUrl;
    targetLink.target = "_blank";
    targetLink.innerText = targetTitle;
    titlesContainer.append(battleLink);
    titlesContainer.append(targetLink);
    const scoreIcon = currentTarget.achievements.match === "100%" ? "✅" : "🔴";
    achievementsContainer.innerHTML =
        scoreIcon +
        " " +
        currentTarget.achievements.match +
        " {" +
        currentTarget.achievements.score +
        "}";
    const imgTarget = document.createElement("img");
    imgTarget.src = targetImgBaseUrl.replace("#", id);
    imgContainer.append(imgTarget);
    const body = document.createElement("object");
    body.type = "text/html";
    body.data = "./targets/target-" + id + ".html";
    body.addEventListener("load", loadBodyEvent);
    bodyContainer.append(body);
    codeContainer.firstChild.innerText = html;
    codeContainer.addEventListener("click", clickCodeEvent);
};

fetchBattlesJSON().then((battles) => {
    populateBattles(battles.list);
    populateUnmet(battles.unmetTargets);
});
