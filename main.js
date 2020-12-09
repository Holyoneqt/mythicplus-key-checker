let myCharacters = JSON.parse(localStorage.getItem('preload-characters') || '[]');

const lootTable = {
    0: '-',
    2: '200',
    3: '203',
    4: '207',
    5: '210',
    6: '210',
    7: '213',
    8: '216',
    9: '216',
    10: '220',
    11: '220',
    12: '223',
    13: '223',
    14: '226',
    16: '226',
};

const raiderio = new RaiderIO();

$(document).ready(() => {
    // Preload
    for (let i = 0; i < myCharacters.length; i++) {
        raiderio.getHighestWeeklyMythicPlus(myCharacters[i].realm, myCharacters[i].name)
            .then(char => drawCharacter(char))
            .catch(handleError);
    }

    // load affixes
    raiderio.getAffixes()
        .then(response => {
            response.affix_details.forEach(affix => {
                let affixContainer = document.createElement('div'), tooltip = document.createElement('span');
                affixContainer.innerHTML = affix.name;
                affixContainer.classList.add('tooltip');

                tooltip.innerHTML = affix.description;
                tooltip.classList.add('tooltiptext');

                affixContainer.appendChild(tooltip);
                document.getElementById('affixes').appendChild(affixContainer);
            });
        })
        .catch(handleError);

    $('#addNewChar').click(function () {
        const realm = $('#newCharRealm').val();
        const name = $('#newCharName').val();
        raiderio.getHighestWeeklyMythicPlus(realm, name)
            .then(char => {
                console.log(char);
                myCharacters.push({ realm: char.realm, name: char.name });
                localStorage.setItem('preload-characters', JSON.stringify(myCharacters));

                drawCharacter(char);
            })
            .catch(handleError);
    });

    $('#refresh').click(loadCharacters);
});

loadCharacters = function () {
    for (let i = 0; i < myCharacters.length; i++) {
        const char = myCharacters[i];
        raiderio.getHighestWeeklyMythicPlus(char.realm, char.name)
            .then(char => drawCharacter(char))
            .catch(handleError);
    }
};

drawCharacter = function (char) {
    $('#addNewCharError').text('');
    $('#newCharRealm').val('');
    $('#newCharName').val('');

    if (document.getElementById(`${char.realm}-${char.name}`)) {
        // TODO: Update
    } else {
        let topMythicLevel, topMythicDungeon;
        let weeklyHighest = char.mythic_plus_weekly_highest_level_runs[0]
        if (weeklyHighest) {
            topMythicDungeon = weeklyHighest.dungeon;
            topMythicLevel = "+" + weeklyHighest.mythic_level;
        } else {
            topMythicDungeon = '--';
            topMythicLevel = '--';
        }

        $('#myCharacters').append(`
            <div id="${char.realm}-${char.name}" class="character ${char.class.toLowerCase()}">
                <img class="thumbnail" src="${char.thumbnail_url}" alt="char" />
                <div>
                    <p>${char.realm}-${char.name}</p>
                    <p style="font-size: 12px">${char.gear.item_level_equipped} equipped</p>
                </div>
                <div style="border-right: 2px solid black">
                    <p style="font-size: 12px">Highest M+ this week</p>
                    <p>${topMythicDungeon} ${topMythicLevel}</p>
                    <p style="font-size: 12px">Weekly Chest</p>
                    <p>${getWeeklyChestLoot(char.mythic_plus_weekly_highest_level_runs)}</p>
                </div>
                <div id="${char.realm}-${char.name}-runs" class="runs"></div>
                <button id="delete${char.realm}-${char.name}" class="button button-delete" title="remove">X</button>
            </div>
            `
        );

        char.mythic_plus_weekly_highest_level_runs.forEach(run => {
            $(`#${char.realm}-${char.name}-runs`).append(`
                <div class="tooltip">
                    <p>${run.short_name} +${run.mythic_level}</p>
                    <p style="font-size: 12px; text-align: center">${run.num_keystone_upgrades == 0 ? 'depleted' : `upgraded +${run.num_keystone_upgrades}`}</p>
                    <span class="tooltiptext">
                        ${run.dungeon} </br>
                        Time: ${millisToMinutesAndSeconds(run.clear_time_ms)} </br>
                        Cleared at: ${new Date(run.completed_at).toDateString()}
                    </span>
                </div>
            `);
        });

        $(`#delete${char.realm}-${char.name}`).click({ char: char }, function (event) {
            myCharacters = myCharacters.filter(i => {
                return !(i.realm.toLowerCase() === event.data.char.realm.toLowerCase() &&
                    i.name.toLowerCase() === event.data.char.name.toLowerCase());
            });
            localStorage.setItem('preload-characters', JSON.stringify(myCharacters));
            $(`#${char.realm}-${char.name}`).remove();
        });
    }
};

getWeeklyChestLoot = function (runs) {
    if (runs.length === 0) return '-';
    let chestLoot = [];
    chestLoot[0] = runs[0].mythic_level;
    chestLoot[1] = runs[4]?.mythic_level || 0;
    chestLoot[2] = runs[10]?.mythic_level || 0;
    return `${lootTable[chestLoot[0]]} | ${lootTable[chestLoot[1]]} | ${lootTable[chestLoot[2]]}`
}

handleError = async function (response) {
    error = await response;
    console.error(error);
    $('#addNewCharError').text(`${error.statusCode} ${error.error} - ${error.message}`);
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

