package com.example.restservice;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ThreadLocalRandom;
import java.nio.charset.Charset;
import java.util.Random;
import java.util.stream.IntStream;
import java.util.Arrays;
import java.util.List;

@RestController
public class ValueController {

	@GetMapping("/value/{type}")
    public String value_endpoint(
            @PathVariable(value = "type") String type 
            ) {      
        String value = null;
        
        if(type.contains("integer")){
            int randomNum = ThreadLocalRandom.current().nextInt(1, 91);
            value = String.format("%d", randomNum);
        }
        else {
            int leftLimit = 97; // letter 'a'
            int rightLimit = 122; // letter 'z'
            int targetStringLength = 10;
            Random random = new Random();

            String generatedString = random.ints(leftLimit, rightLimit + 1)
              .limit(targetStringLength)
              .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
              .toString();

            value = generatedString;
        }
        return value;
    }

	@GetMapping("/value/arrayof/{n}/{type}")
    public String[] arrayOfValues_endpoint(
            @PathVariable(value = "n") Integer n,
            @PathVariable(value = "type") String type 
            ) {      
        String[] values = new String[n];
        
        for(int i = 0; i < n; i++){
            if(type.contains("integer")){
                int randomNum = ThreadLocalRandom.current().nextInt(1, 91);
                values[i] = String.format("%d", randomNum);
            }
            else {
                int leftLimit = 97; // letter 'a'
                int rightLimit = 122; // letter 'z'
                int targetStringLength = 10;
                Random random = new Random();

                String generatedString = random.ints(leftLimit, rightLimit + 1)
                  .limit(targetStringLength)
                  .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                  .toString();

                values[i] = generatedString;
            }
        }
        return values;
    }
}
