function getCharacterTemplate(char, animationDelay, initialDraw) {
  let topMythicLevel, topMythicDungeon;
  let weeklyHighest = char.mythic_plus_weekly_highest_level_runs[0];
  if (weeklyHighest) {
    topMythicDungeon = weeklyHighest.dungeon;
    topMythicLevel = "+" + weeklyHighest.mythic_level;
  } else {
    topMythicDungeon = "--";
    topMythicLevel = "--";
  }
  console.log(animationDelay);

  return `
        <div id="${clean(char.realm)}-${clean(
    char.name
  )}" class="character ${char.class.toLowerCase()} ${
    initialDraw ? "" : "no-animation"
  }" ${animationDelay ? `style="animation-delay: ${animationDelay}ms"` : ""}>
            <div class="character-topbar">
                <div class="character-image">
                    <div style="--bg-image: url('${
                      char.thumbnail_url
                    }');"></div>
                </div>
                <div class="character-text-with-title">
                    <p class="character-text-with-title--title">${
                      char.realm
                    }</p>
                    <a href=${char.profile_url} target="_blank">${char.name}</a>
                </div>
                <div class="character-text-with-title">
                    <p class="character-text-with-title--title">Highest M+ this week</p>
                    <p>${topMythicDungeon} ${topMythicLevel}</p>
                </div>
                <div class="character-text-with-title">
                    <p class="character-text-with-title--title">Weekly Chest</p>
                    <p>${getWeeklyChestLoot(
                      char.mythic_plus_weekly_highest_level_runs
                    )}</p>
                </div>
                <button id="delete${clean(char.realm)}-${clean(
    char.name
  )}" class="character-delete button button-delete" title="remove">X</button>
            </div>
            <div>
                <div id="${clean(char.realm)}-${
    char.name
  }-runs" class="runs"></div>
            </div>
        </div>
    `;
}

function getDungeonRunTemplate(run, animate, animationDelay) {
  return `
        <div class="card tooltip ${animate ? "tooltip-animate" : ""}" ${
    animationDelay ? `style="animation-delay: ${animationDelay}ms"` : ""
  }>
            <div class="card-header">
                <img class="card-bg" src="images/${run.short_name}.jpg" />
                <span class="card-name">${run.dungeon}</span>
            </div>    

            <div class="card-scores">
                <div>
                    <span class="card-scores-level ${getKeystoneLevelRarityClass(run.mythic_level)}">+${run.mythic_level}</span>
                    </div>
                    <div>
                    <span class="card-scores-score">${run.score}</span>
                    <a class="card-scores-score" href="${
                      run.url
                    }" target="_blank">${
    run.num_keystone_upgrades == 0
      ? "depleted"
      : `upgraded +${run.num_keystone_upgrades}`
  }</a>
                </div>
            </div>
        </div>`;
  return `
        <div class="run tooltip ${animate ? "tooltip-animate" : ""}" ${
    animationDelay ? `style="animation-delay: ${animationDelay}ms"` : ""
  }>
            <p>${run.short_name} +${run.mythic_level}</p>
            <p style="font-size: 12px; text-align: center">${
              run.num_keystone_upgrades == 0
                ? "depleted"
                : `upgraded +${run.num_keystone_upgrades}`
            }</p>
            <a class="default" style="font-size: 12px; display: block; margin: 2px; text-align: center" >${
              run.score
            }</a>
            <span class="tooltiptext">
                ${run.dungeon} </br>
                Time: ${millisToMinutesAndSeconds(run.clear_time_ms)} </br>
                Cleared at: ${new Date(run.completed_at).toDateString()}
            </span>
        </div>`;
}

function getBestDungeonRunsTemplate(dungeonRun, animate, animationDelay) {
  return `
        <div class="card tooltip ${animate ? "tooltip-animate" : ""}" ${
    animationDelay ? `style="animation-delay: ${animationDelay}ms"` : ""
  }>
            <div class="card-header">
                <img class="card-bg" src="images/${dungeonRun.short}.jpg" />
                <span class="card-name">${dungeonRun.name}</span>
            </div>    

            <div class="card-scores">
                <div>
                    <span class="card-scores-affix">Tyrannical</span>
                    <span class="card-scores-level ${getKeystoneLevelRarityClass(dungeonRun.scores.tyrannical.level)}">${
                      dungeonRun.scores.tyrannical.level
                    }</span>
                    <span class="card-scores-score">${
                      dungeonRun.scores.tyrannical.score
                    }</span>
                </div>
                <div>
                    <span class="card-scores-affix">Fortified</span>
                    <span class="card-scores-level ${getKeystoneLevelRarityClass(dungeonRun.scores.fortified.level)}">${
                      dungeonRun.scores.fortified.level
                    }</span>
                    <span class="card-scores-score">${
                      dungeonRun.scores.fortified.score
                    }</span>
                </div>
            </div>
        </div>`;
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function getKeystoneLevelRarityClass(keystoneLevel) {
  const rarityKey = {
    20: "text-legendary",
    15: "text-epic",
    10: "text-rare",
    5: "text-uncommon",
    0: "text-common",
  };

  let rarityClass = "";
  Object.keys(rarityKey)
    .map((k) => parseFloat(k))
    .sort((a, b) => a - b)
    .forEach((key) => {
      if (keystoneLevel >= key) {
        rarityClass = rarityKey[key];
      }
    });
  return rarityClass;
}
