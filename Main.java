package com.smarttraffic;

public class Main {

    public static void main(String[] args) {

        TrafficController trafficController = new TrafficController();
        EmergencyController emergencyController = new EmergencyController();

        Traffic north = new Traffic("North", 25);
        Traffic south = new Traffic("South", 60);
        Traffic east = new Traffic("East", 15);
        Traffic west = new Traffic("West", 40);

        trafficController.addTraffic(north);
        trafficController.addTraffic(south);
        trafficController.addTraffic(east);
        trafficController.addTraffic(west);
        trafficController.showTraffic();

        Traffic highestTraffic = trafficController.getHighestTraffic();

        System.out.println();
        System.out.println("Next GREEN signal: "
                + highestTraffic.getRoadName());

        System.out.println();
        emergencyController.reportEmergency("East", "Ambulance");

        System.out.println();
        emergencyController.clearEmergency();

        System.out.println();
        System.out.println("After emergency:");
        highestTraffic = trafficController.getHighestTraffic();

        System.out.println("Next GREEN signal: "
                + highestTraffic.getRoadName());
    }
}