// Get date 2nd
// Get user info 1st
//
// Read and format the table


const params = new URL(document.location).searchParams;
const username = params.get("user");

const jsonpath = `scripts/json/${username}.json`;

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_MINUTE = 60 * 1000;

const dateNow = new Date();

async function populate() {
    const request = new Request(jsonpath);
    const response = await fetch(request);
    const userInfoText = await response.text();

    const userInfo = JSON.parse(userInfoText);
    const dateBeginISO = new Date(userInfo.dateBeginISO);
    const dateBegin = new Date(dateBeginISO.getTime() + new Date().getTimezoneOffset() * MILLISECONDS_PER_MINUTE);

    const weekNum = Math.floor((dateNow.getTime() - dateBegin.getTime()) / MILLISECONDS_PER_DAY / 7 + 1);
    const dayNum = Math.floor((dateNow.getTime() - dateBegin.getTime()) / MILLISECONDS_PER_DAY % 7 + 1);

    replaceInfo(userInfo, weekNum, dayNum);
    replaceSchedule(userInfo, weekNum, dayNum);
}

function replaceInfo(info, weekNum, dayNum) {
    document.getElementById("weeknum").textContent = weekNum;
    document.getElementById("name").textContent = info.name;
    document.getElementById("datetime").textContent = dateNow;
}

function replaceSchedule(info, weekNum, dayNum) {
    const tableList = [];
    const dayList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for(const day of dayList) {
        for(let i = 1; i <= 5; i++) {
            tableList.push(day + i.toString());
        }
    }
    
    for(const block of tableList) {
        for(const item of info[block]) {
            if(item["weeks"].includes(weekNum)) {
                document.getElementById(block).innerText = getInfoStr(item);
            }
        }
    }
    document.getElementById(`${dayNum}col`).style.backgroundColor = "#97DB9A90";
}

function getInfoStr(item) {
    return `${item.coursename}\n${item.teacher}\n${item.location}\n\n`;
}

populate();
