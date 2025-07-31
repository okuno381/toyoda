//-----------定数の宣言-----------
//HTML内の要素を定数にしておく（操作を簡単にするため）
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-btn");

//ゲームの制限時間
const timeLimit=10;

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
    gameInterval=setInterval(spawnEnemy,1000);

    //★1秒立った場合
    timerInterval=setInterval(()=>{

        timeLimitCount--;//残り秒数を1減らす

    //スコア表紙を更新
    document.getElementById("score-area").textContent=`スコア:${score}/ハイスコア:${highScore}/残り:${timeLimitCount}s`;

    //時間切れになったらゲーム終了
    if(timeLimitCount <=0) {

        clearInterval(gameInterval);//敵出現を止める
        clearInterval(timerInterval);//タイマーを止める
        startButton.disabled=false;//スタートボタンを再び有効にする

        //今回のスコアがハイスコアを超えたら保存する
        if(score>highScore){
            highScore=score;
            localStorage.setItem("highScore",highScore);//ブラウザに保存
        }

        //最終結果を表示
        document.getElementById("score-area").textContent=`🎉ゲーム終了！スコア:${score}/ハイスコア:${highScore}s`;

      }
    },1000);
}

//敵キャラを１体出現させる関数
function spawnEnemy() {

     //divタグを作って、enemyクラスをつける
     const enemy = document.createElement("div");
     enemy.className = "enemy";

     //敵の出現位置（画面内のランダムな場所）
     const maxX=gameArea.clientWidth-60; //敵の幅ぶん引いてる
     const maxY=gameArea.clientHeight-60;
     enemy.style.left=Math.random()*maxX+"px";
     enemy.style.top=Math.random()*maxY+"px";

     //★敵をクリック（タップ）した場合
     enemy.addEventListener("click",()=> {

     gameArea.removeChild(enemy);//敵を消す
     score++;//スコアを1加算

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

//ゲームエリアに青系グラデーション背景を設定
document.addEventListener("DOMContentLoaded",()=>{
    const gameArea=document.getElementById("game-area");
    gameArea.style.background="llinear=gradient(to bottom,#2193b0,#6dd5ed)";
});

