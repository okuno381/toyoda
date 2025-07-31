//-----------定数の宣言-----------
//HTML内の要素を定数にしておく（操作を簡単にするため）
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-btn");

//ゲームの制限時間
const timeLimit=25;

//-----------変数の宣言-----------
//現在のスコアを記録する変数
let score=0;

//ハイスコアを記録する変数
let highScore=0;

//敵の出現とタイマー用の変数(あとで止めるために必要)
let gameInterval;
let timerInterval;

//ゲームの制限時間カウントする変数
let timeLimitCount;

//-----------関数の宣言-----------
//ゲームスタート時に呼ばれる関数
function startGame () {

    score=0;//スコアを0に戻す
    timeLimitCount=timeLimit;//ゲームの制限時間を設定
    startButton.disabled=true;//ボタンを連打できないように無効化

    gameArea.innerHTML="";//ゲームエリアを空にする
    clearInterval(gameInterval);//前回のゲームが動いていたら止める
    clearInterval(timerInterval);

    //残り時間・スコア・ハイスコアを表示
    document.getElementById("score-area").textContent=`スコア:0/ハイスコア:${highScore}/残り:${timeLimitCount}s`;

    //1秒ごとに敵を出現させる
    gameInterval=setInterval(()=>{
        for(let i=0;i<3;i++){
            spawnEnemy();
        }
    },1000);

    //★1秒立った場合
    timerInterval=setInterval(()=>{

       timeLimitCount--;//残り秒数を1減らす
        

    //スコア表紙を更新
   if(timeLimitCount <=0) {

        clearInterval(gameInterval);//敵出現を止める
        clearInterval(timerInterval);//タイマーを止める
        startButton.disabled=false;//スタートボタンを再び有効にする

        //今回のスコアがハイスコアを超えたら保存する
        if(score>highScore){
            highScore=score;
            localStorage.setItem("highScore",highScore);//ブラウザに保存
        }

     //スコア表示
     let medal="🔰";
     if(score>=70){
        medal="👑神プレイヤー！";
     }else if(score>=50){
        medal="🏆エース！";
     }else if(score>=20){
        medal="🥉ナイス！";
     }
    
     document.getElementById("score-area").innerHTML=
     `🎉ゲーム終了！<br>スコア:${score}/ハイスコア:${highScore}<br>${medal}`;
    }
    },1000);
}

//敵キャラを１体出現させる関数
function spawnEnemy() {

     //divタグを作って、enemyクラスをつける
     const enemy = document.createElement("div");
     enemy.className = "enemy";

     //敵のサイズをランダムに設定(20px~100px)
     const size=Math.floor(Math.random()*50)+30;
     enemy.style.width=size+"px";
     enemy.style.height=size+"px";

     //ランダムカラー
     const colors=["#ff4c4c","#4cff4c","#4c4cff","#ffb84c","#b84cff"]
     const randomColor=colors[Math.floor(Math.random()*colors.length)];
     enemy.style.backgroundColor=randomColor;

     //ランダム形状(四角、丸、星)
     const shapes=[
        "square","circle","square","circle",
        "square","circle","square","circle",
        "square","star"
     ];
     const shape=shapes[Math.floor(Math.random()*shapes.length)];
     
     if(shape==="circle"){
        enemy.style.borderRadius="50%";
     }else if(shape==="star"){
        enemy.classList.add("star-shape");
        enemy.style.backgroundColor="transparent";

     //フォントサイズもサイズに応じて設定
     enemy.style.fontSize=size+"px";
    }

     //敵の出現位置（サイズを引いて画面からはみ出ないように）
     const maxX=gameArea.clientWidth-size; 
     const maxY=gameArea.clientHeight-size;
     enemy.style.left=Math.random()*maxX+"px";
     enemy.style.top=Math.random()*maxY+"px";

     //★敵をクリック（タップ）した場合
     enemy.addEventListener("click",()=> {

     gameArea.removeChild(enemy);//敵を消す

     if(enemy.classList.contains("star-shape")){
        score +=2;
     }else{
         score +=1;
    document.getElementById("score-area").textContent=
        `スコア:${score}/ハイスコア:${highScore}/残り:${timeLimitCount}s`;
     }
     //ハイスコアを更新
     if(score>highScore){
        highScore=score;
        localStorage.setItem("higScore",highScore);//保存
     }
     });

     //★3秒立った場合
     setTimeout(()=>{

    //タップされなければ自動で消す
    if(gameArea.contains(enemy)){
        gameArea.removeChild(enemy);
    }
},3000);

     //敵を画面に追加
    gameArea.appendChild(enemy);
}

//-----------実行時に呼ばれるところ-----------
//以前保存したハイスコアを読み込む(localStorageから取得)、なければ0
highScore=localStorage.getItem("higScore")||0;

//ハイスコアを画面に表示
document.getElementById("highscore").textContent=highScore;

//★「スタート」ボタンが押されたらゲーム開始
startButton.addEventListener("click",startGame);


