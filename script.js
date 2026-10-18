/* =========================================
   SMART TRAFFIC MANAGEMENT SYSTEM
   ADAPTIVE TRAFFIC SIGNAL SIMULATION
========================================= */

let trafficTimer = null;
let emergencyTimer = null;

let currentDirection = "";
let remainingTime = 0;
let emergencyActive = false;


/* =========================================
   TRAFFIC DENSITY
========================================= */

function getDensity(vehicleCount) {

    if (vehicleCount >= 50) {
        return "HIGH";
    }

    if (vehicleCount >= 20) {
        return "MEDIUM";
    }

    return "LOW";
}


/* =========================================
   GREEN TIME
========================================= */

function getGreenTime(vehicleCount) {

    if (vehicleCount >= 50) {
        return 60;
    }

    if (vehicleCount >= 20) {
        return 40;
    }

    return 20;
}


/* =========================================
   UPDATE TRAFFIC INFORMATION
========================================= */

function updateDirection(direction, vehicleCount) {

    document.getElementById(direction + "Count").innerText =
        vehicleCount;

    document.getElementById(direction + "Density").innerText =
        getDensity(vehicleCount);

    document.getElementById(direction + "Time").innerText =
        getGreenTime(vehicleCount) + " sec";
}


/* =========================================
   GET CURRENT TRAFFIC
========================================= */

function getTrafficData() {

    return {

        North: Number(document.getElementById("northInput").value),

        South: Number(document.getElementById("southInput").value),

        East: Number(document.getElementById("eastInput").value),

        West: Number(document.getElementById("westInput").value)

    };
}


/* =========================================
   FIND TRAFFIC PRIORITY ORDER
========================================= */

function getPriorityOrder() {

    let traffic = getTrafficData();

    return Object.keys(traffic).sort(function(a, b) {

        return traffic[b] - traffic[a];

    });
}


/* =========================================
   TURN ALL SIGNALS RED
========================================= */

function turnAllSignalsRed() {

    let directions = [
        "north",
        "south",
        "east",
        "west"
    ];


    directions.forEach(function(direction) {

        let light =
            document.querySelector("." + direction + "-light");

        if (!light) {
            return;
        }

        light.querySelector(".red").style.opacity = "1";

        light.querySelector(".yellow").style.opacity = "0.25";

        light.querySelector(".green").style.opacity = "0.25";

        light.querySelector(".green").style.boxShadow = "none";

    });
}


/* =========================================
   SET GREEN SIGNAL
========================================= */

function setGreenSignal(direction) {

    turnAllSignalsRed();


    let selectedLight =
        document.querySelector(
            "." + direction.toLowerCase() + "-light"
        );


    if (!selectedLight) {
        return;
    }


    selectedLight.querySelector(".red").style.opacity = "0.25";

    selectedLight.querySelector(".yellow").style.opacity = "0.25";

    selectedLight.querySelector(".green").style.opacity = "1";

    selectedLight.querySelector(".green").style.boxShadow =
        "0 0 18px #20e878";


    currentDirection = direction;
}


/* =========================================
   START NORMAL SIGNAL
========================================= */

function startSignal(direction) {

    if (emergencyActive) {
        return;
    }


    clearInterval(trafficTimer);


    let traffic =
        getTrafficData();

    let vehicleCount =
        traffic[direction];


    remainingTime =
        getGreenTime(vehicleCount);


    setGreenSignal(direction);


    updateSignalDisplay();


    trafficTimer = setInterval(function() {

        remainingTime--;

        updateSignalDisplay();


        if (remainingTime <= 0) {

            clearInterval(trafficTimer);

            moveToNextDirection();

        }

    }, 1000);
}


/* =========================================
   DISPLAY COUNTDOWN
========================================= */

function updateSignalDisplay() {

    let signalText =
        document.getElementById("currentSignal");


    if (!signalText) {
        return;
    }


    signalText.innerText =
        "🟢 GREEN: " +
        currentDirection.toUpperCase() +
        "  |  " +
        remainingTime +
        " sec remaining";
}


/* =========================================
   MOVE TO NEXT TRAFFIC PRIORITY
========================================= */

function moveToNextDirection() {

    if (emergencyActive) {
        return;
    }


    let priorityOrder =
        getPriorityOrder();


    let currentIndex =
        priorityOrder.indexOf(currentDirection);


    let nextIndex;


    if (currentIndex === -1 ||
        currentIndex === priorityOrder.length - 1) {

        /*
           Finished all roads.
           Read the traffic values again.
        */

        priorityOrder =
            getPriorityOrder();

        nextIndex = 0;

    } else {

        /*
           Move to the next busiest road.
        */

        nextIndex = currentIndex + 1;

    }


    startSignal(priorityOrder[nextIndex]);
}


/* =========================================
   UPDATE ALL TRAFFIC
========================================= */

function updateTraffic() {

    let traffic =
        getTrafficData();


    /* Prevent negative values */

    if (traffic.North < 0) traffic.North = 0;

    if (traffic.South < 0) traffic.South = 0;

    if (traffic.East < 0) traffic.East = 0;

    if (traffic.West < 0) traffic.West = 0;


    /* Update input values */

    document.getElementById("northInput").value =
        traffic.North;

    document.getElementById("southInput").value =
        traffic.South;

    document.getElementById("eastInput").value =
        traffic.East;

    document.getElementById("westInput").value =
        traffic.West;


    /* Update cards */

    updateDirection("north", traffic.North);

    updateDirection("south", traffic.South);

    updateDirection("east", traffic.East);

    updateDirection("west", traffic.West);


    /* Recalculate traffic priority */

    let priorityOrder =
        getPriorityOrder();


    /*
       Restart from the busiest road
       whenever traffic is manually updated.
    */

    if (!emergencyActive) {

        startSignal(priorityOrder[0]);

    }


    document.getElementById("emergencyStatus").innerText =
        "Traffic updated. " +
        priorityOrder[0] +
        " has the highest priority.";
}


/* =========================================
   REPORT EMERGENCY
========================================= */

function reportEmergency() {

    let vehicle =
        document.getElementById("vehicleType").value;


    let direction =
        document.getElementById("emergencyDirection").value;


    /* Stop normal signal timer */

    clearInterval(trafficTimer);


    /* Emergency mode */

    emergencyActive = true;


    /* Give emergency road GREEN */

    setGreenSignal(direction);


    /*
       Emergency vehicle gets
       a short automatic passage time.
    */

    remainingTime = 5;


    updateEmergencyDisplay(
        vehicle,
        direction
    );


    /*
       Show emergency vehicle
    */

    showEmergencyVehicle(direction);


    emergencyTimer =
        setInterval(function() {

            remainingTime--;

            updateEmergencyDisplay(
                vehicle,
                direction
            );


            if (remainingTime <= 0) {

                clearInterval(emergencyTimer);

                finishEmergency();

            }

        }, 1000);
}


/* =========================================
   EMERGENCY DISPLAY
========================================= */

function updateEmergencyDisplay(
    vehicle,
    direction
) {

    document.getElementById("currentSignal").innerText =
        "🚨 EMERGENCY: " +
        direction.toUpperCase() +
        " GREEN | " +
        remainingTime +
        " sec";


    document.getElementById("emergencyStatus").innerText =
        "🚨 " +
        vehicle +
        " approaching from " +
        direction +
        ". Emergency priority active.";
}


/* =========================================
   EMERGENCY FINISHED AUTOMATICALLY
========================================= */

function finishEmergency() {

    emergencyActive = false;


    document.getElementById("emergencyStatus").innerText =
        "✅ Emergency passage completed. Recalculating traffic...";


    /*
       Remove emergency vehicle
    */

    removeEmergencyVehicle();


    /*
       Recalculate traffic
    */

    let priorityOrder =
        getPriorityOrder();


    /*
       Give GREEN to the busiest
       road again.
    */

    setTimeout(function() {

        startSignal(priorityOrder[0]);


        document.getElementById("emergencyStatus").innerText =
            "Traffic control returned to normal. " +
            priorityOrder[0] +
            " has the highest priority.";

    }, 1500);
}


/* =========================================
   SHOW EMERGENCY VEHICLE
========================================= */

function showEmergencyVehicle(direction) {

    let vehicle =
        document.getElementById("vehicleType").value;


    let emoji = "🚑";


    if (vehicle === "Fire Truck") {

        emoji = "🚒";

    }


    if (vehicle === "Police Vehicle") {

        emoji = "🚓";

    }


    let vehicleArea =
        document.querySelector(
            "." +
            direction.toLowerCase() +
            "-vehicles"
        );


    if (!vehicleArea) {
        return;
    }


    vehicleArea.innerHTML =
        "<span>" +
        emoji +
        "</span>" +
        "<span>🚗</span>" +
        "<span>🚙</span>";
}


/* =========================================
   REMOVE EMERGENCY VEHICLE
========================================= */

function removeEmergencyVehicle() {

    let directions = [
        "north",
        "south",
        "east",
        "west"
    ];


    directions.forEach(function(direction) {

        let vehicleArea =
            document.querySelector(
                "." + direction + "-vehicles"
            );


        if (vehicleArea) {

            vehicleArea.innerHTML =
                "<span>🚗</span>" +
                "<span>🚙</span>" +
                "<span>🚕</span>";

        }

    });
}


/* =========================================
   START SYSTEM
========================================= */

window.onload = function() {

    /*
       Read initial traffic
       and start with highest traffic.
    */

    updateDirection(
        "north",
        Number(document.getElementById("northInput").value)
    );


    updateDirection(
        "south",
        Number(document.getElementById("southInput").value)
    );


    updateDirection(
        "east",
        Number(document.getElementById("eastInput").value)
    );


    updateDirection(
        "west",
        Number(document.getElementById("westInput").value)
    );


    let priorityOrder =
        getPriorityOrder();


    startSignal(
        priorityOrder[0]
    );

};