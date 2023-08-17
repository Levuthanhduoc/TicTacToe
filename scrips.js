const player = (name,chessType) =>{
    const Name = name;
    const Type = chessType
    const Move = () =>{
        return Type;
    }
    const hello = () =>{
        console.log("My name is "+ Name + " i use "+ Type);
    }
    return{Move,hello,};
};
const broad = (()=> {
    let lastMove;
    let turn=[];
    const chessBroad = document.querySelector("#chess-broad");
    const starTurn =(t)=>{
        turn.push(t);
        t == "X"?turn.push("O"):turn.push("X");
    }
    const add = () =>{
        let square = document.createElement("div");
        chessBroad.appendChild(square);
        _Click(square);
    }
    const _Click= (location)=>{
        location.addEventListener("click",()=>{
            location.textContent = turn[0];
            turn.push(turn.splice(0,1));
            lastMove = location;
        },{once : true})
    }
    return{add,starTurn};
})();
function main(){
    let player1 = player("jonh cena","X");
    let player2 = player("opappa","O");
    random() == 1?broad.starTurn(player1.Move()):broad.starTurn(player2.Move());
    for(let i = 0; i < (45 *45); i++){
        broad.add();
    }
}main();
function random(){
    return Math.floor(Math.random()*2);
}
