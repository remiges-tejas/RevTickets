package com.revtickets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for RevTickets - Movie Ticket Booking System
 */
@SpringBootApplication
@EnableScheduling
public class RevTicketsApplication {

    public static void main(String[] args) {
        SpringApplication.run(RevTicketsApplication.class, args);
    }
}
