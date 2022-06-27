package com.example.restservice;
import java.util.concurrent.ThreadLocalRandom;
import java.nio.charset.Charset;
import java.util.Random;

public class Person {

	private final String name;
	private final Integer age;

	public Person() {
        this.name = null;
        this.age = null;
	}

	public String getName() {
        int leftLimit = 97; // letter 'a'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
          .limit(targetStringLength)
          .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
          .toString();
        return generatedString;
	}

    public Integer getAge() {
        int randomNum = ThreadLocalRandom.current().nextInt(1, 91);
        return randomNum;
    }
}
