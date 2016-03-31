$(document).ready(function (){
	iniciaJogo();
});

var jogador = 1,
	sinalDoJogador = 'X',
	jogadorDaVez = 1,
	estadoDoJogo = [0,0,0,0,0,0,0,0,0];

var iniciaJogo = function(){
	$('.casa').on('click', function(){
		if(jogadorDaVez !== -1){
			if(jogadorDaVez === jogador){
				if($(this).text() === ''){
					escolheCasa(this, sinalDoJogador);
				} 
				else{
					alert('Escolha uma casa vazia!');
					return false;		
				}
			}
			else{
				alert('Espera sua vez, Vacilão!');
			}
		}
	});
}

var escolheCasa = function(casa, sinal){
	var casaId = casa.id.substring(casa.id.length - 1);
	console.log(casaId);

	$(casa).text(sinal);
	estadoDoJogo[casaId - 1] = sinal;
	jogadorDaVez = 0;

	$.ajax({
		method: 'post',
		dataType: 'json',
		url: window.location.href+'/game/envia-jogada',
		data: {
			estado: estadoDoJogo,
			jogador: jogador
		},
		success: function(){
			esperaVez();
		},
		error: function(jqXHR, textStatus){
			console.log(textStatus);
			console.log(jqXHR);
			alert('deu ruim');
		}
	});
}

var esperaVez = function(){
	$.ajax({
		method: 'get',
		dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: { jogador: jogador },
		url: window.location.href+'/game/espera',
		success: function(response){
			console.log(response);
			if(response.vez == jogador){
				atualizaJogo(response.estado);
			}
			else if(response.vez == -1){
				finalizaJogo(response.mensagem);
			}
			else{
				jogadorDaVez = response.vez;
				setTimeout(esperaVez, 1000);
			}
		},
		error: function(jqXHR, textStatus){
			console.log(textStatus);
			console.log(jqXHR);
		}
	});
}

var atualizaJogo = function(novoEstado){
	console.log('oe');
	for(var i = 0; i < 9; i++){
		console.log(estadoDoJogo[i]+' -> '+novoEstado[i]);
		if(novoEstado[i] != estadoDoJogo[i]){
			console.log('aqui');
			$('#casa'+(i+1)).text(novoEstado[i]);
		}
	}
	jogadorDaVez = jogador;
	$('.mensagem').text('Vez do Jogador '+jogador);
}

var finalizaJogo = function(mensagem){
	$('.mensagem').text('Fim de Jogo. '+mensagem);
	$('.casa').off();
}


