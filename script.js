const selectBattles = document.querySelector("#battles");
const selectTargets = document.querySelector("#targets");
const bodyContainer = document.querySelector("#bodyContainer");
const codeContainer = document.querySelector("#codeContainer");
let battleBaseUrl = "https://cssbattle.dev/battle/#";
let targetBaseUrl = "https://cssbattle.dev/play/#";

let battleUrl = "";
let targetUrl = "";

const fetchBattlesJSON = async () => {
    const response = await fetch("./battles.json");
    const battles = await response.json();
    return battles;
};

const fetchTarget = async (id) => {
    const response = await fetch("./targets/target-" + id + ".html");
    const target = await response.text();
    return target;
};

const selectBattlesEvent = (e) => {
    e.preventDefault();
    battleUrl = battleBaseUrl.replace("#", e.target.value);
    const targets = e.target.selectedOptions[0].dataset["targets"];
    populateTargets(targets);
};

const selectTargetsEvent = (e) => {
    e.preventDefault();
    const id = e.target.value;
    targetUrl = targetBaseUrl.replace("#", id);
    fetchTarget(id).then((target) => {
        displayTarget(target);
    });
};

const populateBattles = (battles) => {
    let option = null;
    let title = null;
    battles.forEach((battle) => {
        console.log(battle);
        option = document.createElement("option");
        option.value = battle.id;
        option.dataset.targets = battle.targets;
        title = document.createTextNode(
            "Battle #" + battle.id + " - " + battle.title
        );
        option.appendChild(title);
        selectBattles.appendChild(option);
    });
    selectTargets.removeEventListener("change", selectTargetsEvent);
    selectBattles.addEventListener("change", selectBattlesEvent);
};

const populateTargets = (targets) => {
    while (selectTargets.lastElementChild && selectTargets.children.length > 1)
        selectTargets.removeChild(selectTargets.lastElementChild);

    const targetRange = targets.split("-");
    for (let i = targetRange[0]; i <= targetRange[1]; i++) {
        option = document.createElement("option");
        option.value = i;
        title = document.createTextNode("Target #" + i);
        option.appendChild(title);
        selectTargets.appendChild(option);
    }
    selectTargets.addEventListener("change", selectTargetsEvent);
};

const displayTarget = (target) => {
    console.dir(bodyContainer);
    target = target.replace("body", "#bodyContainer");
    bodyContainer.innerHTML = target;
    codeContainer.innerText = target;
    console.log(target);
};

fetchBattlesJSON().then((battles) => {
    populateBattles(battles.list);
});
