
var selectedRegion = "NA";


async function handleSearchButton() {
    document.getElementById("search").innerHTML = "Searching...";
    let input = document.getElementById("playerName").value;
    let name = input.split("#")[0];
    let tag = input.split("#")[1];
    document.querySelectorAll('.infoCard').forEach((div) => {
        div.style.animation = "";
    });
    await sleep(1);
    let tStart = performance.now();
    await searchPlayer(name, tag);
}
/**
 * Displays game information
 * @param {Object{metadata:{name,tag},gamemode:{Game Information}} data - Game data collected from API
 */
async function fillDivs(data) {


    for (let [mode, gameDat] of Object.entries(data)) {
        if (mode != "Metadata") {

            mode = mode.replace(" ", "");
            document.getElementById(mode).querySelector(`span[name="matchPlayed"]`).innerHTML = gameDat["games"];

            document.getElementById(mode).querySelector(`span[name="win"]`).innerHTML = gameDat["wins"];
            if (gameDat["games"] != 0) {
                document.getElementById(mode).querySelector(`span[name="avgKDA"]`).innerHTML = Math.round(gameDat["K"] / gameDat["games"]) + "  /  " + Math.round(gameDat["D"] / gameDat["games"]) + "  /  " + Math.round(gameDat["A"] / gameDat["games"]);
                document.getElementById(mode).querySelector(`span[name="bestKDA"]`).innerHTML = Math.round(gameDat["bestK"]) + "  /  " + Math.round(gameDat["bestD"]) + "  /  " + Math.round(gameDat["bestA"]) + "  (  " + (gameDat["wonBestMatch"] ? "Won" : "Lost") + "  )  ";
                let bestKDA = [gameDat["bestK"], gameDat["bestD"], gameDat["bestA"]];

                let svg = d3.select(`#${mode} svg`);
                if (svg.empty()) {
                    svg = d3.select(`#${mode}`).append("svg")
                        .attr("width", 250)
                        .attr("height", 250);
                }

                let data = bestKDA;
                let xScale = d3.scaleBand()
                    .domain(["Kills", "Deaths", "Assists"])
                    .range([0, 200])
                    .padding(0.4);

                let yScale = d3.scaleLinear()
                    .domain([0, 50])
                    .range([100, 0]);
                let color = {
                    "K": "green",
                    "D": "red",
                    "A": "blue"
                };
                let labels = ["K", "D", "A"];
                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d, i) { return xScale(["Kills", "Deaths", "Assists"][i]); })
                    .attr("width", xScale.bandwidth() * 1.5)
                    .attr("y", function (d) { return yScale(d)*2; })
                    .attr("height", function (d) { return (100 - yScale(d))*2; })
                    .attr("fill", function (d, i) { return color[labels[i]]; });
                svg.selectAll(".label")
                    .data(data)
                    .enter().append("text")
                    .attr("class", "label")
                    .text(function (d, i) { return labels[i] + ": " + d; })
                    .attr("x", function (d, i) { return xScale(["Kills", "Deaths", "Assists"][i])+xScale.bandwidth()-10 ; })
                    .attr("y", function (d) { return yScale(d)*2 ; })
                    .attr("text-anchor", "middle")
                    .attr("font-size", "2px")
                    .attr("fill", "white");

            } else {
                document.getElementById(mode).querySelector(`span[name="avgKDA"]`).innerHTML = Math.round(gameDat["K"]) + "  /  " + Math.round(gameDat["D"]) + "  /  " + Math.round(gameDat["A"]);
                document.getElementById(mode).querySelector(`span[name="bestKDA"]`).innerHTML = Math.round(gameDat["bestK"]) + "  /  " + Math.round(gameDat["bestD"]) + "  /  " + Math.round(gameDat["bestA"]) + "  (  " + (gameDat["wonBestMatch"] ? "Won" : "Lost") + "  )  ";

            }
            document.getElementById(mode).style.animation = "slideIn 1s linear 0s 1 normal forwards";
        }
    }

    document.getElementById("search").innerHTML = "Search";
}
/**
 * Adds the rank card div
 * @param {String} rank the player's competitve rank and Tier
 * @param {String} rankImsrc URL pointing to rank tier image
 * @param {String} backgroundImSrc The Player's player card. 
 * @param {String} level The player's account level
 */
async function addRankCard(rank, rankImsrc, backgroundImSrc, level) {
    document.getElementById("rankText").innerHTML = rank + "\nLevel " + level;
    document.getElementById("rankImage").src = rankImsrc;
    document.getElementById("rankInfoOutside").style.backgroundImage = `url('${backgroundImSrc}')`;
    document.getElementById("rankInfoCard").style.animation = "slideIn 1s linear 0s 1 normal forwards";
    document.getElementById("rankInfoOutside").style.animation = "slideIn 1s linear 0s 1 normal forwards";


}
window.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        handleSearchButton();
    }
});