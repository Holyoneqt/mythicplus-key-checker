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
    waitForCharactersLoaded(myCharacters)
        .then((preloaded) => {
            preloaded.forEach((char, index) => {
                loadedCharacters.push(char);
                drawCharacter(char, index * 100, true);
            });
        })
        .catch(handleError);

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
                drawCharacter(char, 0, true);
            })
            .catch(handleError);
    });

    $('#switch-view').click(() => {
        let button = $('#switch-view');
        if (currentView === 'weekly') {
            button.text('Show weekly Mythic+ runs');
            currentView = 'overall';
        } else if (currentView === 'overall') {
            button.text('Show best Mythic+ runs');
            currentView = 'weekly';
        }

        loadedCharacters.forEach(char => drawDungeonRuns(char, true));
    });

    $('#update').click(() => {
        waitForCharactersLoaded(myCharacters)
            .then((loaded) => {
                loaded.forEach((char, index) => drawDungeonRuns(char, true));
            })
            .catch(handleError);
    });
});

drawCharacter = function (char, animationDelay, initialDraw) {
    $('#addNewCharError').text('');
    $('#newCharRealm').val('');
    $('#newCharName').val('');

    const charElement = document.getElementById(`${clean(char.realm)}-${clean(char.name)}`);
    if (charElement) {

    } else {
        $('#myCharacters').append(getCharacterTemplate(char, animationDelay, initialDraw));

        drawDungeonRuns(char);

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

drawDungeonRuns = function (char, animate) {
    $(`#${clean(char.realm)}-${char.name}-runs`).html('');
    const getAnimationDelay = (i) => animate ? i * 30 : undefined;
    if (currentView === 'weekly') {
        char.mythic_plus_weekly_highest_level_runs.forEach((run, index) => {
            $(`#${clean(char.realm)}-${char.name}-runs`).append(getDungeonRunTemplate(run, animate, getAnimationDelay(index)));
        });
    } else if (currentView === 'overall') {
        char.mythic_plus_best_runs.forEach((run, index) => {
            $(`#${clean(char.realm)}-${char.name}-runs`).append(getDungeonRunTemplate(run, animate, getAnimationDelay(index)));
        });
    }
}

waitForCharactersLoaded = function (chars) {
    const promises = [];
    for (let i = 0; i < chars.length; i++) {
        promises.push(raiderio.getHighestWeeklyMythicPlus(chars[i].region, chars[i].realm, chars[i].name));
    }
    return Promise.all(promises);
}

getWeeklyChestLoot = function (runs) {
    if (runs.length === 0) return '-';
    let keyLevels = runs.map(run => run.mythic_level > 15 ? 15 : run.mythic_level);
    let chestLoot = [];
    chestLoot[0] = keyLevels[0];
    chestLoot[1] = keyLevels[3] || 0;
    chestLoot[2] = keyLevels[9] || 0;
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
