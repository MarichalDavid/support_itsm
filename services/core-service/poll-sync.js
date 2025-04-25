require('dotenv').config();
const axios = require('axios');

// Authentification Keycloak
async function getKeycloakToken() {
    const res = await axios.post(`${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        grant_type: 'client_credentials'
    }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data.access_token;
}

async function getKeycloakUsers(token) {
    const res = await axios.get(`${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
}

// Session GLPI
async function initGlpiSession() {
    const res = await axios.get(`${process.env.GLPI_URL}/initSession`, {
        headers: {
            'App-Token': process.env.GLPI_APP_TOKEN,
            'Authorization': `user_token ${process.env.GLPI_USER_TOKEN}`
        }
    });
    return res.data.session_token;
}

async function killGlpiSession(session_token) {
    await axios.get(`${process.env.GLPI_URL}/killSession`, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
}

// Recherche utilisateur actif ou supprimé
async function findGlpiUserByName(username, session_token) {
    // Recherche actifs
    let res = await axios.get(`${process.env.GLPI_URL}/search/User?criteria[0][field]=1&criteria[0][searchtype]=contains&criteria[0][value]=${username}&forcedisplay[0]=1&forcedisplay[1]=2&forcedisplay[2]=15`, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    let results = res.data.data;
    if (results && results.length > 0) {
        const userData = results.find(u => u["1"].toLowerCase() === username.toLowerCase());
        if (userData) {
            return { id: userData["2"], name: userData["1"], is_deleted: userData["15"] === 1 };
        }
    }

    // Recherche supprimés
    res = await axios.get(`${process.env.GLPI_URL}/search/User?criteria[0][field]=1&criteria[0][searchtype]=contains&criteria[0][value]=${username}&forcedisplay[0]=1&forcedisplay[1]=2&forcedisplay[2]=15&is_deleted=1`, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    results = res.data.data;
    if (results && results.length > 0) {
        const userData = results.find(u => u["1"].toLowerCase() === username.toLowerCase());
        if (userData) {
            return { id: userData["2"], name: userData["1"], is_deleted: true };
        }
    }

    return null;
}

// Restauration utilisateur supprimé
async function restoreGlpiUser(userId, session_token) {
    console.log(`♻️ Restauration utilisateur ID ${userId}`);
    await axios.put(`${process.env.GLPI_URL}/User/${userId}`, {
        input: { id: userId, is_deleted: 0 }
    }, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    console.log(`✅ Utilisateur restauré ID ${userId}`);
}

// Création utilisateur
async function createGlpiUser(user, session_token) {
    const phoneNumber = user.attributes?.phoneNumber?.[0] || "";
    const userData = {
        name: user.username,
        firstname: user.firstName,
        realname: user.lastName,
        phone: phoneNumber
    };
    console.log(`📤 Création : ${JSON.stringify(userData, null, 2)}`);
    const res = await axios.post(`${process.env.GLPI_URL}/User`, { input: userData }, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    const newUserId = res.data.id;
    console.log(`✅ Utilisateur créé : ${user.username} | ID : ${newUserId}`);
    await updateGlpiUserEmail(newUserId, user.email, session_token);
}

// Récupère l'email GLPI
async function getGlpiUserEmail(userId, session_token) {
    const res = await axios.get(`${process.env.GLPI_URL}/User/${userId}/UserEmail`, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    return res.data.length > 0 ? res.data[0] : null;
}

// Met à jour / ajoute l'email
async function updateGlpiUserEmail(userId, email, session_token) {
    const existingEmail = await getGlpiUserEmail(userId, session_token);
    if (existingEmail) {
        if (existingEmail.email !== email) {
            console.log(`📧 Mise à jour email ID ${existingEmail.id} pour utilisateur ${userId}`);
            await axios.put(`${process.env.GLPI_URL}/UserEmail/${existingEmail.id}`, {
                input: {
                    id: existingEmail.id,
                    users_id: userId,
                    email: email,
                    is_default: 1
                }
            }, {
                headers: {
                    'Session-Token': session_token,
                    'App-Token': process.env.GLPI_APP_TOKEN
                }
            });
        }
    } else {
        console.log(`📧 Ajout email pour utilisateur ${userId}`);
        await axios.post(`${process.env.GLPI_URL}/UserEmail`, {
            input: {
                users_id: userId,
                email: email,
                is_default: 1
            }
        }, {
            headers: {
                'Session-Token': session_token,
                'App-Token': process.env.GLPI_APP_TOKEN
            }
        });
    }
}

// Mise à jour utilisateur
async function updateGlpiUser(userId, user, session_token) {
    const phoneNumber = user.attributes?.phoneNumber?.[0] || "";
    const userData = {
        id: userId,
        firstname: user.firstName,
        realname: user.lastName,
        phone: phoneNumber
    };
    console.log(`📤 Mise à jour (${user.username}) ID ${userId}: ${JSON.stringify(userData, null, 2)}`);
    await axios.put(`${process.env.GLPI_URL}/User/${userId}`, { input: userData }, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    console.log(`🔄 Utilisateur GLPI mis à jour : ${user.username}`);
    await updateGlpiUserEmail(userId, user.email, session_token);
}

// Liste GLPI utilisateurs
async function getGlpiUsers(session_token) {
    const res = await axios.get(`${process.env.GLPI_URL}/User`, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    return res.data;
}

// Suppression logique
async function deleteGlpiUser(userId, username, session_token) {
    console.log(`🗑️ Suppression ${username} (ID: ${userId})`);
    await axios.delete(`${process.env.GLPI_URL}/User/${userId}`, {
        headers: {
            'Session-Token': session_token,
            'App-Token': process.env.GLPI_APP_TOKEN
        }
    });
    console.log(`🗑️ Utilisateur supprimé : ${username}`);
}

// Utilisateurs protégés
function isProtectedGlpiUser(glpiUser) {
    const protectedUsernames = ['glpi', 'post-only', 'tech', 'normal', 'glpi-system'];
    return protectedUsernames.includes(glpiUser.name.toLowerCase());
}

// Poll principal
async function pollKeycloak() {
    let session_token = null;
    try {
        const token = await getKeycloakToken();
        const keycloakUsers = await getKeycloakUsers(token);
        session_token = await initGlpiSession();

        const glpiUsers = await getGlpiUsers(session_token);
        const keycloakUsernames = keycloakUsers.map(user => user.username);

        for (const user of keycloakUsers) {
            const existingUser = await findGlpiUserByName(user.username, session_token);
            if (existingUser) {
                if (existingUser.is_deleted) {
                    await restoreGlpiUser(existingUser.id, session_token);
                }
                await updateGlpiUser(existingUser.id, user, session_token);
            } else {
                await createGlpiUser(user, session_token);
            }
        }

        for (const glpiUser of glpiUsers) {
            if (!keycloakUsernames.includes(glpiUser.name)) {
                if (!isProtectedGlpiUser(glpiUser)) {
                    await deleteGlpiUser(glpiUser.id, glpiUser.name, session_token);
                }
            }
        }

    } catch (error) {
        console.error('❌ Erreur synchronisation:', error.response?.data || error.message);
    } finally {
        if (session_token) {
            await killGlpiSession(session_token);
        }
    }
}

// Init
async function init() {
    console.log('🔄 Démarrage de la synchronisation Keycloak-GLPI...');
    await pollKeycloak();
    setInterval(pollKeycloak, 10000);
}

init().catch(error => {
    console.error('❌ Erreur critique démarrage:', error.message);
    process.exit(1);
});
