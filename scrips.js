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
            if(info.isWin == true && Type == info.winner){
                broad.stopGame();
                if(confirm(`${Name} WIN !!!!%0Aplay again ?` )){
                    Start.setUp();
                }
                else{
                    location.reload();
                }
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
    let turn=[],dataBase =[],Colum,Rows;
    let chessBroad = document.querySelector("#chess-broad");
    const relocated = ()=>{
        chessBroad = document.querySelector("#chess-broad");
        result={ 
            isWin:false,
            winner: "",
        };
    };
    const starTurn =(t)=>{
        turn = [];
        turn.push(t);
        t == "X"?turn.push("O"):turn.push("X");
    }
    const genChessBroad = (row,col)=>{
        Colum = col;
        Rows = row;
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
        brd = document.querySelector("#chess-broad");
        let clearBroad = brd.querySelectorAll("div");
        clearBroad = Array.from(clearBroad);
        for(let i of clearBroad){
            i.remove();
        }
    }
    const _add = (row,col) =>{
        let square = document.createElement("div");
        square.setAttribute("data-position",`${row},${col}`)
        chessBroad.appendChild(square);
        _Click(square);
    }
    const _Click= (location)=>{
        location.addEventListener("click",()=>{
            let coordinates = location.dataset.position.split(",");
            _addToDataBase(coordinates,turn[0]);
            location.textContent = turn[0];
            location.setAttribute("class", turn[0]);
            _scanWin(coordinates,location.textContent);
            turn.push(turn.splice(0,1));
            lastMove = location;
        },{once : true})
    }
    const _scanWin = (coord,type)=>{
        let row = Number(coord[0]),col = Number(coord[1]);
        let match = {
            row : 0,
            column: 0,
            fSlash: 0,
            bSlash: 0,
        }
        for(let i =0; i< Colum;i++){
            if(match.row < 5){
                dataBase[row][i] == type?match.row++:match.row = 0;
            }
            if(match.column < 5){
                dataBase[i][col] == type?match.column++:match.column = 0;
            }
            if(match.bSlash < 5 ){
                dataBase[i][(col - row) + i] == type?match.bSlash++:match.bSlash = 0;
            }
            if(match.fSlash < 5){
                dataBase[i][(row + col) - i ] == type?match.fSlash++:match.fSlash = 0;
            }
        }
        for(let key in match){
            if(match[key] >= 5)
            {
                result.isWin = true;
                result.winner = type;
                break;
            }
        }
    }
    const _addToDataBase = (coord,type)=>{
        let num = 0,col = Number(coord[0]), row =Number(coord[1]);
        type == "X"?num = "X":num = "O";
        dataBase[col][row] = num;
    }
    return{starTurn,genChessBroad,showResult,stopGame,clear,showLocation,relocated,};
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
                if(playerNum.value == "PVP"){
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
        _randomType();
        let player1 = player(info[0]);
        let player2 = player(info[1]);
        player1.update(type[0]);
        player2.update(type[1]);
        _showPlayer(player1,player2);
        player1.imIWin(broad.showLocation());
        player2.imIWin(document.querySelector("#chess-broad"));
        broad.starTurn(player1.showtype());
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
function main(){
    Start.playerInfo();
}main();
