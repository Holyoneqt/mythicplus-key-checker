function RaiderIO() {

    this.API_URL = 'https://raider.io/api/v1';
    this.CHARACTER_URL = '/characters/profile';

}

RaiderIO.prototype.get = function(requestUrl, region, realm, name, fields) {
    let url = `${this.API_URL}${requestUrl}/?region=${region}&realm=${realm}&name=${name}`;
    if(fields && fields !== '') {
        url = `${url}&fields=${fields}`;
    }
    console.log('calling', url);
    $.ajax(url, {
        success: function(data) {
            myCharacters.push({realm: data.realm, name: data.name});
            drawCharacter(data);
            $('#addNewCharError').text('');
            $('#newCharRealm').val('');
            $('#newCharName').val('');
        },
        error: function(response) {
            console.error(JSON.parse(response.responseText));
            $('#addNewCharError').text(JSON.parse(response.responseText).message);
        }
    });
};

RaiderIO.prototype.getCharacter = function(realm, name, fields) {
    this.get(this.CHARACTER_URL, 'eu', realm, name, fields);
};

RaiderIO.prototype.getHighestWeeklyMythicPlus = function(realm, name) {
    this.getCharacter(realm, name, 'mythic_plus_weekly_highest_level_runs,gear');
};
