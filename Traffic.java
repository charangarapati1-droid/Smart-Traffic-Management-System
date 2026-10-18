package com.smarttraffic;

public class Traffic {

    private String roadName;
    private int vehicleCount;

    public Traffic(String roadName, int vehicleCount) {
        this.roadName = roadName;
        this.vehicleCount = vehicleCount;
    }

    public String getRoadName() {
        return roadName;
    }

    public int getVehicleCount() {
        return vehicleCount;
    }

    public String getDensity() {
        if (vehicleCount >= 50) {
            return "HIGH";
        } else if (vehicleCount >= 20) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    public int getGreenTime() {
        if (vehicleCount >= 50) {
            return 60;
        } else if (vehicleCount >= 20) {
            return 40;
        } else {
            return 20;
        }
    }
}