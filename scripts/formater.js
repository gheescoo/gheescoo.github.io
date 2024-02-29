// Get date 2nd
// Get user info 1st
//
// Read and format the table


const params = new URL(document.location).searchParams;
const username = params.get("user");

const jsonpath = `scripts/json/${username}.json`;

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const dateNow = new Date();


async function populate() {

    const request = new Request(jsonpath);

    const response = await fetch(request);
    const userInfoText = await response.text();

    const userInfo = JSON.parse(userInfoText);
    const dateBegin = new Date(userInfo.dateBeginISO);
    const weekNum = Math.floor((dateNow.getTime() - dateBegin.getTime()) / MILLISECONDS_PER_DAY / 7 + 1);
    const dayNum = Math.floor((dateNow.getTime() - dateBegin.getTime()) / MILLISECONDS_PER_DAY % 7 + 1);

    replaceInfo(userInfo, weekNum, dayNum);
    replaceSchedule(userInfo, weekNum, dayNum);
}

function replaceInfo(info, weekNum, dayNum) {
    document.getElementById("weeknum").textContent = weekNum;
    document.getElementById("name").textContent = info.name;
    document.getElementById("datebegin").textContent = info.dateBeginISO;
    document.getElementById("datenow").textContent = dateNow;
}

function replaceSchedule(info, weekNum, dayNum) {
    const tableList = ["Mon1", "Tue1", "Wed1", "Thu1", "Fri1", "Sat1", "Sun1", "Mon2", "Tue2", "Wed2", "Thu2", "Fri2", "Sat2", "Sun2", "Mon3", "Tue3", "Wed3", "Thu3", "Fri3", "Sat3", "Sun3", "Mon4", "Tue4", "Wed4", "Thu4", "Fri4", "Sat4", "Sun4", "Mon5", "Tue5", "Wed5", "Thu5", "Fri5", "Sat5", "Sun5"];

    for(const block of tableList) {
        for(const item of info[block]) {
            if(item["weeks"].includes(weekNum)) {
                document.getElementById(block).innerText = getInfoStr(item);
            }
        }
    }
    document.getElementById(`${dayNum}col`).style.color = "yellow";
}

function getInfoStr(item) {
    return `${item.coursename}\n${item.teacher}\n${item.location}\n\n`;
}

populate();
