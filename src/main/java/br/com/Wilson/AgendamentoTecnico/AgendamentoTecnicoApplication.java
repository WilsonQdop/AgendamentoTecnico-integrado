package br.com.Wilson.AgendamentoTecnico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AgendamentoTecnicoApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgendamentoTecnicoApplication.class, args);
	}

}
