package com.example.workflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class Application {

    public static void main(String... args) {
        SpringApplication.run(Application.class, args);
    }
// #{value.questions.length > 0 && value.questions[value.questions.length].answer == null}
}

@RestController
@RequestMapping("/api")
class DemoController {
    @GetMapping("/demo")
    public String demo() {
        System.out.println("!!!!!!!!selammm");
        return "selam";
    }
}