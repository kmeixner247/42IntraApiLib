const fs = require('fs');

const getToken = async (clientId, clientSecret) => {
    try {
        let response = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': clientId,
                'client_secret': clientSecret
            })        
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            console.log('Token request failed');
        }
    }
    catch (e) {
        console.log(e);
    }
}

const getRequest = async (token, param) => {
    try {
        let response = await fetch(`https://api.intra.42.fr/${param}`, {
            headers: {
                'Authorization': `Bearer ${await token.access_token}`
            }
        });
        if (response.ok) {
            return await response.json();
        }
        console.error('Request failed');
    }
    catch (e) {
        console.error(e);
    }
}

//TBD: filter, range
const getUsers = async (token, sort='id', filter='', range='') => {
    console.log(`v2/users?sort=${sort}`);
    return await getRequest(token, `v2/users?sort=${sort}`);
}

const getUserById = async (token, id) => {
    return await getRequest(token, `v2/users/${id}`);
}

const getUserLocationStats = async (token, id, beginAt='', endAt = '', timeZone = '') => {
    if (beginAt === '') {
        let d = new Date();
        d.setMonth(d.getMonth() - 4);
        beginAt = d.toISOString().slice(0, 10);
    }
    if (endAt === '') {
        endAt = new Date().toISOString().slice(0, 10);
    }
    if (timeZone === '') {
        let user = await getUserById(token, id);
        timeZone = user.campus[0].time_zone;
    }
    return await getRequest(token, `v2/users/${id}/locations_stats?begin_at=${beginAt}&end_at=${endAt}&time_zone=${timeZone}`);
}

const getUserExamStats = async (token, id) => {
    return await getRequest(token, `v2/users/${id}/exam`);
}

const getUsersByCoalition = async (token, coalitionId) => {
    return await getRequest(token, `v2/coalitions/${coalitionId}/users`);
}

const getUsersByDash = async (token, dashId) => {
    return await getRequest(token, `v2/dashes/${dashId}/users`);
}

const getUsersByEvent = async (token, eventId) => {
    return await getRequest(token, `v2/events/${eventId}/users`);
}

const getUsersByAccreditation = async (token, accreditationId) => {
    return await getRequest(token, `v2/accreditations/${accreditationId}/users`);
}

const getUsersByTeam = async (token, teamId) => {
    return await getRequest(token, `v2/teams/${teamId}/users`);
}

const getUsersByProject = async (token, projectId) => {
    return await getRequest(token, `v2/projects/${projectId}/users`);
}

const getUsersByPartnership = async (token, partnershipId) => {
    return await getRequest(token, `v2/partnerships/${partnershipId}/users`);
}

const getUsersByExpertise = async (token, expertiseId) => {
    return await getRequest(token, `v2/expertises/${expertiseId}/users`);
}

const getUsersByCursus = async (token, cursusId) => {
    return await getRequest(token, `v2/cursus/${cursusId}/users`);
}

const getUsersByCampus = async (token, campusId) => {
    return await getRequest(token, `v2/campus/${campusId}/users`);
}

const getUsersByAchievement = async (token, achievementId) => {
    return await getRequest(token, `v2/achievements/${achievementId}/users`);
}

const getUsersByTitle = async (token, titleId) => {
    return await getRequest(token, `v2/titles/${titleId}/users`);
}

const getUsersByQuest = async (token, questId) => {
    return await getRequest(token, `v2/quests/${questId}/users`);
}

const getUsersByGroup = async (token, groupId) => {
    return await getRequest(token, `v2/groups/${groupId}/users`);
}


(async (clientId, clientSecret) => {
    const file = fs.readFileSync(".env", {encoding:'utf8', flag:'r'});
    const env = JSON.parse(file);

    console.log(env);
    let token = await getToken(env.uid, env.secret);
    console.log(token);
    const logtimes = await getUserLocationStats(token, 'kmeixner');
    console.log(logtimes);
    let sum = 0.0;
    console.log(Object.values(logtimes).forEach(element => {
        splitElement = element.split(':');
        sum += parseFloat(splitElement[0]);
        sum += parseFloat(splitElement[1]) / 60;
        sum += parseFloat(splitElement[2]) / 3600;
    }));
    console.log('avg monthly logtime:', sum/4);
})();
