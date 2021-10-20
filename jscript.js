var diryJ, dirxJ, jog, velJ, pjx, pjy;
var velT;
var tamTelaW, tamTelaH;
var jogo;
var frames;
var contBombas, painelContBombas, velB, tmpCriaBomba;
var bombasTotal;
var vidaPlaneta, barraPlaneta;
var ie,isom;
var telaMsg;

function teclaDw(){
    var tecla=event.keyCode;
    if (tecla==38){//cima
        diryJ=-1;
    }else if (tecla==40){//baixo
        diryJ=1;
    }
    if (tecla==37){//esquerda
        dirxJ=-1;
    }else if (tecla==39){//direita
        dirxJ=1;
    }
    if (tecla==32){//barra espaco / tiro
        atira(pjx+32, pjy);
    }
}

function teclaUp(){
    var tecla=event.keyCode;
    if ((tecla==38) || (tecla==40)){
        diryJ=0;
    }
    if ((tecla==37) || (tecla==39)){//esquerda
        dirxJ=0;
    }
}

function criaBomba(){
    if (jogo){
        var y= tamTelaW.value;  //bombas aparecem um pouco abaixo da margem superior
        var x=Math.random()*tamTelaW; //posição da bomba de 0 à largura da tela
        var bomba=document.createElement("div");
        var att1=document.createAttribute("class");
        var att2=document.createAttribute("style");
        att1.value="bomba";
        att2.value="top:"+y+"px;left:"+x+"px;";
        bomba.setAttributeNode(att1);
        bomba.setAttributeNode(att2);
        document.body.appendChild(bomba);
        contBombas--;
    }
}

function controlaBomba(){
    bombasTotal=document.getElementsByClassName("bomba");
    var tam=bombasTotal.length;
       for(var i=0;i<tam;i++){
        if(bombasTotal[i]){
            var pi=bombasTotal[i].offsetTop;
            pi+=velB;
            bombasTotal[i].style.top=pi+"px";
            if(pi>tamTelaH){
                vidaPlaneta-=10;
                criaExplosao(2,bombasTotal[i].offsetLeft, null);
                bombasTotal[i].remove();
            }
        }
    }
}

function atira(x,y){
    var t=document.createElement("div");
    var att1=document.createAttribute("class");
    var att2=document.createAttribute("style");
    att1.value="tiroJog";
    att2.value="top:"+y+"px; left:"+x+"px";
    t.setAttributeNode(att1);
    t.setAttributeNode(att2);
    document.body.appendChild(t);
}

function controleTiros(){
    var tiros=document.getElementsByClassName("tiroJog");
    var tam=tiros.length;
    for(var i=0;i<tam;i++){
        if(tiros[i]){
            var pt=tiros[i].offsetTop; 
            pt-=velT;
            tiros[i].style.top=pt+"px";
            colisaoTiroBomba(tiros[i]);
            if(pt<0){
                tiros[i].remove();
            }
        }
    }
}

function colisaoTiroBomba(tiro){
    var tam=bombasTotal.length;
    for(var i=0;i<tam;i++){
        if(bombasTotal[i]){ 
            if(
                (
                    (tiro.offsetTop<=(bombasTotal[i].offsetTop+37))&& //tiro com parte de baixo da bomba
                    ((tiro.offsetTop+6)>=(bombasTotal[i].offsetTop)) //tipo com parte de cima da bomba
                )
                &&
                (
                    (tiro.offsetLeft<=(bombasTotal[i].offsetLeft+23))&& //Esquerda do tiro com a parte direita da bomba
                    ((tiro.offsetLeft+6)>=(bombasTotal[i].offsetLeft)) //Direita do tiro com a parte esquerda da bomba
                )
            ){
                criaExplosao(1,bombasTotal[i].offsetLeft, bombasTotal[i].offsetTop);
                bombasTotal[i].remove();
                tiro.remove(); 
            }
        }
    }
}

function criaExplosao(tipo,x,y){ //Tipo1=ExplosaoAr | Tipo2=ExplosaoChao
    if(document.getElementById("explosao"+(ie-3))){
        document.getElementById("explosao"+(ie-3)).remove();
    }

    var explosao=document.createElement("div");
    var img=document.createElement("img");
    var som=document.createElement("audio");
    //Attributos para Div
    var att1=document.createAttribute("class");
    var att2=document.createAttribute("style");
    var att3=document.createAttribute("id");
    //Atributo para imagem
    var att4=document.createAttribute("src");
    //Atributos para audio
    var att5=document.createAttribute("src");
    var att6=document.createAttribute("id");

    att3.value="explosao"+ie;
    if(tipo==1){
        att1.value="explosaoAr";
        att2.value="top:"+y+"px;left:"+x+"px;";
        att4.value="explo_bomba.gif?"+new Date();
    }else{
        att1.value="explosaoChao";
        att2.value="top:"+(tamTelaH-40)+"px;left:"+(x-23)+"px;"; //tamanho da bomba
        att4.value="explo_bomba_terra.gif?"+new Date();
    }
    att5.value="explosao.mp3?"+new Date();
    att6.value="som"+isom;
    explosao.setAttributeNode(att1);
    explosao.setAttributeNode(att2);
    explosao.setAttributeNode(att3);
    img.setAttributeNode(att4);
    som.setAttributeNode(att5);
    som.setAttributeNode(att6);
    explosao.appendChild(img);
    explosao.appendChild(som);
    document.body.appendChild(explosao);
    document.getElementById("som"+isom).play();  
    ie++;
    isom++;
}

function controlaJogador(){
    pjy+=diryJ*velJ;
    pjx+=dirxJ*velJ;
    jog.style.top=pjy+"px";
    jog.style.left=pjx+"px";
}

function gerenciaGame(){
    barraPlaneta.style.width=vidaPlaneta+"px";
    if(contBombas<=0){
        jogo=false;
        clearInterval(tmpCriaBomba);
        telaMsg.style.backgroundImage="url(vitoria.png)";
        telaMsg.style.display="block";
    }
    if(vidaPlaneta<=0){
    jogo=false;
        clearInterval(tmpCriaBomba);
        telaMsg.style.backgroundImage="url(derrota.png)";
        telaMsg.style.display="block";
    }
}

function gameLoop(){
    if(jogo){
        //Funções de controle
        controlaJogador();
        controleTiros();
        controlaBomba();
    }
    gerenciaGame();
    frames=requestAnimationFrame(gameLoop);
}

function reinicia(){
    bombasTotal=document.getElementsByClassName("bomba");
    var tam=bombasTotal.length;
    for(var i=0;i<tam;i++){
        if(bombasTotal[i]){
            bombasTotal[i].remove();
        }
    }
    telaMsg.style.display="none";
    cancelAnimationFrame(frames);
    vidaPlaneta=300;
    pjx=tamTelaW/2;
    pjy=tamTelaH/2;
    jog.style.top=pjy+"px";
    jog.style.left=pjx+"px";
    contBombas=150;
    jogo=true;
    clearInterval(tmpCriaBomba); //limpa o intervalo
    tmpCriaBomba=setInterval(criaBomba, 1900);
    gameLoop();
}

function inicia(){
    jogo=false;

    //Inicia Tela
    tamTelaH=window.innerHeight;
    tamTelaW=window.innerWidth;

    //Inicia Jogador
    dirxJ=diryJ=0;
    pjx=tamTelaW/2;
    pjy=tamTelaH/2;
    velJ=velT=6;
    jog=document.getElementById("naveJog");
    jog.style.top=pjy+"px";
    jog.style.left=pjx+"px";

    //Controle das bombas
    contBombas=150;
    velB=3;
  
    //Controle do Planeta
    vidaPlaneta=300;
    barraPlaneta=document.getElementById("barraPlaneta");
    barraPlaneta.style.width=vidaPlaneta+"px";

    //Controle de Explosão
    ie=isom=0;

    //Controle de Telas
    telaMsg=document.getElementById("telaMsg");
    telaMsg.style.backgroundImage="url('abertura.png')";
    telaMsg.style.display="block";
    document.getElementById("btnJogar").addEventListener("click",reinicia);
}

window.addEventListener("load", inicia);
document.addEventListener("keydown", teclaDw);
document.addEventListener("keyup", teclaUp);

