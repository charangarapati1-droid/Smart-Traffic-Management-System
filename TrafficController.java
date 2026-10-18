package com.smarttraffic;

import java.util.ArrayList;

public class TrafficController {

    private ArrayList<Traffic> trafficList;

    public TrafficController() {
        trafficList = new ArrayList<>();
    }

    public void addTraffic(Traffic traffic) {
        trafficList.add(traffic);
    }

    public void showTraffic() {
        System.out.println("===== TRAFFIC STATUS =====");

        for (Traffic traffic : trafficList) {
            System.out.println(
                    traffic.getRoadName() + " | " +
                            traffic.getVehicleCount() + " vehicles | " +
                            traffic.getDensity() + " | " +
                            traffic.getGreenTime() + " seconds"
            );
        }
    }

    public Traffic getHighestTraffic() {

        Traffic highest = trafficList.get(0);

        for (Traffic traffic : trafficList) {

            if (traffic.getVehicleCount() > highest.getVehicleCount()) {
                highest = traffic;
            }
        }

        return highest;
    }
}