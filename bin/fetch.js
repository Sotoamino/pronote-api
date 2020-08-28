#!/usr/bin/env node

/* eslint no-console: off */
/* eslint no-unused-vars: off */

const pronote = require('..');

if (process.argv.length < 5) {
    console.log('Syntax: pronote-fetch <URL> <username> <password> [cas(ex: none)] [AccountType (ex: Student)]');
    return;
}

const [,, url, username, password, cas = 'none', accountType] = process.argv;

async function fetch()
{
    const session = await pronote.login(url, username, password, cas, accountType);
    console.log(`Logged as '${session.user.name}' (${session.user.studentClass.name})`);

    const timetable = await session.timetable(new Date(2020, 8, 1));
    const marks = await session.marks();
    const evaluations = await session.evaluations();
    const absences = await session.absences();
    const infos = await session.infos();
    const homeworks = await session.homeworks(new Date(2020, 8, 15));
    const menu = await session.menu(new Date(2020, 8, 15));

    // TODO

    console.log('Done');
}

fetch().catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        return console.error('Invalid credentials, did you chose the right CAS ?');
    }

    if (err.code !== undefined) {
        console.error(`ERROR: [${err.code}] ${err.message}`);
    } else {
        console.error(err);
    }
});
