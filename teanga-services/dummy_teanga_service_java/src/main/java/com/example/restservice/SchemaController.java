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
public class SchemaController {

	@GetMapping("/schema/{type}")
    public Person schema_endpoint(
            @PathVariable(value = "type") String type 
            ) {
		return new Person();
    }

	@GetMapping("/schema/arrayof/{n}/{type}")
    public Person[] arrayOfValues_endpoint(
            @PathVariable(value = "n") Integer n,
            @PathVariable(value = "type") String type 
            ) {      
         Person instances[] = new Person[n] ;
        
        for(int i = 0; i < n; i++){
            instances[i] = new Person();
        }
        return instances;
    }
}
