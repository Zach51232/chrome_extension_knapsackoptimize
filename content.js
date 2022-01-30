const addAnotherBtn = document.getElementById("addMore")
if(addAnotherBtn){
    addAnotherBtn.addEventListener('click', addAnotherRow);
}

var clicked=false;
const submitBtn = document.getElementById("submitOne")
if(submitBtn){
    submitBtn.addEventListener('click', knapAlgo);
}
const removeBtn = document.getElementById("removeBtn")
if(removeBtn){
    removeBtn.addEventListener('click', removeRow);
}
const addToCalendarBtn = document.getElementById("addToCalendarBtn")

if(addToCalendarBtn){
    addToCalendarBtn.addEventListener('click',addToCalendar)
}



globalThis.itemsToDo=[]

function addAnotherRow(){
    /* Add a row to the table*/
    var table = document.getElementById("table")
    var numRows = table.rows.length;
    var row= table.insertRow(numRows);
    //Add label and input in a td
    var id = ''
    for(let i=0; i<3; i++){
        var td = row.insertCell(i);

        //Make a new label
        var label = document.createElement("label")
        if(i==0) {id='activity'+(numRows); label.text = 'Activity'}
        if(i==1) {id='time'+(numRows); label.text='Time required'}
        if(i==2) {id='rank'+(numRows); label.text='Rank'}
        label.setAttribute('for',id)

        //Make a new input
        if(i!=2){
            var input = document.createElement("input")
            if(i==0) input.setAttribute('type','text')
            else input.setAttribute('type','number')
        }
        else{
            var input = document.createElement("select")
            var nameOfOption = 'option'
            let j = 3;
            for(let i =0; i<3; i++){
                var option = document.createElement("option")
                option.setAttribute('value',id+nameOfOption+i)
                option.text = j
                input.add(option)
                j--;
            }
        }
        input.setAttribute('id',id)
        //Attach the label and input to the td
        td.appendChild(label);
        td.appendChild(input);
    }
}

function removeRow(){
var table = document.getElementById("table")
let numRows = table.rows.length;
if(numRows==1){
    return
}
document.getElementsByTagName("tr")[numRows-1].remove();
}
function knapAlgo(){
    runKnap()
 //   var table = knapSackTable(capacity, weights, values);
 //   knapSackAnalysis(table, items, capacity, values, weights);

    //Show the output
//    displayOutput()
}
function runKnap(){
    //Find time/capacity

    var beginningTime = document.getElementById('beginning-time').value;
    var endingTime = document.getElementById('ending-time').value;
    var minutes = document.getElementById('minutes-given').value;

    /*Look at times they gave
        alert(beginningTime)
        alert(endingTime)
        alert(minutes)
*/
var msg ='';
var usedMinutes = false;
var capacity =0;
//If dates put in were invalid, send message saying so and use minutes if there.
if(beginningTime>endingTime||(beginningTime==''||endingTime=='')){
    if(beginningTime>endingTime){
        msg+='Your beginning time was after your end time, '
    }
    else if(beginningTime==''||endingTime==''){
        msg+='You left time blank, '
    }
    if(minutes!=''&&minutes>0){
        msg+='so your minutes were used.'
        usedMinutes=true
        capacity=minutes
  //      alert(msg)
    }
    else{
        msg+='and your minutes were <=0, so make it positive or put in a time!'
        alert(msg)
        return
    }
}

//If dates were valid, find the amount we have in minutes:
if(!usedMinutes){
    let beginHour = parseInt(beginningTime.substring(0,2))
    let endHour = parseInt(endingTime.substring(0,2));
    let diffHrs = (endHour-beginHour)*60;

    let beginMin = parseInt(beginningTime.substring(3))
    let endMin = parseInt(endingTime.substring(3))
    let diffMinutes = endMin-beginMin  
    capacity = diffHrs+diffMinutes;
}
   // alert('Time you have is:'+capacity)
    

    //Get items, vals, and weights, by looping through # of rows of the table.
    var table = document.getElementById("table")
    var numRows = table.rows.length;
    var items = []
    var times = []
    var values = []
    var table1 =''
    var table2=''
    var table3=''
    for(let i=0; i<numRows; i++){
        itemObj = document.getElementById('activity'+i)
        timeObj= document.getElementById('time'+i)
        rankObj = document.getElementById('rank'+i)
        if(itemObj.value==''||timeObj.value==''||rankObj.value==''){
            alert("You've left an activity or time empty. Fill it in, then run again!")
            return
        }
        item = itemObj.value
        time = timeObj.value
        rank = rankObj.options[rankObj.selectedIndex].text

        items.push(item)
        times.push(time)
        values.push(rank)
        table1+=item+','
        table2+=time+','
        table3+=rank+','
    }
  /*To test if the form works:
    var text = document.createElement('text')
    text.innerHTML=table1+'/'+table2+'/'+table3
    bigDiv.appendChild(text)
    */

    var table = knapSackTable(capacity, times, values);
    
    //Printing the table out -------------
    /*
    var br1=document.createElement('br')
    bigDiv.appendChild(br1)

    for(var i = 0; i<=items.length; i++){
        var text1=document.createElement('text')
        text1.innerHTML='['
        bigDiv.appendChild(text1)
        for(let j =0; j<=capacity;j++){
               var text=document.createElement('text')
               j == capacity ? text.innerHTML=table[i][j]: text.innerHTML=table[i][j]+' '
               bigDiv.appendChild(text)
        }
        var text2=document.createElement('text')
        text2.innerHTML=']'
        bigDiv.appendChild(text2)
        var br2=document.createElement('br')
        bigDiv.appendChild(br2)
    }

   ----------------- */
    globalThis.itemsToDo = knapSackAnalysis(table, items, capacity, values, times);
    //Note: these items assume a contiguous chunk of time. See the ? at the top of the extension popup to read more on this topic.
    itemsToDo.reverse()
    //Print output:
    findItemTimes(itemsToDo, items, times, capacity);
    timesUsed.reverse()
    displayOutput(itemsToDo, times, times, capacity);
}


//Gives us the table to send to analysis
function knapSackTable(capacity, weights, values) {
    const size = values.length;

    //6 rows, 0->5 (row 1 = item 1)
    var table = new Array(size + 1);
    //capacity # of cols+1, 0->capacity (includes capacity as an option)
    for (let i = 0; i < size + 1; i++) {
        table[i] = new Array(capacity + 1);
    }
    //set all to 0 in row 0 and col 0
    for (let i = 0; i <= size; i++) {
        table[i][0] = 0;
    }
    for (let i = 0; i <= capacity; i++) {
        table[0][i] = 0;
    }
    for (let i = 1; i <= size; i++) {
        //get the val,weight of items (item 1 = index 0)
        var value = values[i - 1], weight = weights[i - 1];
        for (let j = 1; j <= capacity; j++) {
            //if we didnt pick the item, get without it same capacity
            table[i][j] = table[i - 1][j];
            //if we pick the item since it fits, AND its better, add it
            if (j >= weight && Number(table[i - 1][j - weight]) + Number(value) > table[i - 1][j]) {
                table[i][j] = Number(table[i - 1][j - weight]) + Number(value);
            }
        }
    }
    return table;
}


//Gives us the answers to output
function knapSackAnalysis(table, items, capacity, values, weights) {
    const total = capacity;
    var answer = [];
    var indexAns = 0;
    for (let i = items.length; i > 0; i--) {
        //i.e. adding it helped
        if (table[i][capacity] != table[i - 1][capacity]) {
            indexAns = i - 1;
            answer.push(indexAns);
            capacity -= weights[indexAns];
        }
    }
    //Take the right indices and format it:
    var pickedItems = [];
    var pickedWeights = [];
    var pickedValues = [];
    for (let i = 0; i < answer.length; i++) {
        let j = answer[i];
        pickedItems.push(items[j]);
        pickedValues.push(values[j]);
        pickedWeights.push(weights[j]);
    }
    var totalWeight = 0;
    var totalValue = 0;
    for (let i = 0; i < pickedItems.length; i++) {
        totalWeight += Number(pickedWeights[i]);
        totalValue += Number(pickedValues[i]);
    }
    return pickedItems;
}

function displayOutput(itemsToDo, items, times, capacity){
    var outpDiv = document.getElementById("output")

    if(!clicked){
        var label = document.createElement("text")
        label.innerHTML = 'These are the items you should pick: '
        label.style.fontWeight = 'bold';

        const br = document.createElement('br')
        outpDiv.appendChild(label)
        outpDiv.appendChild(br)
        clicked=true;
        displayOutput(itemsToDo)
    }
    else{
        var newDivExists = document.getElementById('newDiv')
        if(newDivExists){
            newDivExists.parentNode.removeChild(newDivExists)
        }
        var newDiv = document.createElement('div')
        newDiv.setAttribute('id','newDiv')
        for(let i =0; i<itemsToDo.length;i++){
            var thing =document.createElement('text')
            if(i!=itemsToDo.length-1){
                thing.innerHTML = itemsToDo[i]+', and '
            }
            else{
                thing.innerHTML=itemsToDo[i]+'.'
            }
            var br2 = document.createElement('br')
            newDiv.appendChild(thing)
        }
        newDiv.appendChild(br2)
        document.getElementById('addToCalendarBtn').style.visibility='visible';
        outpDiv.appendChild(newDiv)
    }
}

function addToCalendar(){
    var linkDiv= document.getElementById('calendar-links')
    globalThis.timeStart = new Date()

    //Make the link
    var link = generateCalendarLink(0);
    var a = document.createElement('a')
    a.setAttribute('href', link)
    a.innerHTML= link
    var label = document.createElement('label')
    label.innerHTML ='Cmd/Ctrl+Click to open link in new tab and add from description: '
    linkDiv.appendChild(label)
    linkDiv.appendChild(a)
}
function generateCalendarLink(i){
    var link ='https://calendar.google.com/calendar/r/eventedit'
    var nameOfEvent='';
    if(i==0){
        nameOfEvent = '?text='+itemsToDo[i]+'&'
    }
    else{
        nameOfEvent = '%3Ftext='+itemsToDo[i]+'%26'
    }
    link+=nameOfEvent

    //Gotta change the date to be correct formatting
    var beginningTime = timeStart.toISOString()
    timeStart.setMinutes(Number(timeStart.getMinutes())+Number(timesUsed[i]))
    var endingTime = timeStart.toISOString()

    beginningTime = beginningTime.replace(/\W/g, '')
    endingTime = endingTime.replace(/\W/g, '')

    var dates = 'dates='+beginningTime+'/'+endingTime
    
    link+=dates

    //If I want to add this functionality, I can:

    var ctz =''
    link+=ctz

    //Set the details as the links to other calendars - since leaving the tab
    //closes the extension, this is a work around
    var details = '';

    if(i==0){
        details='&details='
        for(let i=1; i<itemsToDo.length;i++){
            console.log('in for loop line 350 -> i='+i+'link='+link)
            details+= 'Link to add%3A %3Ca href=%22'+generateCalendarLink(i)+'%22%3E'+itemsToDo[i]+'%3C%2Fa%3E'
            if(i!=itemsToDo.length-1){
                details+='%0A%0A'
            }
        }
        link+=details    
    }
    var location = ''
    console.log('i='+i+', and link = '+link)
    return link
}


  //https://stackoverflow.com/questions/5831877/how-do-i-create-a-link-to-add-an-entry-to-a-calendar 
//     https://calendar.google.com/calendar/r/eventedit


// text (name of the event)
// dates (ISO date format, startdate/enddate - must have both start and end time)
// an event w/ start/end times: 20131208T160000/20131208T180000
// all day events, you can use 20131208/20131209 - end date must be +1 day to whatever you want the end date to be.
// ctz (timezone such as America/New_York - leave blank to use the user's default timezone. Highly recommended to include this in almost all situations. For example, a reminder for a video conference: if three people in different timezones clicked this link and set a reminder for their "own" Tuesday at 10:00am, this would not work out well.)
// details (url encoded event description/details)
// location (url encoded location of the event - make sure it's an address google maps can read easily)
// add (comma separated list of emails - adds guests to your new event)
function findItemTimes(itemsToDo, items, times, capacity){
    var timesToDo=[];
    var timeSpent= 0;

    for(let i =0; i<itemsToDo.length; i++){
        for(let j=0; j<items.length; j++){
            if(itemsToDo[i]==items[j]){
                timesToDo[i] = times[j]
                timeSpent+=Number(times[j])
            }
        }
    }
    alert('this will take up '+timeSpent+' of your '+capacity+' minutes.')
    globalThis.timesUsed = timesToDo;
    /*Checking its good up to now
    for(let i =0; i<timesToDo.length; i++){
        alert('We have outputted item: '+itemsToDo[i]+' with time: '+timesToDo[i])
    }
    */
}

function addInBunched(){
    alert('addInBunched')
}
function addManually(){
    alert('add Manually')
}