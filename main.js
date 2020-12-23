let myCharacters = JSON.parse(localStorage.getItem('preload-characters') || '[]');
let loadedCharacters = [];
let currentView = 'weekly';

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
    15: '226',
};

const raiderio = new RaiderIO();

$(document).ready(() => {
    // Preload
    for (let i = 0; i < myCharacters.length; i++) {
        raiderio.getHighestWeeklyMythicPlus(myCharacters[i].region, myCharacters[i].realm, myCharacters[i].name)
            .then(char => {
                loadedCharacters.push(char);
                drawCharacter(char)
            })
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
        const region = $('#region').val();
        const realm = $('#newCharRealm').val();
        const name = $('#newCharName').val();
        raiderio.getHighestWeeklyMythicPlus(region, realm, name)
            .then(char => {
                myCharacters.push({ region: char.region, realm: char.realm, name: char.name });
                localStorage.setItem('preload-characters', JSON.stringify(myCharacters));

                loadedCharacters.push(char);
                drawCharacter(char);
            })
            .catch(handleError);
    });

    $('#switch-view').click(() => {
        $('#myCharacters').html('');
        let button = $('#switch-view');
        if (currentView === 'weekly') {
            button.text('Show weekly Mythic+ runs');
            currentView = 'overall';
        } else if (currentView === 'overall') {
            button.text('Show best Mythic+ runs');
            currentView = 'weekly';
        }

        loadedCharacters.forEach(char => drawCharacter(char));
    });
});

loadCharacters = function () {
    for (let i = 0; i < myCharacters.length; i++) {
        const char = myCharacters[i];
        raiderio.getHighestWeeklyMythicPlus(char.region, char.realm, char.name)
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
        $('#myCharacters').append(getCharacterTemplate(char));

        if (currentView === 'weekly') {
            char.mythic_plus_weekly_highest_level_runs.forEach(run => {
                $(`#${char.realm}-${char.name}-runs`).append(getDungeonRunTemplate(run));
            });
        } else if (currentView === 'overall') {
            char.mythic_plus_best_runs.forEach(run => {
                $(`#${char.realm}-${char.name}-runs`).append(getDungeonRunTemplate(run));
            });
        }

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

        $(`#delete${clean(char.realm)}-${clean(char.name)}`).click({ char: char }, function (event) {
            myCharacters = myCharacters.filter(i => {
                return !(i.realm.toLowerCase() === event.data.char.realm.toLowerCase() &&
                    i.name.toLowerCase() === event.data.char.name.toLowerCase());
            });
            localStorage.setItem('preload-characters', JSON.stringify(myCharacters));
            $(`#${clean(char.realm)}-${clean(char.name)}`).remove();
        });
    }
};

getWeeklyChestLoot = function (runs) {
    if (runs.length === 0) return '-';
    let chestLoot = [];
    chestLoot[0] = runs[0].mythic_level;
    chestLoot[1] = runs[3]?.mythic_level || 0;
    chestLoot[2] = runs[9]?.mythic_level || 0;
    return `${lootTable[chestLoot[0]]} | ${lootTable[chestLoot[1]]} | ${lootTable[chestLoot[2]]}`
}

handleError = async function (response) {
    error = await response;
    console.error(error);
    $('#addNewCharError').text(`${error.statusCode} ${error.error} - ${error.message}`);
}

function clean(val) {
    return val.split(' ').join('_');
}
