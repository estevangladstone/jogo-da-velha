<?php

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

if(count($request) > 0){
	if($method === 'GET'){
		if($request[0] === 'espera'){
			if(($buffer = file_get_contents('jogo.txt', NULL, NULL, 0, 19)) === false){
				$data = [
					'mensagem' => 'Erro do Jogo. Foi mal.',
					'vez' => -1
				];
				echo json_encode($data);
				return;
			}
			$oldState = explode(',', $buffer);
			$lastPlayer = array_pop($oldState);
			if($_GET['jogador'] == ($lastPlayer+1)%2){
				if(!array_key_exists(0, array_count_values($oldState))){
					$data = [
						'mensagem' => 'Acabou.',
						'vez' => 0
					];
					echo json_encode($data);
					return;
				}
				$data = [
					'estado' => $oldState,
					'vez' => $_GET['jogador']
				];
				echo json_encode($data);
			}
			else {
				$data = [
					'vez' => ($lastPlayer+1) % 2
				];
				echo json_encode($data);
			}
		}
	}
	if($method === 'POST'){
		if($request[0] === 'envia-jogada'){
			if(($buffer = file_get_contents('jogo.txt', NULL, NULL, 0, 19)) === false){
				echo json_encode(['sucesso' => false]);
				return;
			}
			$oldState = explode(',', $buffer);
			$lastPlayer = array_pop($oldState);
			$newState = $_POST['estado'];
			// colocar novo jogador na lista e salvar
			$newPlayer = $_POST['jogador'];
			array_push($newState, $newPlayer);
			$newState = implode(',', $newState);
			$file = file_put_contents('jogo.txt', $newState);
			echo json_encode(['sucesso' => true]);
		}
	}
}