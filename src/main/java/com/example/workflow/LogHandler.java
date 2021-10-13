package com.example.workflow;

import org.camunda.bpm.client.spring.annotation.ExternalTaskSubscription;
import org.camunda.bpm.client.task.ExternalTask;
import org.camunda.bpm.client.task.ExternalTaskHandler;
import org.camunda.bpm.client.task.ExternalTaskService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@ExternalTaskSubscription("logProvider") // create a subscription for this topic name
public class LogHandler implements ExternalTaskHandler {

  @Override
  public void execute(ExternalTask externalTask, ExternalTaskService externalTaskService) {

    // only for the sake of this demonstration, we generate random data
    // in a real-world scenario, we would load the data from a database
    String customerId = "C-" + UUID.randomUUID().toString().substring(32);
    int creditScore = (int) (Math.random() * 11);

    VariableMap variables = Variables.createVariables();
    variables.put("customerId", customerId);
    variables.put("creditScore", creditScore);

    // complete the external task
    externalTaskService.complete(externalTask, variables);
  }

}