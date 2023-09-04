const second = 1000;
const player = (name) =>{
    const Name = name;
    let Type;
    let info = broad.showResult();
    const update = (type)=>{
        Type = type;
    }
    const showtype = () =>{
        return Type;
    }
    const imIWin = (chessBoard)=>{
        chessBoard.addEventListener("click",()=>{
            info = broad.showResult();
            if(info.isWin == true && Type == info.winner){
                broad.stopGame();
                broad.changeColor(info.location);
                setTimeout(()=>{if(confirm(`${Name} WIN !!!! Play again ?`)){
                    Start.setUp();
                }
                else{
                    location.reload();
                }},second);
            }
        })
    }
    return{Name,showtype,imIWin,update,};
};
const broad = (()=> {
    let lastMove,result={ 
        isWin:false,
        winner: "",
    };
    let turn,dataBase =[],Colum,Rows;
    let chessBroad = document.querySelector("#chess-broad");
    const relocated = ()=>{
        chessBroad = document.querySelector("#chess-broad");
        result={ 
            isWin:false,
            winner: "",
            location:[],
        };
    };
    const showDataBase = ()=>{
        return dataBase;
    }
    const genChessBroad = (row,col)=>{
        Colum = col;
        Rows = row;
        turn=["X","O"];
        for(let x = 0; x < row; x++){
            dataBase[x] = [] 
            for(let y =0; y < col; y++){
                _add(x,y);
                dataBase[x].push("0");
            } 
        }
    }
    const showResult = ()=>{
        return result;
    }
    const showLocation = () =>{
        return chessBroad;
    }
    const stopGame = ()=>{
        let newBroad = chessBroad.cloneNode(true);
        chessBroad.parentNode.replaceChild(newBroad,chessBroad);
    }
    const clear = ()=>{
        let brd = document.querySelector("#chess-broad");
        let clearBroad = brd.querySelectorAll("div");
        clearBroad = Array.from(clearBroad);
        for(let i of clearBroad){
            i.remove();
        }
    }
    const changeColor = (arr) =>{
        for(let i of arr){
            let node = document.querySelector(`[data-position = "${i}"]`);
            node.classList += " win";
        }
    }
    const _add = (row,col) =>{
        let square = document.createElement("div");
        square.setAttribute("data-position",`${row},${col}`)
        chessBroad.appendChild(square);
        _Click(square);
    }
    const _Click= (box)=>{
        box.addEventListener("click",()=>{
            let coordinates = box.dataset.position.split(",");
            _addToDataBase(coordinates,turn[0]);
            box.textContent = turn[0];
            box.setAttribute("class", turn[0]);
            result = scanWin(coordinates,box.textContent,dataBase,5);
            turn.push(turn.splice(0,1));
            if(Bot.showStatus().active == true && Bot.showStatus().myTurn == true){
                Bot.updateStatus(false);
                setTimeout(()=>{Bot.caculateMove(box,turn[1])},0);   
            }else if(Bot.showStatus().active == true && Bot.showStatus().myTurn == false){
                Bot.updateStatus(true);
            }
            lastMove = box;
        },{once : true})
    }
    const scanWin = (coord,type,data,condition)=>{
        let row = Number(coord[0]),col = Number(coord[1]);
        let match = {
            row : [],
            column: [],
            fSlash: [],
            bSlash: [],
        }, scanRe ={
            isWin:false,
            winner: "",
        },stop = {
            row : [false,false],
            column: [false,false],
            fSlash: [false,false],
            bSlash: [false,false],
        },stopPoint=[[0,0],[0,0],[0,0],[0,0]];
        for(let i =0; i< 5;i++){
            if(col-i>=0 && col-i < 45 && row < 45){
                if(data[row][col-i] == type && stop.row[0] === false){
                    match.row.push(`${row},${col-i}`);
                }else{
                    stop.row[0] = true;
                    stopPoint[0][0]=[row,col-i];
                }
            }
            if(row<45 && col+i+1 <45){
                if(data[row][col+i+1] == type && stop.row[1] === false){
                    match.row.push(`${row},${col+i+1}`)
                }else{
                    stop.row[1] = true;
                    stopPoint[0][1]=[row,col+i+1];
                }
            }
            if(row-i>=0 && col <45 && row-i <45 ){
                if(data[row-i][col] == type && stop.column[0] === false){
                    match.column.push(`${row-i},${col}`)
                }else{
                    stop.column[0] = true;
                    stopPoint[1][0]=[row-i,col];
                }
            }
            if(row+i+1<45 && col<45){
                if(data[row+i+1][col] == type && stop.column[1] === false){
                    match.column.push(`${row+i+1},${col}`)
                }else{
                   stop.column[1] = true;
                   stopPoint[1][1]=[row+i+1,col];
                }
            }
            if(row-i >=0 && col-i >=0 && row-i <45 &&col-i <45){
                if(data[row-i][col-i] == type && stop.bSlash[0] === false){
                    match.bSlash.push(`${row-i},${col-i}`)
                }else{
                    stop.bSlash[0] = true;
                    stopPoint[2][0] = [row-i,col-i];
                }
            }
            if(row+i+1< 45 && col+i+1 < 45){
                if(data[row+i+1][col+i+1] == type && stop.bSlash[1] === false){
                    match.bSlash.push(`${row+i+1},${col+i+1}`)
                }else{
                    stop.bSlash[1] = true;
                    stopPoint[2][1] = [row+i+1,col+i+1];
                }
            }
            if(row-i >=0 && row-i <45 && col+i <45){
                if(data[row-i][col+i] == type && stop.fSlash[0] === false){
                    match.fSlash.push(`${row-i},${col+i}`)
                }else{
                    stop.fSlash[0] = true;
                    stopPoint[3][0]= [row-i,col+i];
                }
            }
            if(col-i-1 >=0 && row+i+1 <45 &&col-i-1<45){
                if(data[row+i+1][col-i-1] == type && stop.fSlash[1] === false){
                    match.fSlash.push(`${row+i+1},${col-i-1}`)
                }else{
                    stop.fSlash[1] = true;
                    stopPoint[3][1]= [row+i+1,col-i-1];
                }
            }
            
        }
        let num = 0; stopRow1=0,stopCol1=0,stopRow2=0,stopCol2=0;
        for(let key in match){
            stopRow1 = stopPoint[num][0][0];
            stopCol1 = stopPoint[num][0][1];
            stopRow2 = stopPoint[num][1][0];
            stopCol2 = stopPoint[num][1][1];
            if(match[key].length >= condition)
            {
                if(match[key].length < 5 && data[stopRow1,stopCol1] == data[stopRow2,stopCol2] 
                    && (data[stopRow1,stopCol1] =="X" || data[stopRow1,stopCol1] =="O")
                    && (data[stopRow2,stopCol2] =="X" || data[stopRow2,stopCol2] =="O")){
                    continue;
                }
                scanRe.isWin = true;
                scanRe.winner = type;
                scanRe.location = match[key]
                break;
            }
            num++
        }
        return scanRe;
    }
    const _addToDataBase = (coord,type)=>{
        let num = 0,col = Number(coord[0]), row =Number(coord[1]);
        type == "X"?num = "X":num = "O";
        dataBase[col][row] = num;
    }
    return{genChessBroad,showResult,stopGame,clear,showLocation,relocated,showDataBase,changeColor,scanWin,DT:dataBase,};
})();
const Start = (()=>{
    let body = document.querySelector("#body-box");
    let info = [],restore,type;
    const playerInfo = ()=>{
        let form = document.querySelector("#player-info-box"),
        playerNum = document.querySelector("#number-of-player"),
        player2Form = document.querySelector("#player2-form"),
        playerlocation = document.querySelectorAll(".player-info");
        playerlocation = Array.from(playerlocation);
        playerNum.value == "solo"?player2Form.setAttribute("class","hide"):player2Form.setAttribute("class","show");
        form.addEventListener("click",(e)=>{
            playerNum.value == "solo"?player2Form.setAttribute("class","hide"):player2Form.setAttribute("class","show");
            if(e.target.classList == "start-button"){
                info =[];
                info.push(playerlocation[0].value);
                if(info[0] == "" ){
                    return;
                }
                if(playerNum.value == "solo"){
                    info.push("!BOT!");
                }
                else if(playerNum.value == "PVP"){
                    info.push(playerlocation[1].value)
                    if(info[1] == "" ){
                        return;
                    }
                }
                restore = form.cloneNode(true);
                let showbody = body.querySelectorAll(".hide");
                showbody.forEach(element =>{
                 element.setAttribute("class","show");
                })
                setUp();
                form.remove();
            }
        })
    }
    const _showPlayer =(p1,p2)=>{
        let p1Location = document.querySelector("#player1");
        let p2Location = document.querySelector("#player2");
        p1Location.innerHTML = `Player 1: ${p1.Name} <br> using:${p1.showtype()}`;
        p2Location.innerHTML = `Player 2: ${p2.Name} <br> using:${p2.showtype()}`;
    }
    const setUp=()=>{
        broad.relocated();
        broad.clear();
        Bot.isActive(info[1]);
        info[1] == "!BOT!"?type = ["X","O"]:_randomType();
        let player1 = player(info[0]);
        let player2 = player(info[1]);
        player1.update(type[0]);
        player2.update(type[1]);
        _showPlayer(player1,player2);
        player1.imIWin(document.querySelector("#chess-broad"));
        player2.imIWin(document.querySelector("#chess-broad"));
        Bot.showStatus().active == true?Bot.showStatus().myTurn = true:"";
        broad.genChessBroad(45,45);
        alert("X go first");
    }
    const _randomType = ()=>{
        let random = Math.floor(Math.random()*2)
        type = [];
        if(random == 0){
            type.push("X");
            type.push("O");
        }
        else{
            type.push("O");
            type.push("X");
        }
    }
    return {playerInfo,setUp}
})();

const Bot = (()=>{
    let coordinates = [],status = {
        active : false,
        myTurn: true,
    };
    let localDatabase,minimax={},counter = 0;
    const _scanWin = broad.scanWin;
    const caculateMove = (playerchoice,type)=>{
        let best;
        type == "X"?(status.Ptype = "X",status.Mytype = "O"):(status.Ptype = "O",status.Mytype = "X");
        localDatabase = _cloneArr(broad.showDataBase(),2);
        coordinates = playerchoice.dataset.position.split(",");
        localDatabase = _scanStamp(coordinates,localDatabase,"","");
        best = _randoMove(coordinates,localDatabase);
        if(_iswin(coordinates,type,localDatabase.data,5) == true){
            return;
        }
        _simulate(coordinates,localDatabase,type,0);
        for(let i in minimax){
            if(_findBigest(minimax[i])!=0){
                best = _bestPossibility(minimax[i],"big");
                break;
            }else if(_findLowest(minimax[i])!=0){
                best = _bestPossibility(minimax[i],"small");
                break;
            }
        }
        
        let move = document.querySelector(`[data-position ='${best[0]},${best[1]}']`);
        move.dispatchEvent(new Event('click', {bubbles:true}));
        minimax = {};
    }
    const _scanStamp = (coord,data,item,replace)=>{
        let Data = _cloneArr(data,2);
        let index = 1,row = Number(coord[0]), col = Number(coord[1]),slot = [];
        let corner = [row-10,col-10],rScan,cScan,scanLocation,condition=21;
        let replaceCheck = false;
        for(let i = 0; i < condition;i++){
            for(let j = 0;j < condition;j++){
                rScan = corner[0]+i;
                cScan = corner[1]+j;
                if((rScan >= 0 && cScan >= 0) && (rScan < 45 && cScan <45)){
                    if(Data[rScan][cScan] != "X" && Data[rScan][cScan] != "O"){
                        if (Data[rScan][cScan] == item){
                            Data[rScan][cScan] = replace;
                            scanLocation =[rScan,cScan];
                            replaceCheck = true;
                        }
                        else if(replace == ""){
                            Data[rScan][cScan] = index;
                            slot.push(index);
                            index++;
                        }
                    }
                }
            }
        }
        return {data:Data,slot:slot,scanlocaton:scanLocation};
    }

    const _simulate = (coord,data,type,depth) =>{
        if(depth >2){
            return;
        }
        let text;
        if(minimax[depth] == undefined){
            minimax[depth] = [];
        }
        (type == "X")?text ="O":(type=="O")?text="X":"";
        for(let i of localDatabase.slot){
            let simData = _scanStamp(coord,data.data,i,text);
            minimax[depth][i] == undefined? minimax[depth][i] = 0:"";
            if(simData.scanlocaton == undefined){
                continue;
            }
            let alone = _alone(simData.scanlocaton,simData.data);
            if(alone == true){
                continue;
            }
            if(i == 1 && depth == 1 ){
            }
            let iWin = _iswin(simData.scanlocaton,text,simData.data,4);
            if(iWin != true){
                minimax[depth][i] += 0;
                _simulate(coord,simData,text,depth+1); 
            }
            else if(iWin == true){
                (text == status.Mtype)?minimax[depth][i] +=1: minimax[depth][i]-=1;
            }
        }
    }
    const _randoMove= (coord,data)=>{
        let arr =[];row = Number(coord[0]) -1 ;col = Number(coord[1]) -1;
        for(let i = 0;i <3;i++){
            for(let j =0;j<3;j++){
                if(row + i >= 0 && col+ j >=0 && row + i < 45 && col+ j <45){
                    let condition = data.data[row + i][col+ j];
                    if(condition !="X" && condition != "O"){
                    arr.push(`${row + i},${col+j}`);
                    }
                }   
            }
        }
        return arr = arr[_random(arr)].split(",");
    }
    const _bestPossibility = (arr,mode)=>{
        let newArr,i=0, bestPoint;
        if(mode == "big"){
            bestPoint = _findBigest(arr);
        }else if(mode ="small"){
            bestPoint = _findLowest(arr);
        }
        let bestIndex = arr.indexOf(bestPoint);
        let index =[] ;
        while(localDatabase.data[i] != undefined){
                let bestLocation = localDatabase.data[i].indexOf(bestIndex);
                if(bestLocation != -1){
                    console.log(bestPoint,bestIndex, i,bestLocation);
                    newArr = [i,bestLocation];
                    console.log(bestPoint,bestIndex, i,bestLocation);
                }
                i++;
        }
        return newArr;
    }
    const _alone = (coord,data)=>{
        let amI = true;row = coord[0] - 1, col = coord[1] -1;
        for(let i = 0;i<3;i++){
            for(let j =0;j<3;j++){
                if(row+i >= 0 && col+i >= 0 && row+i < 45 && col+i < 45){
                    if(row+ i != coord[0] && col +j != coord[1]){
                        if(data[row+ i][col +j] == "X" || data[row+ i][col +j] == "O"){
                            return false;
                        }
                    }
                }
            }
        }
        return amI
    }
    const _cloneArr =(arr,di)=>{
        let newArr =[],index =0;
        if(di == 2){
            arr.forEach((item)=>{
                newArr[index] = [];
                item.forEach(i=>{
                    newArr[index].push(i);
                })
                index++;
            })
        }
        else if(di == 1){
            arr.forEach(item =>{
                newArr.push(item);
            })
            index++;
        }
        return newArr;
    }
    const _findBigest = (arr) =>{
        arr = _cloneArr(arr,1);
        arr.sort((a,b)=>{
            return b-a;
        });
        return arr[0];
    }
    const _findLowest = (arr) =>{
        arr = _cloneArr(arr,1);
        arr.sort((a,b)=>{
            return a-b;
        });
        return arr[0];
    }
    const _random = (arr) =>{
        let random = Math.floor(Math.random()*arr.length);
        return random;
    }
    const _iswin = (coord,type,data,condition)=>{
        let result = _scanWin(coord,type,data,condition);
        return result.isWin;
    }
    const isActive = (text)=>{
        if(text == "!BOT!"){
            status.active = true;
        }
    }
    const updateStatus = (turn)=>{
        status.myTurn = turn;
    }
    const showStatus = ()=>{
        return status;
    }
    return {caculateMove,isActive,showStatus,updateStatus};
})();
function main(){
    Start.playerInfo();
}main();
